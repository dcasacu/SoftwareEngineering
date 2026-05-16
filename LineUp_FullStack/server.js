const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express(); // Create HTTP server instance
const PORT = process.env.PORT || 4000; // Define the port for the server tol listen to
const dbPath = path.join(__dirname, 'lineup.db'); // Path to the SQLite database file

app.use(cors()); // Enable browser/mobile requests
app.use(express.json()); // Middleware to parse JSON request bodies

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
}); // Create DB constant and connect to the SQLite database

app.get('/api/shops', (req, res) => {
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
}); // Endpoint to fetch all shops with their details and owner information

app.get('/api/shops/:id/queue', (req, res) => {
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
}); // Endpoint to fetch the queue entries for a specific shop, including user details and ordered by position

app.post('/api/shops/:id/join', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const getPositionSql = `SELECT MAX(position) AS maxPos FROM queue_entries WHERE shop_id = ?`;

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
}); // Endpoint to allow a user to join the queue for a specific shop. It calculates the next position in the queue and inserts a new entry into the database.

app.post('/api/shops/:id/leave', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const deleteSql = `DELETE FROM queue_entries WHERE shop_id = ? AND user_id = ?`;
  const updateSql = `
    UPDATE queue_entries
    SET position = position - 1
    WHERE shop_id = ? AND position > ?
  `;

  db.get(`SELECT position FROM queue_entries WHERE shop_id = ? AND user_id = ?`, [id, userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to check queue entry' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Queue entry not found' });
    }

    const userPosition = row.position;

    db.run(deleteSql, [id, userId], function (deleteErr) {
      if (deleteErr) {
        console.error(deleteErr);
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
}); // Endpoint to allow a user to leave the queue for a specific shop. It deletes the user's queue entry and updates the positions of the remaining entries accordingly.

app.post('/api/shops/:id/attend', (req, res) => {
  // Find the user with shop ID and status = "called", edit to "attended"
});

app.post('/api/shops/:id/skip', (req, res) => {
  // Find the user with shop ID and status = "called", edit to "skipped"
});

app.post('/api/shops/:id/cancel', (req, res) => {
  // Find the user with shop ID and status = "called", edit to "cancelled"
});

app.post('/api/shops/:id/call-next', (req, res) => {
  const { id } = req.params;
  const getNextSql = `SELECT id, user_id AS userId FROM queue_entries WHERE shop_id = ? AND status = 'waiting' ORDER BY position ASC LIMIT 1`;
  const updateSql = `UPDATE queue_entries SET status = 'called', called_at = CURRENT_TIMESTAMP WHERE id = ?`;
  
  //Call after atetnd, skip or cancel
  // Get shop ID as param
  // Find last "waiting" entry for the shop, ordered by position, edit the status to 'called' and update called_at timestamp
  
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
