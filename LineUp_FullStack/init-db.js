const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'lineup.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('customer', 'owner')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create shops table
db.run(`
  CREATE TABLE IF NOT EXISTS shops (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    location_x REAL,
    location_y REAL,
    is_open BOOLEAN DEFAULT 1,
    avg_service_time INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  )
`);

// Create queue_entries table
db.run(`
  CREATE TABLE IF NOT EXISTS queue_entries (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    position INTEGER NOT NULL,
    status TEXT CHECK(status IN ('waiting', 'called', 'attended', 'skipped', 'cancelled')) DEFAULT 'waiting',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    called_at DATETIME,
    FOREIGN KEY (shop_id) REFERENCES shops(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Create queue_stats table
db.run(`
  CREATE TABLE IF NOT EXISTS queue_stats (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    date DATE,
    customers_served INTEGER DEFAULT 0,
    avg_wait_time INTEGER,
    no_shows INTEGER DEFAULT 0,
    peak_hour INTEGER,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
  )
`);

// Insert sample users (shop owners)
const owners = [
  ['owner1', 'Joan Martí', 'joan@martifruits.com', 'owner'],
  ['owner2', 'Josep Vila', 'josep@pepsbakery.com', 'owner'],
  ['owner3', 'Rosa Puig', 'rosa@lapeixateria.com', 'owner'],
  ['owner4', 'Montse Soler', 'montse@carnissera.com', 'owner'],
  ['owner5', 'Ahmed Bensali', 'ahmed@especies.com', 'owner'],
  ['owner6', 'Núria Costa', 'nuria@florsiplantes.com', 'owner'],
];

owners.forEach(owner => {
  db.run(
    `INSERT OR IGNORE INTO users (id, name, email, role) VALUES (?, ?, ?, ?)`,
    owner
  );
});

// Insert sample shops
const shops = [
  ['shop1', 'owner1', "Martí's Fruits", 'Fruits & Veg', 28, 22, 1, 4],
  ['shop2', 'owner2', "Pep's Bakery", 'Bakery', 55, 38, 1, 3],
  ['shop3', 'owner3', 'La Peixateria', 'Fish', 70, 62, 1, 6],
  ['shop4', 'owner4', 'Ca la Carnissera', 'Meat', 40, 65, 0, 5],
  ['shop5', 'owner5', "Espècies del Món", 'Spices', 18, 58, 1, 2],
  ['shop6', 'owner6', 'Flors i Plantes', 'Flowers', 78, 28, 1, 3],
];

shops.forEach(shop => {
  db.run(
    `INSERT OR IGNORE INTO shops (id, owner_id, name, category, location_x, location_y, is_open, avg_service_time) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    shop
  );
});

// Insert sample customers
const customers = [
  ['cust1', 'Anna García', 'anna@email.com', 'customer'],
  ['cust2', 'Pere Martínez', 'pere@email.com', 'customer'],
  ['cust3', 'Laia Fernández', 'laia@email.com', 'customer'],
  ['cust4', 'Maria Torres', 'maria@email.com', 'customer'],
];

customers.forEach(cust => {
  db.run(
    `INSERT OR IGNORE INTO users (id, name, email, role) VALUES (?, ?, ?, ?)`,
    cust
  );
});

// Insert sample queue entries
db.run(`
  INSERT OR IGNORE INTO queue_entries (id, shop_id, user_id, position, status, joined_at)
  VALUES 
    ('qe1', 'shop1', 'cust1', 1, 'waiting', datetime('now', '-20 minutes')),
    ('qe2', 'shop1', 'cust2', 2, 'waiting', datetime('now', '-15 minutes')),
    ('qe3', 'shop2', 'cust3', 1, 'waiting', datetime('now', '-10 minutes')),
    ('qe4', 'shop3', 'cust4', 1, 'called', datetime('now', '-25 minutes'), datetime('now', '-2 minutes'))
`);

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
    process.exit(1);
  }
  console.log('Database initialized successfully');
});