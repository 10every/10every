import { NextResponse } from 'next/server';
import db from '@/lib/database';
import fs from 'fs';

export async function GET() {
  try {
    // Check if database file exists
    const dbPath = process.env.NODE_ENV === 'production' 
      ? '/tmp/submissions.db' 
      : './data/submissions.db';
    
    const dbExists = fs.existsSync(dbPath);
    
    // Try to query the database
    const stmt = db.prepare('SELECT COUNT(*) as count FROM submissions');
    const result = stmt.get();
    
    return NextResponse.json({
      success: true,
      dbExists,
      dbPath,
      submissionCount: result?.count || 0,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}
