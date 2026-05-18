const express = require('express');
const router = express.Router();
const db = require('../db');


// ─── SHOP ENDPOINTS ───────────────────────────────────────────────────────────

// Endpoint to fetch all shops with their details and owner information
router.get('/', (req, res) => {
  const query = `
    SELECT s.id, s.name, s.category, s.location_x AS locationX, s.location_y AS locationY,
           s.lat, s.lng, s.is_open AS isOpen, s.avg_service_time AS avgServiceTime,
           s.owner_id AS ownerId, u.name AS ownerName
    FROM shops s
    LEFT JOIN users u ON s.owner_id = u.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch shops' });
    }
    res.json(rows);
  });
});

// Search must come before /:id so Express doesn't treat 'search' as an ID param
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

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to search shops' });
    }
    res.json(rows);
  });
});

// Endpoint to fetch the details of a single shop by its ID. It queries the database for the shop with the specified ID and returns its details in the response.
// If the shop is not found, it returns a 404 error. If there is a database error, it returns a 500 error.
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT s.id, s.name, s.category, s.location_x AS locationX, s.location_y AS locationY,
           s.lat, s.lng, s.is_open AS isOpen, s.avg_service_time AS avgServiceTime,
           s.owner_id AS ownerId, u.name AS ownerName
    FROM shops s
    LEFT JOIN users u ON s.owner_id = u.id
    WHERE s.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch shop details' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    res.json(row);
  });
});

router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { isOpen } = req.body;

  if (typeof isOpen !== 'boolean' && isOpen !== 0 && isOpen !== 1) {
    return res.status(400).json({ error: 'isOpen boolean is required' });
  }

  const isOpenVal = isOpen ? 1 : 0;

  db.run(
    `UPDATE shops SET is_open = ? WHERE id = ?`,
    [isOpenVal, id],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update shop status' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Shop not found' });
      }
      res.json({ id, isOpen: !!isOpenVal });
    }
  );
});

module.exports = router; // Export the router so it can be used in the main server file to handle shop-related routes.