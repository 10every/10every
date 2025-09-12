import db from '../lib/database';

// Insert some sample submissions for testing
const sampleSubmissions = [
  {
    spotify_url: "https://open.spotify.com/track/4QvdyQPZrCZBhQZLlFRmjz",
    spotify_id: "4QvdyQPZrCZBhQZLlFRmjz",
    title: "Archangel",
    artist: "Burial",
    album: "Untrue",
    album_art_url: "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69",
    duration_ms: 180000,
    preview_url: null,
    external_urls: '{"spotify": "https://open.spotify.com/track/4QvdyQPZrCZBhQZLlFRmjz"}'
  },
  {
    spotify_url: "https://open.spotify.com/track/6KzKBBHU0hJsRDxsYQa3ml",
    spotify_id: "6KzKBBHU0hJsRDxsYQa3ml",
    title: "It Could Happen to You",
    artist: "Ryo Fukui",
    album: "Scenery",
    album_art_url: "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69",
    duration_ms: 240000,
    preview_url: null,
    external_urls: '{"spotify": "https://open.spotify.com/track/6KzKBBHU0hJsRDxsYQa3ml"}'
  },
  {
    spotify_url: "https://open.spotify.com/track/0x5MQXhBtOoaR9b6rVBmxV",
    spotify_id: "0x5MQXhBtOoaR9b6rVBmxV",
    title: "Chaos Space Marine",
    artist: "Black Country, New Road",
    album: "Ants From Up There",
    album_art_url: "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69",
    duration_ms: 200000,
    preview_url: null,
    external_urls: '{"spotify": "https://open.spotify.com/track/0x5MQXhBtOoaR9b6rVBmxV"}'
  }
];

const stmt = db.prepare(`
  INSERT INTO submissions (
    spotify_url, spotify_id, title, artist, album, 
    album_art_url, duration_ms, preview_url, external_urls
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

console.log('Inserting sample submissions...');
sampleSubmissions.forEach(submission => {
  try {
    stmt.run(
      submission.spotify_url,
      submission.spotify_id,
      submission.title,
      submission.artist,
      submission.album,
      submission.album_art_url,
      submission.duration_ms,
      submission.preview_url,
      submission.external_urls
    );
    console.log(`Inserted: ${submission.title} by ${submission.artist}`);
  } catch (error) {
    console.log(`Skipped: ${submission.title} (may already exist)`);
  }
});

console.log('Sample data inserted successfully!');
db.close();
