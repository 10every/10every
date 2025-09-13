const Database = require('better-sqlite3');
const path = require('path');

// Connect to database
const dbPath = path.join(process.cwd(), 'data', 'submissions.db');
const db = new Database(dbPath);

// CMAT tracks from "Crazymad, For Me" album
const testSubmissions = [
  {
    spotify_url: 'https://open.spotify.com/track/4qjVtuuXzU8O6Z3I80JjB',
    spotify_id: '4qjVtuuXzU8O6Z3I80JjB',
    title: 'Where Are Your Kids Tonight?',
    artist: 'CMAT',
    album: 'Crazymad, For Me',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 180000,
    preview_url: 'https://p.scdn.co/mp3-preview/4qjVtuuXzU8O6Z3I80JjB',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/4qjVtuuXzU8O6Z3I80JjB' })
  },
  {
    spotify_url: 'https://open.spotify.com/track/2jgbxTfK1U2leeuUudxAaD',
    spotify_id: '2jgbxTfK1U2leeuUudxAaD',
    title: 'Stay For Something',
    artist: 'CMAT',
    album: 'Crazymad, For Me',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 195000,
    preview_url: 'https://p.scdn.co/mp3-preview/2jgbxTfK1U2leeuUudxAaD',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/2jgbxTfK1U2leeuUudxAaD' })
  },
  {
    spotify_url: 'https://open.spotify.com/track/3h7cIUPJ0Re2JryPOxW0bL',
    spotify_id: '3h7cIUPJ0Re2JryPOxW0bL',
    title: 'Can\'t Make You Happy',
    artist: 'CMAT',
    album: 'Crazymad, For Me',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 210000,
    preview_url: 'https://p.scdn.co/mp3-preview/3h7cIUPJ0Re2JryPOxW0bL',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/3h7cIUPJ0Re2JryPOxW0bL' })
  },
  {
    spotify_url: 'https://open.spotify.com/track/4f7WXvbpugXffV1I2L5i5G',
    spotify_id: '4f7WXvbpugXffV1I2L5i5G',
    title: 'Such a Diva',
    artist: 'CMAT',
    album: 'Crazymad, For Me',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 165000,
    preview_url: 'https://p.scdn.co/mp3-preview/4f7WXvbpugXffV1I2L5i5G',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/4f7WXvbpugXffV1I2L5i5G' })
  },
  {
    spotify_url: 'https://open.spotify.com/track/2T6d8iUQo1a1Lt9TboNqRW',
    spotify_id: '2T6d8iUQo1a1Lt9TboNqRW',
    title: 'California',
    artist: 'CMAT',
    album: 'Crazymad, For Me',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 200000,
    preview_url: 'https://p.scdn.co/mp3-preview/2T6d8iUQo1a1Lt9TboNqRW',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/2T6d8iUQo1a1Lt9TboNqRW' })
  },
  {
    spotify_url: 'https://open.spotify.com/track/5S0uPH9I35AgMZJlu6LjkX',
    spotify_id: '5S0uPH9I35AgMZJlu6LjkX',
    title: 'Have Fun!',
    artist: 'CMAT',
    album: 'Crazymad, For Me',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 175000,
    preview_url: 'https://p.scdn.co/mp3-preview/5S0uPH9I35AgMZJlu6LjkX',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/5S0uPH9I35AgMZJlu6LjkX' })
  },
  {
    spotify_url: 'https://open.spotify.com/track/3kSxrNy5X5yzaXk5hTdLb6',
    spotify_id: '3kSxrNy5X5yzaXk5hTdLb6',
    title: 'Whatever You Want',
    artist: 'CMAT',
    album: 'Crazymad, For Me',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 190000,
    preview_url: 'https://p.scdn.co/mp3-preview/3kSxrNy5X5yzaXk5hTdLb6',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/3kSxrNy5X5yzaXk5hTdLb6' })
  },
  {
    spotify_url: 'https://open.spotify.com/track/2Iyz3f0diV6eLkfNDZLqYN',
    spotify_id: '2Iyz3f0diV6eLkfNDZLqYN',
    title: 'I Don\'t Really Care for You',
    artist: 'CMAT',
    album: 'Crazymad, For Me',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 185000,
    preview_url: 'https://p.scdn.co/mp3-preview/2Iyz3f0diV6eLkfNDZLqYN',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/2Iyz3f0diV6eLkfNDZLqYN' })
  },
  {
    spotify_url: 'https://open.spotify.com/track/5v2VXH3R9vNtUr0i5XL9iF',
    spotify_id: '5v2VXH3R9vNtUr0i5XL9iF',
    title: 'Phone Me (ft. John Grant)',
    artist: 'CMAT',
    album: 'Crazymad, For Me',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 220000,
    preview_url: 'https://p.scdn.co/mp3-preview/5v2VXH3R9vNtUr0i5XL9iF',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/5v2VXH3R9vNtUr0i5XL9iF' })
  },
  {
    spotify_url: 'https://open.spotify.com/track/3o4xJ0fJwmx6SF5XLs4f50',
    spotify_id: '3o4xJ0fJwmx6SF5XLs4f50',
    title: 'I Want It All',
    artist: 'CMAT',
    album: 'Crazymad, For Me',
    album_art_url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    duration_ms: 205000,
    preview_url: 'https://p.scdn.co/mp3-preview/3o4xJ0fJwmx6SF5XLs4f50',
    external_urls: JSON.stringify({ spotify: 'https://open.spotify.com/track/3o4xJ0fJwmx6SF5XLs4f50' })
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
      'featured'
    );
    console.log(`Added: ${submission.title} by ${submission.artist}`);
  } catch (error) {
    console.error(`Error adding ${submission.title}:`, error.message);
  }
});

console.log('Test submissions added successfully!');
db.close();
