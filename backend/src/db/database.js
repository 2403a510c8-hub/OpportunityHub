const fs = require('fs');
const path = require('path');
const seedData = require('./seedData');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class JSONDatabase {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      // Create with cloned seed data
      const initial = JSON.parse(JSON.stringify(seedData));
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
      console.log('✅ Opportunity Hub database initialized with sample seed data.');
    }
  }

  read() {
    try {
      this.ensureInitialized();
      const content = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading database file:', err);
      return JSON.parse(JSON.stringify(seedData));
    }
  }

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('Error writing to database file:', err);
      return false;
    }
  }

  // Generic collection operations
  getCollection(name) {
    const db = this.read();
    return db[name] || [];
  }

  find(collectionName, predicate) {
    const items = this.getCollection(collectionName);
    if (!predicate) return items;
    return items.filter(predicate);
  }

  findById(collectionName, id) {
    const items = this.getCollection(collectionName);
    return items.find((item) => item.id === id) || null;
  }

  findOne(collectionName, predicate) {
    const items = this.getCollection(collectionName);
    return items.find(predicate) || null;
  }

  create(collectionName, newItem) {
    const db = this.read();
    if (!db[collectionName]) {
      db[collectionName] = [];
    }

    const item = {
      ...newItem,
      id: newItem.id || `${collectionName.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: newItem.createdAt || new Date().toISOString()
    };

    db[collectionName].unshift(item);
    this.write(db);
    return item;
  }

  update(collectionName, id, updates) {
    const db = this.read();
    if (!db[collectionName]) return null;

    const index = db[collectionName].findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...db[collectionName][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    db[collectionName][index] = updatedItem;
    this.write(db);
    return updatedItem;
  }

  delete(collectionName, id) {
    const db = this.read();
    if (!db[collectionName]) return false;

    const initialLen = db[collectionName].length;
    db[collectionName] = db[collectionName].filter((item) => item.id !== id);

    if (db[collectionName].length !== initialLen) {
      this.write(db);
      return true;
    }
    return false;
  }

  resetToSeed() {
    const initial = JSON.parse(JSON.stringify(seedData));
    this.write(initial);
    return true;
  }
}

const db = new JSONDatabase();
module.exports = db;
