import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    // Get today's featured tracks
    const stmt = db.prepare(`
      SELECT s.*, dt.track_order
      FROM submissions s
      JOIN daily_tracks dt ON s.id = dt.submission_id
      WHERE dt.date = DATE('now')
      ORDER BY dt.track_order
    `);
    
    const featuredTracks = stmt.all();
    
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
    const { trackIds } = await request.json();

    if (!trackIds || !Array.isArray(trackIds) || trackIds.length !== 10) {
      return NextResponse.json(
        { error: 'Exactly 10 track IDs are required' },
        { status: 400 }
      );
    }

    // Clear today's tracks
    const clearStmt = db.prepare(`DELETE FROM daily_tracks WHERE date = DATE('now')`);
    clearStmt.run();

    // Insert new featured tracks
    const insertStmt = db.prepare(`
      INSERT INTO daily_tracks (submission_id, track_order, date)
      VALUES (?, ?, DATE('now'))
    `);

    const updateStmt = db.prepare(`
      UPDATE submissions 
      SET featured = TRUE, featured_date = DATE('now')
      WHERE id = ?
    `);

    trackIds.forEach((trackId, index) => {
      insertStmt.run(trackId, index + 1);
      updateStmt.run(trackId);
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
