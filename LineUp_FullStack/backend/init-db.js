const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('customer', 'owner', 'anon')) NOT NULL,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shops (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    location_x REAL,
    location_y REAL,
    lat REAL,
    lng REAL,
    is_open BOOLEAN DEFAULT 0,
    avg_service_time INTEGER DEFAULT 300,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS queue_entries (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    position INTEGER NOT NULL,
    status TEXT CHECK(status IN ('waiting', 'called', 'attended', 'skipped', 'cancelled')) DEFAULT 'waiting',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    called_at DATETIME,
    skip_reason TEXT CHECK(skip_reason IN ('no_show', 'owner_skip', NULL)),
    FOREIGN KEY (shop_id) REFERENCES shops(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS queue_stats (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    date DATE,
    customers_served INTEGER DEFAULT 0,
    customers_skipped INTEGER DEFAULT 0,
    no_shows INTEGER DEFAULT 0,
    skips INTEGER DEFAULT 0,
    cancelled INTEGER DEFAULT 0,
    avg_wait_seconds INTEGER,
    peak_hour INTEGER,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS one_active_entry_per_user_shop
  ON queue_entries(shop_id, user_id)
  WHERE status IN ('waiting', 'called');
`);

const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, name, email, role) VALUES (?, ?, ?, ?)');
const insertManyUsers = db.transaction((rows) => { for (const row of rows) insertUser.run(...row); });

insertManyUsers([
  ['owner1', 'Joan Martí', 'joan@martifruits.com', 'owner'],
  ['owner2', 'Josep Vila', 'josep@pepsbakery.com', 'owner'],
  ['owner3', 'Rosa Puig', 'rosa@lapeixateria.com', 'owner'],
  ['owner4', 'Montse Soler', 'montse@carnissera.com', 'owner'],
  ['owner5', 'Ahmed Bensali', 'ahmed@especies.com', 'owner'],
  ['owner6', 'Núria Costa', 'nuria@florsiplantes.com', 'owner'],
]);

const insertShop = db.prepare('INSERT OR IGNORE INTO shops (id, owner_id, name, category, location_x, location_y, lat, lng, is_open, avg_service_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const insertManyShops = db.transaction((rows) => { for (const row of rows) insertShop.run(...row); });

insertManyShops([
  ['shop1', 'owner1', "Martí's Fruits", 'Fruits & Veg', 28, 22, 41.382, 2.177, 1, 240],
  ['shop2', 'owner2', "Pep's Bakery", 'Bakery', 55, 38, 41.383, 2.179, 1, 180],
  ['shop3', 'owner3', 'La Peixateria', 'Fish', 70, 62, 41.381, 2.180, 1, 360],
  ['shop4', 'owner4', 'Ca la Carnissera', 'Meat', 40, 65, 41.380, 2.178, 0, 300],
  ['shop5', 'owner5', "Espècies del Món", 'Spices', 18, 58, 41.382, 2.175, 1, 120],
  ['shop6', 'owner6', 'Flors i Plantes', 'Flowers', 78, 28, 41.384, 2.181, 1, 180],
]);

insertManyUsers([
  ['cust1', 'Anna García', 'anna@email.com', 'customer'],
  ['cust2', 'Pere Martínez', 'pere@email.com', 'customer'],
  ['cust3', 'Laia Fernández', 'laia@email.com', 'customer'],
  ['cust4', 'Maria Torres', 'maria@email.com', 'customer'],
]);

db.exec(`
  INSERT OR IGNORE INTO queue_entries (id, shop_id, user_id, position, status, joined_at)
  VALUES
    ('qe1', 'shop1', 'cust1', 1, 'waiting', datetime('now', '-20 minutes')),
    ('qe2', 'shop1', 'cust2', 2, 'waiting', datetime('now', '-15 minutes')),
    ('qe3', 'shop2', 'cust3', 1, 'waiting', datetime('now', '-10 minutes')),
    ('qe4', 'shop3', 'cust4', 1, 'called', datetime('now', '-25 minutes'))
`);

db.close();
console.log('Database initialized successfully');