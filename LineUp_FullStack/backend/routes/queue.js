const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:id/queue', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT q.id, q.shop_id AS shopId, q.user_id AS userId, u.name AS userName,
           q.position, q.status, q.joined_at AS joinedAt, q.called_at AS calledAt
    FROM queue_entries q
    LEFT JOIN users u ON q.user_id = u.id
    WHERE q.shop_id = ?
    ORDER BY q.position ASC
  `;
  db.all(query, [id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch queue' });
    }
    res.json(rows);
  });
});

router.get('/:id/queue/my-entry', (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' });
  }

  const query = `
    SELECT q.id, q.shop_id AS shopId, q.user_id AS userId, u.name AS userName,
           q.position, q.status, q.joined_at AS joinedAt, q.called_at AS calledAt
    FROM queue_entries q
    LEFT JOIN users u ON q.user_id = u.id
    WHERE q.shop_id = ? AND q.user_id = ? AND q.status IN ('waiting', 'called')
  `;
  db.get(query, [id, userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch queue entry' });
    }
    if (!row) {
      return res.json(null);
    }
    res.json(row);
  });
});

router.post('/:id/join', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const getPositionSql = `SELECT MAX(position) AS maxPos FROM queue_entries WHERE shop_id = ? AND status = 'waiting'`;

  db.get(getPositionSql, [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to calculate position' });
    }

    const nextPosition = (row?.maxPos || 0) + 1;
    const entryId = `${id}-entry-${Date.now()}`;

    db.run(
      `INSERT INTO queue_entries (id, shop_id, user_id, position, status) VALUES (?, ?, ?, ?, 'waiting')`,
      [entryId, id, userId, nextPosition],
      function (insertErr) {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ error: 'Failed to join queue' });
        }
        res.json({ id: entryId, shopId: id, userId, position: nextPosition, status: 'waiting' });
      }
    );
  });
});

router.post('/:id/leave', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const cancelSql = `UPDATE queue_entries SET status = 'cancelled' WHERE shop_id = ? AND user_id = ? AND status = 'waiting'`;
  const updateSql = `
    UPDATE queue_entries
    SET position = position - 1
    WHERE shop_id = ? AND position > ? AND status = 'waiting'
  `;

  db.get(`SELECT position FROM queue_entries WHERE shop_id = ? AND user_id = ? AND status = 'waiting'`, [id, userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to check queue entry' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Queue entry not found' });
    }

    const userPosition = row.position;

    db.run(cancelSql, [id, userId], function (cancelErr) {
      if (cancelErr) {
        console.error(cancelErr);
        return res.status(500).json({ error: 'Failed to leave queue' });
      }

      db.run(updateSql, [id, userPosition], function (updateErr) {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ error: 'Failed to update queue positions' });
        }
        res.json({ success: true });
      });
    });
  });
});

router.post('/:id/call-next', (req, res) => {
  const { id } = req.params;

  const findNextSql = `
    SELECT * FROM queue_entries
    WHERE shop_id = ? AND status = 'waiting'
    ORDER BY position ASC
    LIMIT 1
  `;

  db.get(findNextSql, [id], (err, entry) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to find next entry' });
    }
    if (!entry) {
      return res.status(404).json({ error: 'No waiting entries in queue' });
    }

    db.run(
      `UPDATE queue_entries SET status = 'called', called_at = datetime('now') WHERE id = ?`,
      [entry.id],
      function (updateErr) {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ error: 'Failed to call next customer' });
        }
        res.json({
          id: entry.id,
          shopId: entry.shop_id,
          userId: entry.user_id,
          position: entry.position,
          status: 'called',
        });
      }
    );
  });
});

router.post('/:id/attend', (req, res) => {
  const { id } = req.params;

  const findCalledSql = `
    SELECT * FROM queue_entries
    WHERE shop_id = ? AND status = 'called'
    ORDER BY position ASC
    LIMIT 1
  `;

  db.get(findCalledSql, [id], (err, entry) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to find called entry' });
    }
    if (!entry) {
      return res.status(404).json({ error: 'No called entries found' });
    }

    db.run(
      `UPDATE queue_entries SET status = 'attended' WHERE id = ?`,
      [entry.id],
      function (updateErr) {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ error: 'Failed to mark as attended' });
        }

        db.run(
          `UPDATE queue_entries SET position = position - 1
           WHERE shop_id = ? AND position > ? AND status IN ('waiting', 'called')`,
          [id, entry.position],
          function (reorderErr) {
            if (reorderErr) {
              console.error(reorderErr);
            }
            res.json({
              id: entry.id,
              shopId: entry.shop_id,
              userId: entry.user_id,
              position: entry.position,
              status: 'attended',
            });
          }
        );
      }
    );
  });
});

router.post('/:id/skip', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason || !['no_show', 'owner_skip'].includes(reason)) {
    return res.status(400).json({ error: 'reason must be "no_show" or "owner_skip"' });
  }

  const findCalledSql = `
    SELECT * FROM queue_entries
    WHERE shop_id = ? AND status = 'called'
    ORDER BY position ASC
    LIMIT 1
  `;

  db.get(findCalledSql, [id], (err, entry) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to find called entry' });
    }
    if (!entry) {
      return res.status(404).json({ error: 'No called entries found' });
    }

    db.run(
      `UPDATE queue_entries SET status = 'skipped', skip_reason = ? WHERE id = ?`,
      [reason, entry.id],
      function (updateErr) {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ error: 'Failed to skip entry' });
        }

        db.run(
          `UPDATE queue_entries SET position = position - 1
           WHERE shop_id = ? AND position > ? AND status IN ('waiting', 'called')`,
          [id, entry.position],
          function (reorderErr) {
            if (reorderErr) {
              console.error(reorderErr);
            }
            res.json({
              id: entry.id,
              shopId: entry.shop_id,
              userId: entry.user_id,
              position: entry.position,
              status: 'skipped',
              skipReason: reason,
            });
          }
        );
      }
    );
  });
});

router.post('/:id/close', (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM shops WHERE id = ?`, [id], (err, shop) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to find shop' });
    }
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    db.all(
      `SELECT * FROM queue_entries WHERE shop_id = ?`,
      [id],
      (err, entries) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to fetch queue entries' });
        }

        const customersServed = entries.filter(e => e.status === 'attended').length;
        const customersSkipped = entries.filter(e => e.status === 'skipped').length;
        const noShows = entries.filter(e => e.skip_reason === 'no_show').length;
        const ownerSkips = entries.filter(e => e.skip_reason === 'owner_skip').length;
        const cancelled = entries.filter(e => e.status === 'cancelled').length;

        const calledEntries = entries.filter(e => e.called_at && e.joined_at);
        let avgWaitSeconds = null;
        if (calledEntries.length > 0) {
          const totalWait = calledEntries.reduce((sum, e) => {
            const joined = new Date(e.joined_at).getTime();
            const called = new Date(e.called_at).getTime();
            return sum + Math.max(0, (called - joined) / 1000);
          }, 0);
          avgWaitSeconds = Math.round(totalWait / calledEntries.length);
        }

        const waitingWithHours = entries.filter(e => e.joined_at);
        let peakHour = null;
        if (waitingWithHours.length > 0) {
          const hourCounts = {};
          waitingWithHours.forEach(e => {
            const h = new Date(e.joined_at).getHours();
            hourCounts[h] = (hourCounts[h] || 0) + 1;
          });
          peakHour = parseInt(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0]);
        }

        const statsId = `stats-${id}-${Date.now()}`;
        db.run(
          `INSERT INTO queue_stats (id, shop_id, date, customers_served, customers_skipped, no_shows, skips, cancelled, avg_wait_seconds, peak_hour)
           VALUES (?, ?, date('now'), ?, ?, ?, ?, ?, ?, ?)`,
          [statsId, id, customersServed, customersSkipped, noShows, ownerSkips, cancelled, avgWaitSeconds, peakHour],
          function (statsErr) {
            if (statsErr) {
              console.error(statsErr);
              return res.status(500).json({ error: 'Failed to save stats' });
            }

            db.run(
              `UPDATE shops SET is_open = 0 WHERE id = ?`,
              [id],
              function (closeErr) {
                if (closeErr) {
                  console.error(closeErr);
                  return res.status(500).json({ error: 'Failed to close shop' });
                }
                res.json({
                  success: true,
                  stats: {
                    customersServed,
                    customersSkipped,
                    noShows,
                    ownerSkips,
                    cancelled,
                    avgWaitSeconds,
                    peakHour,
                  },
                });
              }
            );
          }
        );
      }
    );
  });
});

module.exports = router;