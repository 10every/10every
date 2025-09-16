import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    // Get today's featured tracks from database
    const today = new Date().toISOString().split('T')[0];
    
    const featuredTracks = db.prepare(`
      SELECT * FROM featured_tracks 
      WHERE date = ? 
      ORDER BY position ASC
    `).all(today);
    
    return NextResponse.json({ tracks: featuredTracks });
  } catch (error) {
    console.error('Error getting featured tracks:', error);
    return NextResponse.json({ error: 'Failed to get featured tracks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tracks } = await request.json();
    
    if (!tracks || !Array.isArray(tracks)) {
      return NextResponse.json({ error: 'Invalid tracks data' }, { status: 400 });
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Start transaction
    const transaction = db.transaction(() => {
      // Clear existing featured tracks for today
      db.prepare('DELETE FROM featured_tracks WHERE date = ?').run(today);
      
      // Insert new featured tracks
      const insertStmt = db.prepare(`
        INSERT INTO featured_tracks (date, position, track_id, title, artist, spotify_url, duration, album_art)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      tracks.forEach((track, index) => {
        insertStmt.run(
          today,
          index + 1,
          track.id,
          track.title,
          track.artist,
          track.spotify_url,
          track.duration,
          track.album_art
        );
      });
    });
    
    transaction();
    
    return NextResponse.json({ success: true, message: 'Featured tracks updated successfully' });
  } catch (error) {
    console.error('Error setting featured tracks:', error);
    return NextResponse.json({ 
      error: 'Failed to set featured tracks', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}