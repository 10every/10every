const Database = require('better-sqlite3');
const path = require('path');

// Connect to database
const dbPath = path.join(process.cwd(), 'data', 'submissions.db');
const db = new Database(dbPath);

// Sample submissions with real Spotify data
const testSubmissions = [
  {
    spotify_url: 'https://open.spotify.com/track/4QvdyQPZrCZBhQZLlFRmjz',
    spotify_id: '4QvdyQPZrCZBhQZLlFRmjz',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 355000,
    preview_url: 'https://p.scdn.co/mp3-preview/4QvdyQPZrCZBhQZLlFRmjz',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/4QvdyQPZrCZBhQZLlFRmjz' })
  },
  {
    spotify_url: 'https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUpq9E',
    spotify_id: '3n3Ppam7vgaVa1iaRUpq9E',
    title: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 183000,
    preview_url: 'https://p.scdn.co/mp3-preview/3n3Ppam7vgaVa1iaRUpq9E',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUpq9E' })
  },
  {
    spotify_url: 'https://open.spotify.com/track/1mea3bSkSGXuIRvnydlB5b',
    spotify_id: '1mea3bSkSGXuIRvnydlB5b',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 391000,
    preview_url: 'https://p.scdn.co/mp3-preview/1mea3bSkSGXuIRvnydlB5b',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/1mea3bSkSGXuIRvnydlB5b' })
  }
];

// Insert test submissions
const insertStmt = db.prepare(`
  INSERT INTO submissions (
    spotify_url, spotify_id, title, artist, album, 
    album_art_url, duration_ms, preview_url, external_urls, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

console.log('Adding test submissions...');
testSubmissions.forEach((submission, index) => {
  try {
    insertStmt.run(
      submission.spotify_url,
      submission.spotify_id,
      submission.title,
      submission.artist,
      submission.album,
      submission.album_art_url,
      submission.duration_ms,
      submission.preview_url,
      submission.external_urls,
      'pending'
    );
    console.log(`Added: ${submission.title} by ${submission.artist}`);
  } catch (error) {
    console.error(`Error adding ${submission.title}:`, error.message);
  }
});

console.log('Test submissions added successfully!');
db.close();
