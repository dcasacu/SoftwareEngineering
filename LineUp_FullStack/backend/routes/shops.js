const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const rows = db.prepare(`
    SELECT s.id, s.name, s.category, s.location_x AS locationX, s.location_y AS locationY,
           s.lat, s.lng, s.market_id AS marketId, s.is_open AS isOpen, s.avg_service_time AS avgServiceTime,
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
           s.lat, s.lng, s.market_id AS marketId, s.is_open AS isOpen, s.avg_service_time AS avgServiceTime,
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
           s.lat, s.lng, s.market_id AS marketId, s.is_open AS isOpen, s.avg_service_time AS avgServiceTime,
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
           s.lat, s.lng, s.market_id AS marketId, s.is_open AS isOpen, s.avg_service_time AS avgServiceTime,
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

  function computeAllTimeStats() {
    const statsRows = db.prepare(
      `SELECT * FROM queue_stats WHERE shop_id = ?`
    ).all(id);

    if (statsRows.length === 0) {
      return {
        totalCustomers: 0,
        customersServed: 0,
        noShows: 0,
        skipped: 0,
        cancelled: 0,
        avgWaitSeconds: null,
        peakHour: null,
        serviceRate: 0,
      };
    }

    let totalCustomers = 0;
    let customersServed = 0;
    let noShows = 0;
    let skipped = 0;
    let cancelled = 0;
    let totalWait = 0;
    let waitCount = 0;
    const hourCounts = {};

    for (const s of statsRows) {
      totalCustomers += s.customers_served + s.customers_skipped + s.cancelled;
      customersServed += s.customers_served;
      noShows += s.no_shows;
      skipped += s.skips;
      cancelled += s.cancelled;

      if (s.avg_wait_seconds !== null) {
        const servedPlusSkipped = s.customers_served + s.customers_skipped;
        totalWait += s.avg_wait_seconds * servedPlusSkipped;
        waitCount += servedPlusSkipped;
      }

      if (s.peak_hour !== null) {
        hourCounts[s.peak_hour] = (hourCounts[s.peak_hour] || 0) + 1;
      }
    }

    const avgWaitSeconds = waitCount > 0 ? Math.round(totalWait / waitCount) : null;

    let peakHour = null;
    if (Object.keys(hourCounts).length > 0) {
      const sorted = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]);
      peakHour = parseInt(sorted[0][0]);
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

  function getTodayStats() {
    return null;
  }

  res.json({
    shopId: id,
    shopName: shop.name,
    today: getTodayStats(),
    allTime: computeAllTimeStats(),
  });
});

module.exports = router;