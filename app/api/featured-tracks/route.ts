import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    // Get today's featured tracks
    const today = new Date().toISOString().split('T')[0];
    const stmt = db.prepare(`
      SELECT * FROM featured_tracks
      WHERE date = ?
      ORDER BY track_order
    `);
    
    const featuredTracks = stmt.all(today);
    
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
    console.log('POST /api/featured-tracks called');
    const { tracks } = await request.json();
    console.log('Received tracks:', tracks);

    if (!tracks || !Array.isArray(tracks) || tracks.length !== 10) {
      console.log('Invalid tracks data:', { tracks, length: tracks?.length });
      return NextResponse.json(
        { error: 'Exactly 10 tracks are required' },
        { status: 400 }
      );
    }

    console.log('Creating featured_tracks table...');
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
        date TEXT DEFAULT (date('now'))
      )
    `);
    createTableStmt.run();
    console.log('Table created successfully');

    console.log('Clearing existing featured tracks...');
    // Clear today's featured tracks
    const today = new Date().toISOString().split('T')[0];
    const clearStmt = db.prepare(`DELETE FROM featured_tracks WHERE date = ?`);
    clearStmt.run(today);
    console.log('Existing tracks cleared');

    console.log('Inserting new featured tracks...');
    // Insert new featured tracks
    const insertStmt = db.prepare(`
      INSERT INTO featured_tracks (spotify_url, title, artist, album_art_url, duration_ms, track_order, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    tracks.forEach((track, index) => {
      console.log(`Inserting track ${index + 1}:`, track);
      insertStmt.run(
        track.spotify_url,
        track.title,
        track.artist,
        track.album_art_url,
        track.duration_ms,
        index + 1,
        today
      );
    });

    console.log('All tracks inserted successfully');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error setting featured tracks:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Failed to set featured tracks', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
