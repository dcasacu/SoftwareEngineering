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

module.exports = router;