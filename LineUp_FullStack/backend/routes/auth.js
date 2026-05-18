const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

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

router.post('/register', (req, res) => {
  const { anonUserId, name, email, password } = req.body;

  if (!anonUserId || !name || !email || !password) {
    return res.status(400).json({ error: 'anonUserId, name, email, and password are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `UPDATE users SET name = ?, email = ?, password = ?, role = 'customer' WHERE id = ? AND role = 'anon'`,
    [name, email, hashedPassword, anonUserId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to upgrade anonymous user' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Anonymous user not found or already upgraded' });
      }
      res.json({ id: anonUserId, name, email, role: 'customer' });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to find user' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (!user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  });
});

router.post('/logout', (req, res) => {
  res.json({ success: true });
});

router.delete('/anon/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM queue_entries WHERE user_id = ?`, [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete queue entries' });
    }

    db.run(`DELETE FROM users WHERE id = ? AND role = 'anon'`, [id], function (err2) {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: 'Failed to delete anonymous user' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Anonymous user not found' });
      }
      res.json({ success: true });
    });
  });
});

router.delete('/account/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM queue_entries WHERE user_id = ?`, [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete queue entries' });
    }

    db.run(`DELETE FROM users WHERE id = ?`, [id], function (err2) {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: 'Failed to delete user' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true });
    });
  });
});

module.exports = router;