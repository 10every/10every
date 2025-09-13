'use client';

/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities, @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TileGrid } from './TileGrid';
import { EndOfDayRecap } from './EndOfDayRecap';
import { Manifesto } from './Manifesto';
import { SubmissionPage } from './SubmissionPage';
import { SpotifyAuth } from './components/SpotifyAuth';
import { ChevronLeft, ChevronRight, FileText, Upload } from 'lucide-react';
import { Button } from './components/ui/button';
import { Logo } from './components/Logo';
import { useSpotifyPlayer } from './hooks/useSpotifyPlayer';
import type { Track, AppState } from './types';

const placeholderAlbum = '/placeholder.png';
const logoImage = '/logo.png';

// -----------------------------------------------------------------------------
// Mock data
// -----------------------------------------------------------------------------

const generateMockTracks = (): Track[] => {
  const realSpotifyTracks = [
    { artist: "CMAT", title: "Where Are Your Kids Tonight?", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/4qjVtuuXzU8O6Z3I80JjB" },
    { artist: "CMAT", title: "Stay For Something", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/2jgbxTfK1U2leeuUudxAaD" },
    { artist: "CMAT", title: "Can't Make You Happy", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/3h7cIUPJ0Re2JryPOxW0bL" },
    { artist: "CMAT", title: "Such a Diva", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/4f7WXvbpugXffV1I2L5i5G" },
    { artist: "CMAT", title: "California", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/2T6d8iUQo1a1Lt9TboNqRW" },
    { artist: "CMAT", title: "Have Fun!", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/5S0uPH9I35AgMZJlu6LjkX" },
    { artist: "CMAT", title: "Whatever You Want", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/3kSxrNy5X5yzaXk5hTdLb6" },
    { artist: "CMAT", title: "I Don't Really Care for You", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/2Iyz3f0diV6eLkfNDZLqYN" },
    { artist: "CMAT", title: "Phone Me (ft. John Grant)", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/5v2VXH3R9vNtUr0i5XL9iF" },
    { artist: "CMAT", title: "I Want It All", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/3o4xJ0fJwmx6SF5XLs4f50" }
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
      id: index + 1, // Use sequential numbering 1-10
      title: track.title,
      artist: track.artist,
      albumArt: track.album_art_url || placeholderAlbum,
      spotifyUrl: track.spotify_url,
      audioUrl: track.spotify_url || `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav`,
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
    showRecap: false,
    allTracksGone: false,
    showManifesto: false,
    showSubmission: false,
  }));

  // Spotify authentication state
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null);
  const [showSpotifyAuth, setShowSpotifyAuth] = useState(false);

  // Initialize Spotify authentication
  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      setSpotifyAccessToken(token);
    } else {
      setShowSpotifyAuth(true);
    }
  }, []);

  // Spotify Web Playback SDK
  const {
    isReady: spotifyReady,
    isPlaying,
    currentTrack: spotifyCurrentTrack,
    position,
    duration,
    playTrack,
    pause,
    resume,
  } = useSpotifyPlayer({
    accessToken: spotifyAccessToken || '',
    onPlayerStateChanged: (state) => {
      if (state && state.track_window?.current_track) {
        // Update track progress based on full track duration
        const progressPercent = Math.round((state.position / state.duration) * 100);
        if (progressPercent >= 10 && state.track_window.current_track.uri) {
          // Find and reveal the track
          const trackUri = state.track_window.current_track.uri;
          setState(prev => ({
            ...prev,
            tracks: prev.tracks.map(track => {
              if (track.spotifyUrl?.includes(trackUri.split(':')[2])) {
                return { ...track, revealed: true, listenProgress: progressPercent };
              }
              return track;
            })
          }));
        }
      }
    },
  });

  // Spotify authentication handlers
  const handleSpotifyAuthSuccess = (accessToken: string) => {
    setSpotifyAccessToken(accessToken);
    setShowSpotifyAuth(false);
  };

  const handleSpotifyLogout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expires');
    setSpotifyAccessToken(null);
    setShowSpotifyAuth(true);
  };

  // Load real tracks on component mount
  useEffect(() => {
    const loadTracks = async () => {
      console.log('Loading tracks...');
      const tracks = await fetchFeaturedTracks();
      console.log('Loaded tracks:', tracks.length);
      console.log('First track:', tracks[0]);
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

  const handleTileClick = async (track: Track) => {
    console.log('Tile clicked:', track);
    
    // Immediately reveal the track and mark as listened
    setState((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => 
        t.id === track.id 
          ? { ...t, revealed: true, listened: true, listenProgress: 10 }
          : t
      )
    }));
    
    // If user has Spotify access, also play the track
    if (spotifyAccessToken && track.spotifyUrl) {
      // Extract Spotify track ID from URL
      const spotifyId = track.spotifyUrl.split('/').pop()?.split('?')[0];
      console.log('Extracted Spotify ID:', spotifyId);
      
      if (spotifyId) {
        const spotifyUri = `spotify:track:${spotifyId}`;
        console.log('Playing Spotify URI:', spotifyUri);
        
        if (!spotifyReady) {
          console.warn('Spotify player not ready yet, waiting...');
          // Wait a bit and try again
          setTimeout(() => {
            if (spotifyReady) {
              playTrack(spotifyUri);
            } else {
              console.error('Spotify player still not ready after timeout');
            }
          }, 2000);
        } else {
          await playTrack(spotifyUri);
        }
      }
    }
  };


  const handleNewDay = () =>
    setState({
      tracks: generateMockTracks(),
      showRecap: false,
      allTracksGone: false,
      showManifesto: false,
      showSubmission: false,
    });

  const handleShowManifesto = () =>
    setState((prev) => ({ ...prev, showManifesto: true }));

  const handleCloseManifesto = () =>
    setState((prev) => ({ ...prev, showManifesto: false }));

  const handleShowSubmission = () =>
    setState((prev) => ({ ...prev, showSubmission: true }));

  const handleCloseSubmission = () =>
    setState((prev) => ({ ...prev, showSubmission: false }));


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

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Spotify Authentication Modal */}
      {showSpotifyAuth && (
        <SpotifyAuth onAuthSuccess={handleSpotifyAuthSuccess} />
      )}

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-6 sm:mb-8 md:mb-10 relative">
          <div className="mb-3 sm:mb-4">
            <Logo className="mx-auto h-20 sm:h-24 w-auto" />
          </div>

          <div className="absolute top-0 right-0 flex items-center gap-1 sm:gap-2 flex-wrap">
            <Button
              onClick={handleShowSubmission}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground text-xs tracking-wide touch-manipulation px-2 py-1"
            >
              <Upload className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">submit</span>
            </Button>
            <Button
              onClick={handleShowManifesto}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground text-xs tracking-wide touch-manipulation px-2 py-1"
            >
              <FileText className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">manifesto</span>
            </Button>
            <Button
              onClick={() => window.open('/admin?password=10every_Admin_2025_Secure!', '_blank')}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground text-xs tracking-wide touch-manipulation px-2 py-1"
            >
              <span className="hidden sm:inline">admin</span>
            </Button>
            {spotifyAccessToken && (
              <Button
                onClick={handleSpotifyLogout}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground text-xs tracking-wide touch-manipulation px-2 py-1"
              >
                <span className="hidden sm:inline">spotify logout</span>
              </Button>
            )}
          </div>
        </header>

        <main>
          {state.allTracksGone ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg tracking-wide">
                Today&apos;s selection has concluded...
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


        {state.showManifesto && <Manifesto onClose={handleCloseManifesto} />}
        {state.showSubmission && <SubmissionPage onClose={handleCloseSubmission} />}

        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setState(prev => ({ ...prev, showRecap: true, allTracksGone: true }))}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}