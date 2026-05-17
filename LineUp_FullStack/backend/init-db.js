
// Import the database connection from the db.js file.
// This allows us to use the same database connection for initializing the database and inserting sample data.
const db = require('./db');


// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, // User ID
    name TEXT, // User's full name
    email TEXT UNIQUE, // User's email address (must be unique)
    role TEXT CHECK(role IN ('customer', 'owner', 'anon')) NOT NULL, // User role (customer, owner, or anonymous)
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP, // Timestamp of the last activity for anonymous users, used to clean up old anonymous accounts
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP // Timestamp of when the user account was created
  )
`);

// Create shops table
db.run(`
  CREATE TABLE IF NOT EXISTS shops (
    id TEXT PRIMARY KEY, // Shop ID
    owner_id TEXT NOT NULL, // ID of the shop owner (foreign key referencing users.id, can't be null)
    name TEXT NOT NULL, // Shop name
    category TEXT NOT NULL, // Shop category
    location_x REAL, // X coordinate of the shop's location
    location_y REAL, // Y coordinate of the shop's location
    is_open BOOLEAN DEFAULT 0, // Whether the shop is currently open (0 = closed, 1 = open)
    avg_service_seconds INTEGER DEFAULT 300, // Average service time in seconds (default 5 minutes)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, // Timestamp of when the shop was created
    FOREIGN KEY (owner_id) REFERENCES users(id)  // Foreign key constraint linking to the users table, ensuring that each shop has a valid owner
  )
`);

// Create queue_entries table
db.run(`
  CREATE TABLE IF NOT EXISTS queue_entries (
    id TEXT PRIMARY KEY, // Queue entry ID
    shop_id TEXT NOT NULL, // ID of the shop (foreign key referencing shops.id, can't be null)
    user_id TEXT NOT NULL, // ID of the user (foreign key referencing users.id, can't be null)
    position INTEGER NOT NULL, // Position in the queue
    status TEXT CHECK(status IN ('waiting', 'called', 'attended', 'skipped', 'cancelled')) DEFAULT 'waiting', // Status of the queue entry
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP, // Timestamp of when the user joined the queue
    called_at DATETIME, // Timestamp of when the user was called (nullable, only set when status is 'called')
    skip_reason TEXT CHECK(skip_reason IN ('no_show', 'owner_skip', NULL)), // Reason for skipping (nullable, only set when status is 'skipped')
    FOREIGN KEY (shop_id) REFERENCES shops(id), // Foreign key constraint linking to the shops table, ensuring that each queue entry is associated with a valid shop
    FOREIGN KEY (user_id) REFERENCES users(id) // Foreign key constraint linking to the users table, ensuring that each queue entry is associated with a valid user
  )
`);

// Create queue_stats table
db.run(`
  CREATE TABLE IF NOT EXISTS queue_stats (
    id TEXT PRIMARY KEY, // Stats entry ID
    shop_id TEXT NOT NULL, // ID of the shop (foreign key referencing shops.id, can't be null)
    date DATE, // Date for which the stats are recorded
    customers_served INTEGER DEFAULT 0, // Number of customers served on that date
    customers_skipped INTEGER DEFAULT 0, // Number of customers who got skipped on that date
    no_shows INTEGER DEFAULT 0, // Number of no-shows on that date
    skips INTEGER DEFAULT 0, // Number of skips on that date (including only owner skips)
    cancelled INTEGER DEFAULT 0, // Number of cancelled entries on that date
    avg_wait_time INTEGER, // Average wait time in seconds
    peak_hour INTEGER, // Hour of the day with the highest traffic
    FOREIGN KEY (shop_id) REFERENCES shops(id) // Foreign key constraint linking to the shops table, ensuring that each stats entry is associated with a valid shop
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
}); // Insert sample shop owners into the users table with the role of 'owner'. Each owner has a unique ID, name, email, and role.
    // The 'INSERT OR IGNORE' statement ensures that if an owner with the same ID already exists, it will not be inserted again.

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
}); // Insert sample shops into the shops table. Each shop has a unique ID, an associated owner ID (which must exist in the users table), a name, category,
    // location coordinates, open status, and average service time. The 'INSERT OR IGNORE' statement ensures that if a shop with the same ID already exists,
    // it will not be inserted again.

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
}); // Insert sample customers into the users table with the role of 'customer'. Each customer has a unique ID, name, email, and role.
    // The 'INSERT OR IGNORE' statement ensures that if a customer with the same ID already exists, it will not be inserted again.

// Insert sample queue entries
db.run(`
  INSERT OR IGNORE INTO queue_entries (id, shop_id, user_id, position, status, joined_at)
  VALUES 
    ('qe1', 'shop1', 'cust1', 1, 'waiting', datetime('now', '-20 minutes')),
    ('qe2', 'shop1', 'cust2', 2, 'waiting', datetime('now', '-15 minutes')),
    ('qe3', 'shop2', 'cust3', 1, 'waiting', datetime('now', '-10 minutes')),
    ('qe4', 'shop3', 'cust4', 1, 'called', datetime('now', '-25 minutes'), datetime('now', '-2 minutes'))
`); // Insert sample queue entries into the queue_entries table. Each entry has a unique ID, is associated with a specific shop and user,
    // has a position in the queue, a status (waiting or called), and timestamps for when the user joined the queue and when they were called (if applicable).
    // The 'INSERT OR IGNORE' statement ensures that if a queue entry with the same ID already exists, it will not be inserted again.

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
    process.exit(1);
  }
  console.log('Database initialized successfully');
}); // Close the database connection after initializing the database with sample data. If there is an error while closing,
    // it will be logged and the process will exit with an error code. Otherwise, a success message will be logged.
