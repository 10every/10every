import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { trackId, rating, userSession } = await request.json();

    if (!trackId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating data' }, { status: 400 });
    }

    // Insert or update rating
    const ratingStmt = db.prepare(`
      INSERT OR REPLACE INTO ratings (track_id, rating, user_session)
      VALUES (?, ?, ?)
    `);
    
    ratingStmt.run(trackId, rating, userSession || 'anonymous');

    // Update track scores
    const updateScoresStmt = db.prepare(`
      INSERT OR REPLACE INTO track_scores (track_id, total_ratings, total_score, average_rating, last_updated)
      SELECT 
        track_id,
        COUNT(*) as total_ratings,
        SUM(rating) as total_score,
        AVG(rating) as average_rating,
        CURRENT_TIMESTAMP
      FROM ratings 
      WHERE track_id = ?
      GROUP BY track_id
    `);

    updateScoresStmt.run(trackId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get('trackId');

    if (trackId) {
      // Get ratings for specific track
      const stmt = db.prepare(`
        SELECT r.*, ts.average_rating, ts.total_ratings
        FROM ratings r
        LEFT JOIN track_scores ts ON r.track_id = ts.track_id
        WHERE r.track_id = ?
        ORDER BY r.rated_at DESC
      `);
      
      const ratings = stmt.all(trackId);
      return NextResponse.json({ ratings });
    } else {
      // Get all track scores
      const stmt = db.prepare(`
        SELECT ts.*, ft.title, ft.artist, ft.spotify_url, ft.album_art
        FROM track_scores ts
        LEFT JOIN featured_tracks ft ON ts.track_id = ft.track_id
        ORDER BY ts.average_rating DESC, ts.total_ratings DESC
      `);
      
      const scores = stmt.all();
      return NextResponse.json({ scores });
    }
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}
