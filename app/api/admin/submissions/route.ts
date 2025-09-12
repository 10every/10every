import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    const stmt = db.prepare(`
      SELECT s.*, 
             CASE WHEN dt.submission_id IS NOT NULL THEN TRUE ELSE FALSE END as is_featured_today
      FROM submissions s
      LEFT JOIN daily_tracks dt ON s.id = dt.submission_id AND dt.date = DATE('now')
      ORDER BY s.submitted_at DESC
    `);
    
    const submissions = stmt.all();
    
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching admin submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
