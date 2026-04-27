import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, 'krishidhara.db'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

export const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create Users Table with extended profile fields
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        location TEXT,
        farm_size TEXT,
        profile_picture TEXT
      )`);

      // Create Products Table with external_url support
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        type TEXT NOT NULL,
        image TEXT NOT NULL,
        external_url TEXT
      )`);

      // Create Schemes Table
      db.run(`CREATE TABLE IF NOT EXISTS schemes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        category TEXT NOT NULL,
        amount TEXT NOT NULL,
        status TEXT NOT NULL,
        url TEXT NOT NULL
      )`);

      // Create Market Prices Table
      db.run(`CREATE TABLE IF NOT EXISTS market_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        crop TEXT NOT NULL,
        price TEXT NOT NULL,
        change TEXT NOT NULL,
        trend TEXT NOT NULL
      )`);

      // Seed Real Products
      db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (row.count === 0) {
          console.log('Seeding Real Products...');
          const stmt = db.prepare('INSERT INTO products (name, price, type, image, external_url) VALUES (?, ?, ?, ?, ?)');
          // External Amazon products
          stmt.run('IFFCO NPK 12:32:16 Fertilizer (50kg)', 1470, 'Supplies', '/images/fertilizer.png', 'https://www.amazon.in/s?k=iffco+npk');
          stmt.run('Pioneer 3028 Wheat Seeds (10kg)', 920, 'Seeds', '/images/seeds.png', 'https://www.amazon.in/s?k=wheat+seeds');
          stmt.run('Tata Rallis TataMida Pesticide (1L)', 650, 'Supplies', '/images/pesticide.png', 'https://www.amazon.in/s?k=tata+rallis');
          // Internal Rental products (no external URL -> handled by Stripe)
          stmt.run('Mahindra YUVO 575 DI (Rental/Day)', 2500, 'Rental', '/images/tractor.png', null);
          stmt.run('John Deere 5310 Harvester (Rental/Day)', 4500, 'Rental', '/images/harvester.png', null);
          stmt.run('KisanKraft Drip Irrigation Kit (1 Acre)', 15000, 'Equipment', '/images/irrigation.png', null);
          stmt.finalize();
        }
      });

      // Seed Real Schemes
      db.get('SELECT COUNT(*) as count FROM schemes', (err, row) => {
        if (row.count === 0) {
          console.log('Seeding Real Schemes...');
          const stmt = db.prepare('INSERT INTO schemes (name, provider, category, amount, status, url) VALUES (?, ?, ?, ?, ?, ?)');
          stmt.run('PM-KISAN Samman Nidhi', 'Central Govt', 'Income Support', '₹6,000/year', 'Active', 'https://pmkisan.gov.in/');
          stmt.run('Pradhan Mantri Krishi Sinchayee Yojana', 'Central Govt', 'Irrigation', 'Variable Subsidy', 'Active', 'https://pmksy.gov.in/');
          stmt.run('National Mission for Sustainable Agriculture', 'Central Govt', 'Organic', '₹10,000/ha', 'Active', 'https://nmsa.dac.gov.in/');
          stmt.run('PM KUSUM (Solar Pumps)', 'MNRE', 'Energy', 'Up to 60% Subsidy', 'Active', 'https://pmkusum.mnre.gov.in/');
          stmt.run('Kisan Credit Card (KCC)', 'RBI / Banks', 'Credit', 'Up to ₹3 Lakh', 'Active', 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card');
          stmt.finalize();
        }
      });

      // Seed Market Prices (Fallback in case scraping fails)
      db.get('SELECT COUNT(*) as count FROM market_prices', (err, row) => {
        if (row.count === 0) {
          console.log('Seeding Market Prices Fallback...');
          const stmt = db.prepare('INSERT INTO market_prices (crop, price, change, trend) VALUES (?, ?, ?, ?)');
          stmt.run('Wheat (Local)', '₹2,400', '+1.5%', 'up');
          stmt.run('Basmati Rice', '₹3,600', '+2.1%', 'up');
          stmt.run('Cotton (BT)', '₹6,100', '-0.5%', 'down');
          stmt.run('Soybean', '₹4,200', '+0.8%', 'up');
          stmt.run('Mustard', '₹5,100', '-1.2%', 'down');
          stmt.finalize();
        }
      });
      
      resolve();
    });
  });
};

export default db;
