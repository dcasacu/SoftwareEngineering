const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const rows = db.prepare(`
    SELECT id, name, lat, lng, address, operating_hours AS operatingHours,
           description, map_image_url AS mapImageUrl
    FROM markets
    ORDER BY name
  `).all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const market = db.prepare(`
    SELECT id, name, lat, lng, address, operating_hours AS operatingHours,
           description, map_image_url AS mapImageUrl
    FROM markets
    WHERE id = ?
  `).get(id);

  if (!market) {
    return res.status(404).json({ error: 'Market not found' });
  }

  res.json(market);
});

module.exports = router;
