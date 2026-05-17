
// Create a new SQLite database connection. If the database file does not exist, it will be created. If there is an error while opening the database,
// it will be logged and the process will exit with an error code. Otherwise, a success message will be logged.
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'lineup.db'); // Path to the SQLite database file

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

module.exports = db; // Export the database connection so it can be used in other parts of the application, such as in route handlers for authentication and queue management.