import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    // Get today's featured tracks
    const stmt = db.prepare(`
      SELECT * FROM featured_tracks
      WHERE date = DATE('now')
      ORDER BY track_order
    `);
    
    const featuredTracks = stmt.all();
    
    // If no featured tracks, return empty array
    if (featuredTracks.length === 0) {
      return NextResponse.json({ tracks: [] });
    }
    
    return NextResponse.json({ tracks: featuredTracks });
  } catch (error) {
    console.error('Error fetching featured tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured tracks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tracks } = await request.json();

    if (!tracks || !Array.isArray(tracks) || tracks.length !== 10) {
      return NextResponse.json(
        { error: 'Exactly 10 tracks are required' },
        { status: 400 }
      );
    }

    // Store the selected tracks in a simple JSON file or database table
    // For now, let's create a simple featured_tracks table
    const createTableStmt = db.prepare(`
      CREATE TABLE IF NOT EXISTS featured_tracks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spotify_url TEXT NOT NULL,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        album_art_url TEXT,
        duration_ms INTEGER,
        track_order INTEGER,
        date TEXT DEFAULT DATE('now')
      )
    `);
    createTableStmt.run();

    // Clear today's featured tracks
    const clearStmt = db.prepare(`DELETE FROM featured_tracks WHERE date = DATE('now')`);
    clearStmt.run();

    // Insert new featured tracks
    const insertStmt = db.prepare(`
      INSERT INTO featured_tracks (spotify_url, title, artist, album_art_url, duration_ms, track_order, date)
      VALUES (?, ?, ?, ?, ?, ?, DATE('now'))
    `);

    tracks.forEach((track, index) => {
      insertStmt.run(
        track.spotify_url,
        track.title,
        track.artist,
        track.album_art_url,
        track.duration_ms,
        index + 1
      );
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error setting featured tracks:', error);
    return NextResponse.json(
      { error: 'Failed to set featured tracks' },
      { status: 500 }
    );
  }
}
