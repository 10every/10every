import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    // Get today's featured tracks from JSON file
    const fs = require('fs');
    const path = require('path');
    
    const filePath = path.join(process.cwd(), 'data', 'featured-tracks.json');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ tracks: [] });
    }
    
    // Read and parse the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const featuredData = JSON.parse(fileContent);
    
    // Check if it's today's data
    const today = new Date().toISOString().split('T')[0];
    if (featuredData.date !== today) {
      return NextResponse.json({ tracks: [] });
    }
    
    return NextResponse.json({ tracks: featuredData.tracks || [] });
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

    console.log('Storing featured tracks...');
    // For now, let's use a simple approach - store in a JSON file
    const fs = require('fs');
    const path = require('path');
    
    const today = new Date().toISOString().split('T')[0];
    const featuredTracks = {
      date: today,
      tracks: tracks.map((track, index) => ({
        id: index + 1,
        spotify_url: track.spotify_url,
        title: track.title,
        artist: track.artist,
        album_art_url: track.album_art_url,
        duration_ms: track.duration_ms,
        track_order: index + 1
      }))
    };

    // Write to a simple JSON file
    const filePath = path.join(process.cwd(), 'data', 'featured-tracks.json');
    fs.writeFileSync(filePath, JSON.stringify(featuredTracks, null, 2));
    
    console.log('Featured tracks stored successfully');
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
