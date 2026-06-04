const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shops');
const queueRoutes = require('./routes/queue');
const marketRoutes = require('./routes/markets');

app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/shops', queueRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});