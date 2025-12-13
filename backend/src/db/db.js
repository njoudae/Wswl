import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = process.env.DB_FILE || path.join(__dirname, '../../data/app.db');

const db = new sqlite3.Database(dbFile);
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
});

export default db;
