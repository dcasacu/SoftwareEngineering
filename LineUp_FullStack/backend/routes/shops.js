const express = require('express');
const router = express.Router();
const db = require('../db');


// ─── SHOP ENDPOINTS ───────────────────────────────────────────────────────────

// Endpoint to fetch all shops with their details and owner information
router.get('/', (req, res) => {
  const query = `
    SELECT s.id, s.name, s.category, s.location_x AS locationX, s.location_y AS locationY,
           s.is_open AS isOpen, s.avg_service_time AS avgServiceTime,
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
  // Search and filter shops based on query parameters (e.g., name, category)

  // Get query parameters: q (search term), category (filter by category)
  // Build SQL query based on provided parameters
  // Execute query and return results
});

// Endpoint to fetch the details of a single shop by its ID. It queries the database for the shop with the specified ID and returns its details in the response.
// If the shop is not found, it returns a 404 error. If there is a database error, it returns a 500 error.
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM shops WHERE id = ?`;
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
  // Change queue status, i.e., open and close queue

  // Get shop ID from params and new status (isOpen) from request body
  // Update the shop's is_open status in the database
  // Return the updated shop details in the response
});

module.exports = router; // Export the router so it can be used in the main server file to handle shop-related routes.