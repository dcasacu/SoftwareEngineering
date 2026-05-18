const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const rows = db.prepare(`
    SELECT s.id, s.name, s.category, s.location_x AS locationX, s.location_y AS locationY,
           s.lat, s.lng, s.is_open AS isOpen, s.avg_service_time AS avgServiceTime,
           s.owner_id AS ownerId, u.name AS ownerName
    FROM shops s
    LEFT JOIN users u ON s.owner_id = u.id
  `).all();
  res.json(rows);
});

router.get('/search', (req, res) => {
  const { q, category } = req.query;
  let sql = `
    SELECT s.id, s.name, s.category, s.location_x AS locationX, s.location_y AS locationY,
           s.lat, s.lng, s.is_open AS isOpen, s.avg_service_time AS avgServiceTime,
           s.owner_id AS ownerId, u.name AS ownerName
    FROM shops s
    LEFT JOIN users u ON s.owner_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (q) {
    sql += ` AND s.name LIKE ?`;
    params.push(`%${q}%`);
  }
  if (category && category !== 'All') {
    sql += ` AND s.category = ?`;
    params.push(category);
  }

  const rows = db.prepare(sql).all(...params);
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const row = db.prepare(`
    SELECT s.id, s.name, s.category, s.location_x AS locationX, s.location_y AS locationY,
           s.lat, s.lng, s.is_open AS isOpen, s.avg_service_time AS avgServiceTime,
           s.owner_id AS ownerId, u.name AS ownerName
    FROM shops s
    LEFT JOIN users u ON s.owner_id = u.id
    WHERE s.id = ?
  `).get(id);
  if (!row) {
    return res.status(404).json({ error: 'Shop not found' });
  }
  res.json(row);
});

router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { isOpen } = req.body;

  if (typeof isOpen !== 'boolean' && isOpen !== 0 && isOpen !== 1) {
    return res.status(400).json({ error: 'isOpen boolean is required' });
  }

  const isOpenVal = isOpen ? 1 : 0;

  const result = db.prepare(`UPDATE shops SET is_open = ? WHERE id = ?`).run(isOpenVal, id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Shop not found' });
  }

  const row = db.prepare(`
    SELECT s.id, s.name, s.category, s.location_x AS locationX, s.location_y AS locationY,
           s.lat, s.lng, s.is_open AS isOpen, s.avg_service_time AS avgServiceTime,
           s.owner_id AS ownerId, u.name AS ownerName
    FROM shops s
    LEFT JOIN users u ON s.owner_id = u.id
    WHERE s.id = ?
  `).get(id);

  res.json(row);
});

router.get('/:id/analytics', (req, res) => {
  const { id } = req.params;

  const shop = db.prepare(`SELECT id, name FROM shops WHERE id = ?`).get(id);
  if (!shop) {
    return res.status(404).json({ error: 'Shop not found' });
  }

  function computeStats(dateFilter) {
    const whereClause = dateFilter
      ? `shop_id = ? AND date(joined_at) = date('now')`
      : `shop_id = ?`;

    const entries = db.prepare(
      `SELECT * FROM queue_entries WHERE ${whereClause}`
    ).all(id);

    const totalCustomers = entries.length;
    const customersServed = entries.filter(e => e.status === 'attended').length;
    const noShows = entries.filter(e => e.skip_reason === 'no_show').length;
    const skipped = entries.filter(e => e.skip_reason === 'owner_skip').length;
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

    let peakHour = null;
    if (entries.length > 0) {
      const hourCounts = {};
      entries.forEach(e => {
        if (e.joined_at) {
          const h = new Date(e.joined_at).getHours();
          hourCounts[h] = (hourCounts[h] || 0) + 1;
        }
      });
      const sorted = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) {
        peakHour = parseInt(sorted[0][0]);
      }
    }

    const denominator = customersServed + skipped + cancelled;
    const serviceRate = denominator > 0 ? parseFloat((customersServed / denominator).toFixed(2)) : 0;

    return {
      totalCustomers,
      customersServed,
      noShows,
      skipped,
      cancelled,
      avgWaitSeconds,
      peakHour,
      serviceRate,
    };
  }

  res.json({
    shopId: id,
    shopName: shop.name,
    today: computeStats(true),
    allTime: computeStats(false),
  });
});

module.exports = router;