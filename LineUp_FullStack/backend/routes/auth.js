const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/anon', (req, res) => {
  const anonUserId = `anon-${Date.now()}`;
  try {
    db.run(`INSERT INTO users (id, role) VALUES (?, 'anon')`, [anonUserId]);
    res.json({ id: anonUserId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create anonymous user' });
  }
});

router.post('/register', (req, res) => {
  const { anonUserId, name, email, password } = req.body;

  if (!anonUserId || !name || !email || !password) {
    return res.status(400).json({ error: 'anonUserId, name, email, and password are required' });
  }

  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const result = db.run(
      `UPDATE users SET name = ?, email = ?, password = ?, role = 'customer' WHERE id = ? AND role = 'anon'`,
      [name, email, hashedPassword, anonUserId]
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Anonymous user not found or already upgraded' });
    }
    res.json({ id: anonUserId, name, email, role: 'customer' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upgrade anonymous user' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const bcrypt = require('bcryptjs');
  const user = db.get(`SELECT * FROM users WHERE email = ?`, [email]);

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

  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

router.post('/logout', (req, res) => {
  res.json({ success: true });
});

router.delete('/anon/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.run(`DELETE FROM queue_entries WHERE user_id = ?`, [id]);
    const result = db.run(`DELETE FROM users WHERE id = ? AND role = 'anon'`, [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Anonymous user not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete anonymous user' });
  }
});

router.delete('/account/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.run(`DELETE FROM queue_entries WHERE user_id = ?`, [id]);
    const result = db.run(`DELETE FROM users WHERE id = ?`, [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;