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


// ─── AUTH ENDPOINTS ───────────────────────────────────────────────────────────

// Endpoint to generate an anonymous user ID when the app is opened.
// It creates a unique ID based on the current timestamp and returns it in the response.
app.post('/api/auth/anon', (req, res) => {
  const anonUserId = `anon-${Date.now()}`;
  db.run(`INSERT INTO users (id, role) VALUES (?, 'anon')`, [anonUserId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create anonymous user' });
    }
    res.json({ id: anonUserId });
  });
}); 

// Endpoint to upgrade an anonymous user to a full account. It requires the anonymous user ID, name, and email in the request body.
// If any of these fields are missing, it returns a 400 error. TODO: Implement logic to update the user's role to 'customer' and save their name and email in the database.
app.post('/api/auth/register', (req, res) => {
  const { anonUserId, name, email } = req.body;

  if (!anonUserId || !name || !email) {
    return res.status(400).json({ error: 'anonUserId, name, and email are required' });
  }
}); 

// Endpoint for user login. It requires email and password in the request body. If either field is missing, it returns a 400 error.
// TODO: Implement login logic (password verification).
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
});


// ─── SHOP ENDPOINTS ───────────────────────────────────────────────────────────

// Endpoint to fetch all shops with their details and owner information
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
});

app.get('/api/shops/search', (req, res) => {
  // Search and filter shops based on query parameters (e.g., name, category)

  // Get query parameters: q (search term), category (filter by category)
  // Build SQL query based on provided parameters
  // Execute query and return results
});

// Endpoint to fetch the details of a single shop by its ID. It queries the database for the shop with the specified ID and returns its details in the response.
// If the shop is not found, it returns a 404 error. If there is a database error, it returns a 500 error.
app.get('/api/shops/:id', (req, res) => {
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


app.patch('/api/shops/:id/status', (req, res) => {
  // Change queue status, i.e., open and close queue

  // Get shop ID from params and new status (isOpen) from request body
  // Update the shop's is_open status in the database
  // Return the updated shop details in the response
});


// ─── QUEUE ENDPOINTS ──────────────────────────────────────────────────────────


// Endpoint to fetch the queue entries for a specific shop, including user details and ordered by position
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
});

app.get('/api/shops/:id/queue/my-entry', (req, res) => {
  // Get the user's queue entry for a specific shop

  // Get shop ID from params and userId from query parameters
  // Query the database for the queue entry matching the shop ID and user ID
  // Return the queue entry details in the response
  // Used 
});


// Endpoint to allow a user to join the queue for a specific shop. It calculates the next position in the queue and inserts a new entry into the database.
app.post('/api/shops/:id/join', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const getPositionSql = `SELECT MAX(position) AS maxPos FROM queue_entries WHERE shop_id = ? AND status = 'waiting'`; // Get the maximum position currently in the queue for the specified shop.

  db.get(getPositionSql, [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to calculate position' });
    } // If there are no entries in the queue, maxPos will be null, so we default to 0 and add 1 for the new position.

    const nextPosition = (row?.maxPos || 0) + 1; // Get max position or 0, then add 1 for the new entry's position.
    const entryId = `${id}-entry-${Date.now()}`; // Generate a unique ID for the new queue entry based on the shop ID and current timestamp.

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
    ); // Insert a new entry into the queue_entries table with the generated ID, shop ID, user ID, calculated position, and a default status of 'waiting'.
       // If the insertion is successful, it returns the details of the new queue entry in the response. If there is an error during insertion, it logs the error and returns a 500 error response.
  });
});


// Endpoint to allow a user to leave the queue for a specific shop. It deletes the user's queue entry and updates the positions of the remaining entries accordingly.
app.post('/api/shops/:id/leave', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const cancelSql = `UPDATE queue_entries SET status = 'cancelled' WHERE shop_id = ? AND user_id = ? AND status = 'waiting'`;
  // No need to update the leaver's position to null since we will filter out cancelled entries when fetching the queue.
  // This way we can keep a record of cancellations for stats purposes without affecting the positions of other entries in the queue.

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

    db.run(cancelSql, [id, userId], function (cancelErr) { // Run cancel
      if (cancelErr) {
        console.error(cancelErr);
        return res.status(500).json({ error: 'Failed to leave queue' });
      }

      db.run(updateSql, [id, userPosition], function (updateErr) { // Run update after cancel
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ error: 'Failed to update queue positions' });
        }

        res.json({ success: true });
      });
    });
  });
});

app.post('/api/shops/:id/attend', (req, res) => {
  // Find the user with shop ID and status = "called", edit to "attended"
});

app.post('/api/shops/:id/call-next', (req, res) => {
  //Call after atetnd, skip or cancel
  // Get shop ID as param
  // Find last "waiting" entry for the shop, ordered by position, edit the status to 'called' and update called_at timestamp
});

app.post('/api/shops/:id/skip', (req, res) => {
  // Find the user with shop ID and status = "called", edit to "skipped", and set the reason to either "no_show" or "owner_skip"
  // meaning owner skips them either bc they didn't show up or some other reason
  const { reason } = req.body;
  // Validate reason is either "no_show" or "owner_skip"
  // Update the queue entry with the new status and skip reason
});

app.post('/api/shops/:id/close', (req, res) => {
  // Close queue for the day and upload stats to the queue_stats table. This will be called at the end of the day by the shop owner.
  // It will calculate the total customers served, skipped, no-shows, average wait time, and peak hour, and insert a new entry into the queue_stats table for that shop and date.
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
