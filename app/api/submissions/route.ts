import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { fetchTrackDetails } from '@/lib/spotify';

export async function POST(request: NextRequest) {
  try {
    const { spotifyUrl } = await request.json();

    if (!spotifyUrl) {
      return NextResponse.json({ error: 'Spotify URL is required' }, { status: 400 });
    }

    // Fetch track details from Spotify
    const trackDetails = await fetchTrackDetails(spotifyUrl);

    // Insert submission into database
    const stmt = db.prepare(`
      INSERT INTO submissions (
        spotify_url, spotify_id, title, artist, album, 
        album_art_url, duration_ms, preview_url, external_urls
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      spotifyUrl,
      trackDetails.spotify_id,
      trackDetails.title,
      trackDetails.artist,
      trackDetails.album,
      trackDetails.album_art_url,
      trackDetails.duration_ms,
      trackDetails.preview_url,
      trackDetails.external_urls
    );

    return NextResponse.json({
      success: true,
      submissionId: result.lastInsertRowid,
      track: trackDetails
    });

  } catch (error) {
    console.error('Error submitting track:', error);
    return NextResponse.json(
      { error: 'Failed to submit track' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stmt = db.prepare(`
      SELECT * FROM submissions 
      ORDER BY submitted_at DESC
    `);
    
    const submissions = stmt.all();
    
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
