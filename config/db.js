const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../../database.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Users
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'buyer'
  )`);

  // Properties
  db.run(`CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    location TEXT NOT NULL
  )`);

  // Favourites
  db.run(`CREATE TABLE IF NOT EXISTS favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(property_id) REFERENCES properties(id),
    UNIQUE(user_id, property_id)
  )`);

  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row.count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('demo123', 10);

      db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Demo Buyer', 'demo@buyer.com', hashedPassword, 'buyer'],
        (err) => {
          if (!err) console.log('✅ Default user created → demo@buyer.com / demo123');
        }
      );
    }
  });

  db.get("SELECT COUNT(*) as count FROM properties", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO properties (title, description, price, location) VALUES (?, ?, ?, ?)");
      stmt.run("Luxury Villa in Kathmandu", "4-bedroom villa with Himalayan mountain views and private garden.", 1250000, "Kathmandu, Nepal");
      stmt.run("Modern Apartment in Lalitpur", "2-bedroom luxury apartment in city center with rooftop terrace.", 450000, "Lalitpur, Nepal");
      stmt.run("Cozy Family House in Bhaktapur", "Traditional 3-bedroom house with garden and cultural heritage.", 750000, "Bhaktapur, Nepal");
      stmt.run("Modern Family House in Birtnagar", "Modern 4-bedroom house with garden and swimming pool.", 550000, "Birtnagar, Nepal");
      stmt.run("Modern Family House in Pokhara", "Modern 4-bedroom house with garden and swimming pool.", 650000, "Pokhara, Nepal");
      stmt.run("Modern Family House in Hetauda", "Modern 4-bedroom house with garden and swimming pool.", 750000, "Hetauda, Nepal");
      stmt.finalize();
      console.log("✅ Sample properties seeded.");
    }
  });
});

module.exports = db;