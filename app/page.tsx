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
import { CustomStar } from './components/CustomStar';
import { useSpotifyPlayer } from './hooks/useSpotifyPlayer';
import type { Track, AppState } from './types';

const placeholderAlbum = '/placeholder.png';
const logoImage = '/logo.png';

// -----------------------------------------------------------------------------
// Mock data
// -----------------------------------------------------------------------------

const generateMockTracks = (): Track[] => {
  // Fallback tracks if no featured tracks are available
  const fallbackTracks = [
    { artist: "Radiohead", title: "Creep", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/70LcF31zb1H0PyJoS1Sx1r" },
    { artist: "The Beatles", title: "Come Together", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/2EqlS6tkEnglzr7tkKAAYD" },
    { artist: "Nirvana", title: "Smells Like Teen Spirit", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/5ghIJDpPoe3CfHMGu71E6T" },
    { artist: "Pink Floyd", title: "Wish You Were Here", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/6mFkJmJqdDVQ1REhVfGgd1" },
    { artist: "Led Zeppelin", title: "Stairway to Heaven", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/5CQ30WqJwcep0pYcV4AMNc" },
    { artist: "Queen", title: "Bohemian Rhapsody", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv" },
    { artist: "David Bowie", title: "Space Oddity", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/72Z17vmmeQKAg8bptWvpVG" },
    { artist: "The Rolling Stones", title: "Paint It Black", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/63T7DJ1AFDD6Bn8VzG6JE8" },
    { artist: "Bob Dylan", title: "Like a Rolling Stone", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/3AhXZa8sUQht0UEdBJgpGc" },
    { artist: "The Doors", title: "Light My Fire", albumArt: placeholderAlbum, spotifyUrl: "https://open.spotify.com/track/5UVbMTQfoQ2fHsxO5XqTZf" }
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
    ...fallbackTracks[i],
  }));
};

// Fetch real tracks from API
const fetchFeaturedTracks = async (): Promise<Track[]> => {
  try {
    const response = await fetch('/api/featured-tracks', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured tracks');
    }
    
    const data = await response.json();
    
    if (!data.tracks || data.tracks.length === 0) {
      return generateMockTracks();
    }
    
    // Convert featured tracks to Track format
    return data.tracks.map((track: any, index: number) => ({
      id: track.id || index + 1,
      audioUrl: `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav`,
      duration: track.duration || 120 + Math.random() * 180,
      listened: false,
      rating: null,
      downloaded: false,
      listenProgress: 0,
      revealed: false,
      score: 0,
      artist: track.artist || 'Unknown Artist',
      title: track.title || 'Unknown Title',
      albumArt: track.album_art || placeholderAlbum,
      spotifyUrl: track.spotify_url || 'https://open.spotify.com/track/70LcF31zb1H0PyJoS1Sx1r'
    }));
  } catch (error) {
    console.error('Error fetching featured tracks:', error);
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

  // Load featured tracks on mount and refresh periodically
  useEffect(() => {
    const loadFeaturedTracks = async () => {
      try {
        console.log('Loading featured tracks...');
        const featuredTracks = await fetchFeaturedTracks();
        console.log('Loaded featured tracks:', featuredTracks.length);
        setState(prev => ({
          ...prev,
          tracks: featuredTracks
        }));
      } catch (error) {
        console.error('Failed to load featured tracks:', error);
        // Keep using mock tracks as fallback
      }
    };

    loadFeaturedTracks();
    
    // Refresh every 30 seconds to get latest tracks
    const interval = setInterval(loadFeaturedTracks, 30000);
    
    return () => clearInterval(interval);
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

  // Manual refresh function
  const refreshTracks = async () => {
    try {
      console.log('Manually refreshing tracks...');
      const featuredTracks = await fetchFeaturedTracks();
      console.log('Refreshed tracks:', featuredTracks.length);
      setState(prev => ({
        ...prev,
        tracks: featuredTracks
      }));
    } catch (error) {
      console.error('Failed to refresh tracks:', error);
    }
  };
  


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
          ? { ...t, revealed: true, listened: true, listenProgress: 100 }
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

  const handleRating = (trackId: number, rating: number) => {
    setState((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => 
        t.id === trackId 
          ? { ...t, rating, score: t.score + (rating * 15) }
          : t
      ),
    }));
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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

        <main className="scale-75 origin-top">
          <div className="mx-auto grid w-full max-w-8xl grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {state.tracks.map((track, i) => {
              const [isRevealed, setIsRevealed] = useState(false);
              const isTopRow = i < 5;
              
              return (
                <div key={i} className="relative">
                  {/* Star Rating System - above top row, below bottom row */}
                  {track.revealed && !track.rating && (
                    <div className={`absolute ${isTopRow ? '-top-16' : '-bottom-16'} left-1/2 transform -translate-x-1/2 z-20`}>
                      <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <CustomStar
                            key={star}
                            size={24}
                            onClick={() => handleRating(track.id, star)}
                            className="cursor-pointer"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="h-84 w-full rounded-xl overflow-hidden relative group">
                  {/* Spotify Embed Background */}
                  <div className="relative" style={{ backgroundColor: 'rgba(224, 231, 240, 0.1)' }}>
                    <iframe
                      src={`https://open.spotify.com/embed/track/${track.spotifyUrl?.split('/').pop() || '70LcF31zb1H0PyJoS1Sx1r'}?utm_source=generator`}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowTransparency={true}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      style={{ borderRadius: '12px', border: 0 }}
                    />
                  </div>
                  
                  {/* Tile Overlay */}
                  {!isRevealed && (
                    <div 
                      className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-background/80 cursor-pointer"
                      onClick={() => {
                        setIsRevealed(true);
                        // Also update the global state
                        setState((prev) => ({
                          ...prev,
                          tracks: prev.tracks.map((t) => 
                            t.id === track.id 
                              ? { ...t, revealed: true, listened: true, listenProgress: 100 }
                              : t
                          )
                        }));
                      }}
                    >
                      <div className="text-center">
                        <div className="text-4xl font-mono helvetica-oblique text-muted-foreground">
                          {String(i + 1).padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  )}

                  </div>
                </div>
              );
            })}
          </div>
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