const express = require('express');
const cors = require('cors');

const app = express(); // Create HTTP server instance
const PORT = process.env.PORT || 4000; // Define the port for the server to listen to

app.use(cors()); // Enable browser/mobile requests
app.use(express.json()); // Middleware to parse JSON request bodies

// ─── ROUTES ───────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shops');
const queueRoutes = require('./routes/queue');

app.use('/api/auth', authRoutes); // Use authentication routes for any requests starting with /api/auth. This will handle user registration, login, and logout functionality.
app.use('/api/shops', shopRoutes); // Use shop management routes for any requests starting with /api/shops. This will handle creating, updating, and retrieving shop information, as well as managing shop status (open/closed) and average service time.
app.use('/api/shops', queueRoutes); // Use queue management routes for any requests starting with /api/shops. This will handle joining the queue, calling the next customer, skipping customers, and retrieving queue status for a specific shop.

// ─── START SERVER ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
