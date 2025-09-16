import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use different database paths for different environments
const isProduction = process.env.NODE_ENV === 'production';
const dbPath = isProduction 
  ? '/tmp/submissions.db'  // Vercel uses /tmp for persistent storage
  : path.join(process.cwd(), 'data', 'submissions.db');

// Ensure data directory exists in development
if (!isProduction) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spotify_url TEXT NOT NULL,
    spotify_id TEXT,
    title TEXT,
    artist TEXT,
    album TEXT,
    album_art_url TEXT,
    duration_ms INTEGER,
    preview_url TEXT,
    external_urls TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    featured BOOLEAN DEFAULT FALSE,
    featured_date DATE
  );

  CREATE TABLE IF NOT EXISTS daily_tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER,
    track_order INTEGER,
    date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (submission_id) REFERENCES submissions (id)
  );

  CREATE TABLE IF NOT EXISTS featured_tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    position INTEGER NOT NULL,
    track_id TEXT,
    title TEXT,
    artist TEXT,
    spotify_url TEXT,
    duration INTEGER,
    album_art TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
