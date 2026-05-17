const express = require('express');
const router = express.Router();
const db = require('../db');


// ─── QUEUE ENDPOINTS ──────────────────────────────────────────────────────────


// Endpoint to fetch the queue entries for a specific shop, including user details and ordered by position
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
  // Get the user's queue entry for a specific shop

  // Get shop ID from params and userId from query parameters
  // Query the database for the queue entry matching the shop ID and user ID
  // Return the queue entry details in the response
});


// Endpoint to allow a user to join the queue for a specific shop. It calculates the next position in the queue and inserts a new entry into the database.
router.post('/:id/join', (req, res) => {
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


// Endpoint to allow a user to leave the queue for a specific shop. It updates the user's queue entry status to 'cancelled' and updates the positions of the remaining entries accordingly.
router.post('/:id/leave', (req, res) => {
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

router.post('/:id/attend', (req, res) => {
  // Find the user with shop ID and status = "called", edit to "attended"
});

router.post('/:id/call-next', (req, res) => {
  // Call after attend, skip or cancel
  // Get shop ID as param
  // Find last "waiting" entry for the shop, ordered by position, edit the status to 'called' and update called_at timestamp
});

router.post('/:id/skip', (req, res) => {
  // Find the user with shop ID and status = "called", edit to "skipped", and set the reason to either "no_show" or "owner_skip"
  // meaning owner skips them either bc they didn't show up or some other reason
  const { reason } = req.body;
  // Validate reason is either "no_show" or "owner_skip"
  // Update the queue entry with the new status and skip reason
});

router.post('/:id/close', (req, res) => {
  // Close queue for the day and upload stats to the queue_stats table. This will be called at the end of the day by the shop owner.
  // It will calculate the total customers served, skipped, no-shows, average wait time, and peak hour, and insert a new entry into the queue_stats table for that shop and date.
});

module.exports = router; // Export the router so it can be used in the main server file to handle queue-related routes.