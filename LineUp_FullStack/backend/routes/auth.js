const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

const pass123 = bcrypt.hashSync('pass123', 10);
const qwerty = bcrypt.hashSync('qwerty', 10);

router.post('/anon', (req, res) => {
  const anonUserId = `anon-${Date.now()}`;
  try {
    db.prepare(`INSERT INTO users (id, role) VALUES (?, 'anon')`).run(anonUserId);
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
    const result = db.prepare(
      `UPDATE users SET name = ?, email = ?, password = ?, role = 'customer' WHERE id = ? AND role = 'anon'`
    ).run(name, email, hashedPassword, anonUserId);
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
  const { email, password, anonUserId } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const bcrypt = require('bcryptjs');
  const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

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

  if (anonUserId && anonUserId !== user.id) {
    try {
      migrateAnonymousQueues(anonUserId, user.id);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to migrate anonymous queue entries' });
    }
  }

  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

const activeStatuses = "('waiting', 'called')";

const migrateAnonymousQueues = db.transaction((anonUserId, userId) => {
  const anonUser = db.prepare(`SELECT id FROM users WHERE id = ? AND role = 'anon'`).get(anonUserId);
  if (!anonUser) return;

  const anonEntries = db.prepare(`
    SELECT id, shop_id AS shopId, position
    FROM queue_entries
    WHERE user_id = ? AND status IN ${activeStatuses}
    ORDER BY shop_id, position ASC
  `).all(anonUserId);

  const findUserEntry = db.prepare(`
    SELECT id, position
    FROM queue_entries
    WHERE shop_id = ? AND user_id = ? AND status IN ${activeStatuses}
  `);
  const updateEntryUser = db.prepare(`UPDATE queue_entries SET user_id = ? WHERE id = ?`);
  const deleteEntry = db.prepare(`DELETE FROM queue_entries WHERE id = ?`);
  const advancePositionsAfter = db.prepare(`
    UPDATE queue_entries
    SET position = position - 1
    WHERE shop_id = ? AND position > ? AND status IN ${activeStatuses}
  `);

  for (const anonEntry of anonEntries) {
    const userEntry = findUserEntry.get(anonEntry.shopId, userId);

    if (!userEntry) {
      updateEntryUser.run(userId, anonEntry.id);
      continue;
    }

    if (anonEntry.position < userEntry.position) {
      deleteEntry.run(userEntry.id);
      advancePositionsAfter.run(anonEntry.shopId, userEntry.position);
      updateEntryUser.run(userId, anonEntry.id);
    } else {
      deleteEntry.run(anonEntry.id);
      advancePositionsAfter.run(anonEntry.shopId, anonEntry.position);
    }
  }

  db.prepare(`
    DELETE FROM users
    WHERE id = ? AND role = 'anon'
      AND NOT EXISTS (SELECT 1 FROM queue_entries WHERE user_id = ?)
  `).run(anonUserId, anonUserId);
});

router.post('/logout', (req, res) => {
  res.json({ success: true });
});

router.delete('/anon/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare(`DELETE FROM queue_entries WHERE user_id = ?`).run(id);
    const result = db.prepare(`DELETE FROM users WHERE id = ? AND role = 'anon'`).run(id);
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
    db.prepare(`DELETE FROM queue_entries WHERE user_id = ?`).run(id);
    const result = db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
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
