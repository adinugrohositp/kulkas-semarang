const Database = require('better-sqlite3');
const path = require('path');

// Create data directory if it doesn't exist
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'kulkas.db'));

// Initialize database schema
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec('ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0;');
    db.exec('ALTER TABLE products ADD COLUMN initial_stock INTEGER DEFAULT 0;');
  } catch (e) {
    // Columns already exist, this is expected in subsequent runs
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Check if table is empty and seed with initial data
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get();

  if (count.count === 0) {
    console.log('Seeding database with initial products...');
    const insert = db.prepare(`
      INSERT INTO products (name, price, category, image) 
      VALUES (?, ?, ?, ?)
    `);

    const initialProducts = [
      ["Sandwich Telur", 12000, "makanan", "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=500&q=80"],
      ["Nasi Goreng Mini", 15000, "makanan", "https://images.unsplash.com/photo-1603133872878-684f208fb74b?auto=format&fit=crop&w=500&q=80"],
      ["Salad Buah", 20000, "makanan", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"],
      ["Donat Gula", 5000, "makanan", "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=80"],
      ["Air Mineral", 3000, "minuman", "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=500&q=80"],
      ["Es Teh Manis", 5000, "minuman", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80"],
      ["Kopi Cold Brew", 18000, "minuman", "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80"],
      ["Jus Jeruk", 12000, "minuman", "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80"]
    ];

    const insertMany = db.transaction((products) => {
      for (const product of products) {
        insert.run(...product);
      }
    });

    insertMany(initialProducts);
    console.log('Database seeded successfully!');
  }
};

initDb();

module.exports = db;
