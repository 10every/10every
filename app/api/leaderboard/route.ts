import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all-time'; // 'today' or 'all-time'
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = '';
    let params: any[] = [];

    if (period === 'today') {
      // Today's leaderboard - only tracks featured today
      query = `
        SELECT 
          ts.track_id,
          ts.total_ratings,
          ts.total_score,
          ts.average_rating,
          ft.title,
          ft.artist,
          ft.spotify_url,
          ft.album_art,
          ft.position as daily_position,
          RANK() OVER (ORDER BY ts.average_rating DESC, ts.total_ratings DESC) as rank
        FROM track_scores ts
        INNER JOIN featured_tracks ft ON ts.track_id = ft.track_id
        WHERE ft.date = DATE('now')
        ORDER BY ts.average_rating DESC, ts.total_ratings DESC
        LIMIT ?
      `;
      params = [limit];
    } else {
      // All-time leaderboard
      query = `
        SELECT 
          ts.track_id,
          ts.total_ratings,
          ts.total_score,
          ts.average_rating,
          ft.title,
          ft.artist,
          ft.spotify_url,
          ft.album_art,
          ft.date as featured_date,
          RANK() OVER (ORDER BY ts.average_rating DESC, ts.total_ratings DESC) as rank
        FROM track_scores ts
        LEFT JOIN featured_tracks ft ON ts.track_id = ft.track_id
        ORDER BY ts.average_rating DESC, ts.total_ratings DESC
        LIMIT ?
      `;
      params = [limit];
    }

    const stmt = db.prepare(query);
    const leaderboard = stmt.all(...params);

    // Get total tracks count for context
    const countQuery = period === 'today' 
      ? `SELECT COUNT(*) as total FROM featured_tracks WHERE date = DATE('now')`
      : `SELECT COUNT(*) as total FROM track_scores`;
    
    const countStmt = db.prepare(countQuery);
    const { total } = countStmt.get() as { total: number };

    return NextResponse.json({
      leaderboard,
      period,
      total,
      limit
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
