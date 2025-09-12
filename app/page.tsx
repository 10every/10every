'use client';

/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities, @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TileGrid } from './TileGrid';
import { TrackPlayer } from './TrackPlayer';
import { CountdownTimer } from './CountdownTimer';
import { EndOfDayRecap } from './EndOfDayRecap';
import { Manifesto } from './Manifesto';
import { SubmissionPage } from './SubmissionPage';
import { ChevronLeft, ChevronRight, FileText, Upload } from 'lucide-react';
import { Button } from './components/ui/button';
import { Logo } from './components/Logo';
import type { Track, AppState, DemoState } from './types';

const placeholderAlbum = '/placeholder.png';
const logoImage = '/logo.png';

// -----------------------------------------------------------------------------
// Mock data
// -----------------------------------------------------------------------------


const generateMockTracks = (): Track[] => {
  const realSpotifyTracks = [
    { artist: "Burial", title: "Archangel", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/4QvdyQPZrCZBhQZLlFRmjz" },
    { artist: "Ryo Fukui", title: "It Could Happen to You", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/6KzKBBHU0hJsRDxsYQa3ml" },
    { artist: "Black Country, New Road", title: "Chaos Space Marine", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/0x5MQXhBtOoaR9b6rVBmxV" },
    { artist: "Eartheater", title: "Clean Break", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/2nGJqWrCkG5NxCNb8YCLOk" },
    { artist: "Arthur Russell", title: "Is It All Over My Face?", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/0cNJhsL5bqX8PGXxvFkSVt" },
    { artist: "Yves Tumor", title: "God Is a Circle", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/4qwkJd4dXRaDBR8FGW8p6K" },
    { artist: "Midori Takada", title: "Mr. Henri Rousseau's Dream", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/5V5JMHQ5kp4iWrMU5M0jBs" },
    { artist: "City Morgue", title: "33rd Blakk Glass", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/7MtCZKjJnE1HpCeGZgABLe" },
    { artist: "Grouper", title: "Headache", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/5pghKjCHUhgGc0aJ3Ey3Sv" },
    { artist: "Aphex Twin", title: "Flim", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/7jDwJJLjTGRz2r7gj3Sk2s" }
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    audioUrl: `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav`,
    duration: 120 + Math.random() * 180,
    listened: false,
    rating: null,
    downloaded: false,
    listenProgress: 0,
    revealed: false,
    score: 0,
    ...realSpotifyTracks[i],
  }));
};

// Fetch real tracks from API
const fetchFeaturedTracks = async (): Promise<Track[]> => {
  try {
    const response = await fetch('/api/featured-tracks');
    if (!response.ok) {
      throw new Error('Failed to fetch tracks');
    }
    
    const data = await response.json();
    const tracks = data.tracks || [];
    
    // If no tracks are featured today, use mock data
    if (tracks.length === 0) {
      console.log('No featured tracks today, using mock data');
      return generateMockTracks();
    }
    
    // Convert API data to Track format
    return tracks.map((track: any, index: number) => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      albumArt: track.album_art_url || placeholderAlbum,
      spotifyUrl: track.spotify_url,
      audioUrl: track.preview_url || `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav`,
      duration: Math.floor(track.duration_ms / 1000) || 120,
      listened: false,
      rating: null,
      downloaded: false,
      listenProgress: 0,
      revealed: false, // Start as unrevealed - will reveal after 10% listen
      score: 0,
    }));
  } catch (error) {
    console.error('Error fetching featured tracks:', error);
    // Fallback to mock data if API fails
    return generateMockTracks();
  }
};

// -----------------------------------------------------------------------------
// Ranking
// -----------------------------------------------------------------------------

const calculateRankings = (tracks: Track[]): Track[] => {
  const rankedTracks = tracks.map((track) => {
    let score = 0;

    score += track.listenProgress * 0.3;
    if (track.revealed && track.rating) score += track.rating * 15;
    if (track.downloaded) score += 25;
    if (track.revealed) score += 10;

    return { ...track, score };
  });

  const sorted = [...rankedTracks].sort((a, b) => b.score - a.score);
  return rankedTracks.map((track) => ({
    ...track,
    rank: sorted.findIndex((t) => t.id === track.id) + 1,
  }));
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function App() {
  const [state, setState] = useState<AppState>(() => ({
    tracks: generateMockTracks(), // Start with mock tracks immediately
    selectedTrack: null,
    showRecap: false,
    allTracksGone: false,
    showManifesto: false,
    showSubmission: false,
    demoState: 'initial',
  }));

  // Load real tracks on component mount
  useEffect(() => {
    const loadTracks = async () => {
      console.log('Loading tracks...');
      const tracks = await fetchFeaturedTracks();
      console.log('Loaded tracks:', tracks.length);
      setState(prev => ({ ...prev, tracks }));
    };
    loadTracks();
  }, []);

  // Hide all tracks after interaction
  useEffect(() => {
    const interactedTracks = state.tracks.filter(
      (t) => t.listened || t.downloaded || t.rating !== null
    );
    if (interactedTracks.length === 10) {
      const id = setTimeout(() => {
        setState((prev) => ({ ...prev, allTracksGone: true, showRecap: true }));
      }, 2000);
      return () => clearTimeout(id);
    }
  }, [state.tracks]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleTileClick = (track: Track) =>
    setState((prev) => ({ ...prev, selectedTrack: track }));

  const handleClosePlayer = () =>
    setState((prev) => ({ ...prev, selectedTrack: null }));

  const handleTrackUpdate = (updatedTrack: Track) => {
    setState((prev) => {
      const updatedTracks = prev.tracks.map((t) => {
        if (t.id === updatedTrack.id) {
          // Check if track should be revealed (10% listen progress)
          const shouldReveal = updatedTrack.listenProgress >= 10 && !updatedTrack.revealed;
          return {
            ...updatedTrack,
            revealed: shouldReveal || updatedTrack.revealed
          };
        }
        return t;
      });
      return { ...prev, tracks: calculateRankings(updatedTracks) };
    });
  };

  const handleNewDay = () =>
    setState({
      tracks: generateMockTracks(),
      selectedTrack: null,
      showRecap: false,
      allTracksGone: false,
      showManifesto: false,
      showSubmission: false,
      demoState: 'initial',
    });

  const handleShowManifesto = () =>
    setState((prev) => ({ ...prev, showManifesto: true }));

  const handleCloseManifesto = () =>
    setState((prev) => ({ ...prev, showManifesto: false }));

  const handleShowSubmission = () =>
    setState((prev) => ({ ...prev, showSubmission: true }));

  const handleCloseSubmission = () =>
    setState((prev) => ({ ...prev, showSubmission: false }));

  const createDemoTracks = (demoState: DemoState): Track[] => {
    const baseTracks = generateMockTracks();

    if (demoState === 'some-revealed') {
      return baseTracks.map((track, index) => {
        if (index < 4) {
          const revealed: Track = {
            ...track,
            revealed: true,
            listened: true,
            listenProgress: 15 + Math.random() * 85,
            rating: track.rating,
          };
          if (index === 0) {
            revealed.rating = 5;
            revealed.downloaded = true;
          } else if (index === 1) {
            revealed.rating = 4;
          } else if (index === 2) {
            revealed.downloaded = true;
          }
          return revealed;
        }
        return track;
      });
    }

    if (demoState === 'end-of-day') {
      return baseTracks.map((track, index) => ({
        ...track,
        revealed: true,
        listened: true,
        listenProgress: 20 + Math.random() * 80,
        rating: index < 7 ? Math.floor(Math.random() * 5) + 1 : null,
        downloaded: index < 3,
      }));
    }

    return baseTracks;
  };

  const handleDemoStateChange = (newState: DemoState) => {
    const demoTracks = createDemoTracks(newState);
    setState((prev) => ({
      ...prev,
      tracks: calculateRankings(demoTracks),
      demoState: newState,
      showRecap: newState === 'end-of-day',
      allTracksGone: newState === 'end-of-day',
      selectedTrack: null,
      showManifesto: false,
      showSubmission: false,
    }));
  };

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  if (state.showRecap && state.allTracksGone) {
    return (
      <div className="relative">
        <EndOfDayRecap
          tracks={state.tracks}
          onNewDay={handleNewDay}
          onShowManifesto={handleShowManifesto}
        />

        {state.showManifesto && <Manifesto onClose={handleCloseManifesto} />}

        <div className="fixed bottom-8 right-8">
          <Button
            onClick={() => handleDemoStateChange('some-revealed')}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Reveals
          </Button>
        </div>
      </div>
    );
  }

  const getDemoStateLabel = () =>
    state.demoState === 'initial'
      ? 'Initial State'
      : state.demoState === 'some-revealed'
      ? 'Some Tracks Revealed'
      : 'End of Day';

  const getNextDemoState = (): DemoState =>
    state.demoState === 'initial'
      ? 'some-revealed'
      : state.demoState === 'some-revealed'
      ? 'end-of-day'
      : 'initial';

  const getPrevDemoState = (): DemoState =>
    state.demoState === 'initial'
      ? 'end-of-day'
      : state.demoState === 'some-revealed'
      ? 'initial'
      : 'some-revealed';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 md:mb-10 relative">
          <div className="mb-4">
            <Logo className="mx-auto h-10 sm:h-12 md:h-14 lg:h-16 max-h-[4rem] md:max-h-[3.75rem] lg:max-h-[4rem] w-auto" />
          </div>

          <div className="absolute top-0 right-0 flex items-center gap-2">
            <Button
              onClick={handleShowSubmission}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground text-xs tracking-wide"
            >
              <Upload className="w-3 h-3 mr-1" />
              submit
            </Button>
            <Button
              onClick={handleShowManifesto}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground text-xs tracking-wide"
            >
              <FileText className="w-3 h-3 mr-1" />
              manifesto
            </Button>
            <Button
              onClick={() => window.open('/admin?password=10every_Admin_2025_Secure!', '_blank')}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground text-xs tracking-wide"
            >
              admin
            </Button>
          </div>
        </header>

        <main>
          {state.allTracksGone ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg tracking-wide">
                Today&apos;s algorithm has concluded...
              </p>
            </div>
          ) : state.tracks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg tracking-wide">
                Loading tracks...
              </p>
            </div>
          ) : (
            <TileGrid tracks={state.tracks} onTileClick={handleTileClick} />
          )}
        </main>

        {state.selectedTrack && (
          <TrackPlayer
            track={state.selectedTrack}
            onClose={handleClosePlayer}
            onUpdate={handleTrackUpdate}
          />
        )}

        {state.showManifesto && <Manifesto onClose={handleCloseManifesto} />}
        {state.showSubmission && <SubmissionPage onClose={handleCloseSubmission} />}

        <div className="fixed bottom-2 right-2 flex items-center gap-2">
          <Button
            onClick={() => handleDemoStateChange(getPrevDemoState())}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="px-3 py-1 bg-background/80 backdrop-blur-sm border border-border rounded text-xs text-muted-foreground">
            {getDemoStateLabel()}
          </div>

          <Button
            onClick={() => handleDemoStateChange(getNextDemoState())}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}