const express = require('express');
const router = express.Router();
const db = require('../db');


// ─── AUTH ENDPOINTS ───────────────────────────────────────────────────────────

// Endpoint to generate an anonymous user ID when the app is opened.
// It creates a unique ID based on the current timestamp and returns it in the response.
router.post('/anon', (req, res) => {
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
// If any of these fields are missing, it returns a 400 error. It updates the user's record in the database to set the name, email, and change the role from 'anon' to 'customer'.
// If the update is successful, it returns the updated user information in the response. If the anonymous user is not found or already upgraded, it returns a 404 error.
// If there is a database error, it returns a 500 error.
router.post('/register', (req, res) => {
  const { anonUserId, name, email } = req.body;

  if (!anonUserId || !name || !email) {
    return res.status(400).json({ error: 'anonUserId, name, and email are required' });
  }

  db.run(`UPDATE users SET name = ?, email = ?, role = 'customer' WHERE id = ? AND role = 'anon'`, [name, email, anonUserId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to upgrade anonymous user' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Anonymous user not found or already upgraded' });
    }
    res.json({ id: anonUserId, name, email, role: 'customer' });
  });

});

// Endpoint for user login. It requires email and password in the request body. If either field is missing, it returns a 400 error.
// TODO: Implement login logic (password verification).
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // TODO: Implement login logic (password verification).

});

router.post('/logout', (req, res) => {
  // Endpoint for user logout. It requires the user ID in the request body. If the user ID is missing, it returns a 400 error.
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // TODO: Implement logout logic (e.g., invalidate the user's session).
});

router.delete('/anon/:id', (req, res) => {
  // Endpoint to delete an anonymous user account. It requires the anonymous user ID as a URL parameter. If the user ID is missing, it returns a 400 error.
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // TODO: Implement anonymous user deletion logic.
});

router.delete('/account/:id', (req, res) => {
  // Endpoint to delete a full user account. It requires the user ID as a URL parameter. If the user ID is missing, it returns a 400 error.
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // TODO: Implement full user deletion logic.
});

module.exports = router; // Export the router so it can be used in the main server file to handle authentication-related routes.