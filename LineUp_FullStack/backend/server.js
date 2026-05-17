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

app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/shops', queueRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
