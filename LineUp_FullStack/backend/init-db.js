const db = require('./db');
const bcrypt = require('bcryptjs');

const pass123 = bcrypt.hashSync('pass123', 10);
const qwerty = bcrypt.hashSync('qwerty', 10);

db.exec(`
  CREATE TABLE IF NOT EXISTS markets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    address TEXT,
    operating_hours TEXT,
    description TEXT,
    map_image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

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
    market_id TEXT,
    is_open BOOLEAN DEFAULT 0,
    avg_service_time INTEGER DEFAULT 300,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (market_id) REFERENCES markets(id)
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

// ─── OWNERS ───────────────────────────────────────────────────────────────────

const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)');
const insertUserWithPassword = db.prepare('INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)');
const insertManyUsers = db.transaction((rows) => { for (const row of rows) insertUser.run(...row); });

insertManyUsers([
  ['owner1', 'Joan Martí', 'joan@martifruits.com', pass123, 'owner'],
  ['owner2', 'Josep Vila', 'josep@pepsbakery.com', pass123, 'owner'],
  ['owner3', 'Rosa Puig', 'rosa@lapeixateria.com', pass123, 'owner'],
  ['owner4', 'Montse Soler', 'montse@carnissera.com', pass123, 'owner'],
  ['owner5', 'Ahmed Bensali', 'ahmed@especies.com', pass123, 'owner'],
  ['owner6', 'Núria Costa', 'nuria@florsiplantes.com', pass123, 'owner'],
]);


// ─── MARKETS ──────────────────────────────────────────────────────────────────

const insertMarket = db.prepare('INSERT OR IGNORE INTO markets (id, name, lat, lng, address, operating_hours, description, map_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
const insertManyMarkets = db.transaction((rows) => { for (const row of rows) insertMarket.run(...row); });

insertManyMarkets([
  ['market1', 'La Boqueria', 41.3817, 2.1744, 'La Rambla, 91, Barcelona', '8:00 AM - 8:00 PM', 'Traditional Barcelona market with fresh produce, meat, fish, and flowers', 'assets/markets/boqueria_map.png'],
  ['market2', 'Sant Antoni Market', 41.3794, 2.1692, 'Carrer del Parlament, 58, Barcelona', '7:00 AM - 2:00 PM (Mon-Sat)', 'Historic market in the Sant Antoni neighborhood with local vendors', 'assets/markets/sant_antoni_map.png'],
  ['market3', 'Mercat de Sant Josep', 41.3870, 2.1693, 'Plaça de la Independència, Barcelona', '8:00 AM - 9:00 PM', 'Modern market with variety of shops and restaurants', 'assets/markets/sant_josep_map.png'],
  ['market4', 'Mercat de Provençals', 41.3951, 2.1933, 'Carrer de Provençals, 35, Barcelona', '7:00 AM - 3:00 PM (Mon-Sat)', 'Local neighborhood market with traditional vendors', 'assets/markets/provencals_map.png'],
]);


// ─── SHOPS ────────────────────────────────────────────────────────────────────

const insertShop = db.prepare('INSERT OR IGNORE INTO shops (id, owner_id, name, category, location_x, location_y, lat, lng, market_id, is_open, avg_service_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const insertManyShops = db.transaction((rows) => { for (const row of rows) insertShop.run(...row); });

insertManyShops([
  ['shop1', 'owner1', "Martí's Fruits", 'Fruits & Veg', 28, 22, 41.382, 2.177, 'market1', 1, 240],
  ['shop2', 'owner2', "Pep's Bakery", 'Bakery', 55, 38, 41.383, 2.179, 'market1', 1, 180],
  ['shop3', 'owner3', 'La Peixateria', 'Fish', 70, 62, 41.381, 2.180, 'market2', 1, 360],
  ['shop4', 'owner4', 'Ca la Carnissera', 'Meat', 40, 65, 41.380, 2.178, 'market2', 0, 300],
  ['shop5', 'owner5', "Espècies del Món", 'Spices', 18, 58, 41.382, 2.175, 'market3', 1, 120],
  ['shop6', 'owner6', 'Flors i Plantes', 'Flowers', 78, 28, 41.384, 2.181, 'market3', 1, 180],
]);


// ─── REGISTERED CUSTOMERS (hashed passwords) ─────────────────────────────────
// Passwords: 'pass123' → $2a$10$... or 'qwerty' → $2a$10$...
// Pre-hashed to avoid needing bcrypt at seed time.
// pass123  → $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
// qwerty   → $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

const insertManyWithPassword = db.transaction((rows) => { for (const row of rows) insertUserWithPassword.run(...row); });

insertManyWithPassword([
  ['cust1',  'Anna García',      'anna@email.com',    pass123, 'customer'], // pass123
  ['cust2',  'Pere Martínez',    'pere@email.com',    pass123, 'customer'], // pass123
  ['cust3',  'Laia Fernández',   'laia@email.com',    qwerty, 'customer'], // qwerty
  ['cust4',  'Maria Torres',     'maria@email.com',   qwerty, 'customer'], // qwerty
  ['cust5',  'Jordi Puig',       'jordi@email.com',   pass123, 'customer'], // pass123
  ['cust6',  'Marta Vidal',      'marta@email.com',   pass123, 'customer'], // pass123
  ['cust7',  'Carles Bosch',     'carles@email.com',  qwerty, 'customer'], // qwerty
  ['cust8',  'Núria Soler',      'nuria@email.com',   qwerty, 'customer'], // qwerty
  ['cust9',  'Pol Roca',         'pol@email.com',     pass123, 'customer'], // pass123
  ['cust10', 'Silvia Mas',       'silvia@email.com',  pass123, 'customer'], // pass123
  ['cust11', 'Tomàs Ferrer',     'tomas@email.com',   qwerty, 'customer'], // qwerty
  ['cust12', 'Ingrid Llull',     'ingrid@email.com',  qwerty, 'customer'], // qwerty
  ['cust13', 'Marc Comas',       'marc@email.com',    pass123, 'customer'], // pass123
  ['cust14', 'Elena Prats',      'elena@email.com',   pass123, 'customer'], // pass123
  ['cust15', 'Oriol Vila',       'oriol@email.com',   qwerty, 'customer'], // qwerty
]);


// ─── ANONYMOUS USERS ─────────────────────────────────────────────────────────
// No name, email or password — just id and role

const insertAnon = db.prepare('INSERT OR IGNORE INTO users (id, role) VALUES (?, \'anon\')');
const insertManyAnons = db.transaction((rows) => { for (const id of rows) insertAnon.run(id); });

insertManyAnons([
  'anon-1',
  'anon-2',
  'anon-3',
  'anon-4',
  'anon-5',
]);


// ─── QUEUE ENTRIES ────────────────────────────────────────────────────────────
// Each shop has a mix of registered and anon users, with varied statuses

db.exec(`
  INSERT OR IGNORE INTO queue_entries (id, shop_id, user_id, position, status, joined_at, called_at)
  VALUES
    -- shop1: Martí's Fruits (5 entries)
    ('qe-s1-1', 'shop1', 'cust1',  1, 'called',  datetime('now', '-30 minutes'), datetime('now', '-2 minutes')),
    ('qe-s1-2', 'shop1', 'cust2',  2, 'waiting', datetime('now', '-25 minutes'), NULL),
    ('qe-s1-3', 'shop1', 'anon-1', 3, 'waiting', datetime('now', '-20 minutes'), NULL),
    ('qe-s1-5', 'shop1', 'anon-2', 5, 'waiting', datetime('now', '-15 minutes'), NULL),
    ('qe-s1-4', 'shop1', 'cust5',  4, 'waiting', datetime('now', '-10 minutes'), NULL),

    -- shop2: Pep's Bakery (4 entries)
    ('qe-s2-1', 'shop2', 'cust3',  1, 'called',  datetime('now', '-20 minutes'), datetime('now', '-3 minutes')),
    ('qe-s2-2', 'shop2', 'cust6',  2, 'waiting', datetime('now', '-18 minutes'), NULL),
    ('qe-s2-3', 'shop2', 'cust7',  3, 'waiting', datetime('now', '-12 minutes'), NULL),
    ('qe-s2-4', 'shop2', 'anon-3', 4, 'waiting', datetime('now', '-8 minutes'),  NULL),

    -- shop3: La Peixateria (6 entries)
    ('qe-s3-1', 'shop3', 'cust4',  1, 'called',  datetime('now', '-40 minutes'), datetime('now', '-5 minutes')),
    ('qe-s3-2', 'shop3', 'cust8',  2, 'waiting', datetime('now', '-35 minutes'), NULL),
    ('qe-s3-3', 'shop3', 'cust9',  3, 'waiting', datetime('now', '-28 minutes'), NULL),
    ('qe-s3-4', 'shop3', 'anon-4', 4, 'waiting', datetime('now', '-20 minutes'), NULL),
    ('qe-s3-5', 'shop3', 'cust10', 5, 'waiting', datetime('now', '-14 minutes'), NULL),
    ('qe-s3-6', 'shop3', 'cust11', 6, 'waiting', datetime('now', '-7 minutes'),  NULL),

    -- shop4: Ca la Carnissera (closed, no active queue)

    -- shop5: Espècies del Món (3 entries)
    ('qe-s5-1', 'shop5', 'cust12', 1, 'called',  datetime('now', '-15 minutes'), datetime('now', '-1 minutes')),
    ('qe-s5-2', 'shop5', 'cust13', 2, 'waiting', datetime('now', '-10 minutes'), NULL),
    ('qe-s5-3', 'shop5', 'anon-5', 3, 'waiting', datetime('now', '-5 minutes'),  NULL),

    -- shop6: Flors i Plantes (4 entries)
    ('qe-s6-1', 'shop6', 'cust14', 1, 'called',  datetime('now', '-25 minutes'), datetime('now', '-4 minutes')),
    ('qe-s6-2', 'shop6', 'cust15', 2, 'waiting', datetime('now', '-20 minutes'), NULL),
    ('qe-s6-3', 'shop6', 'cust1',  3, 'waiting', datetime('now', '-12 minutes'), NULL),
    ('qe-s6-4', 'shop6', 'cust2',  4, 'waiting', datetime('now', '-6 minutes'),  NULL)
`);
// Note: cust1 and cust2 are in both shop1 and shop6 queues intentionally —
// the unique index only blocks duplicate active entries per shop, not across shops.


// ─── HISTORICAL STATS ─────────────────────────────────────────────────────────

function date(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

const insertStats = db.prepare('INSERT OR IGNORE INTO queue_stats (id, shop_id, date, customers_served, customers_skipped, no_shows, skips, cancelled, avg_wait_seconds, peak_hour) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
const insertManyStats = db.transaction((rows) => { for (const row of rows) insertStats.run(...row); });

insertManyStats([
  ['stats-shop1-d1', 'shop1', date(-7), 12, 2, 1, 3, 0, 420, 10],
  ['stats-shop1-d2', 'shop1', date(-6), 15, 1, 2, 1, 1, 380, 11],
  ['stats-shop1-d3', 'shop1', date(-5), 8,  3, 0, 2, 0, 510, 9],
  ['stats-shop1-d4', 'shop1', date(-4), 18, 0, 1, 0, 1, 350, 12],
  ['stats-shop1-d5', 'shop1', date(-3), 10, 2, 3, 1, 0, 460, 10],
  ['stats-shop2-d1', 'shop2', date(-7), 20, 1, 0, 2, 0, 240, 8],
  ['stats-shop2-d2', 'shop2', date(-5), 25, 0, 1, 0, 1, 210, 9],
  ['stats-shop2-d3', 'shop2', date(-3), 17, 2, 2, 1, 0, 270, 10],
  ['stats-shop3-d1', 'shop3', date(-6), 6,  1, 1, 0, 0, 600, 13],
  ['stats-shop3-d2', 'shop3', date(-4), 9,  0, 0, 1, 1, 540, 12],
  ['stats-shop5-d1', 'shop5', date(-5), 30, 1, 0, 0, 0, 150, 11],
  ['stats-shop5-d2', 'shop5', date(-2), 28, 0, 2, 1, 0, 160, 10],
  ['stats-shop6-d1', 'shop6', date(-4), 14, 1, 0, 1, 0, 300, 14],
]);

db.close();
console.log('Database initialized successfully');