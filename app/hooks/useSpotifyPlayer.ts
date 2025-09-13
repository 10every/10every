'use client';

import { useState, useEffect, useRef } from 'react';

interface SpotifyPlayer {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  getCurrentState: () => Promise<any>;
  addListener: (event: string, callback: (state: any) => void) => boolean;
  removeListener: (event: string, callback: (state: any) => void) => boolean;
  disconnect: () => void;
}

interface UseSpotifyPlayerProps {
  accessToken: string;
  onPlayerReady?: (deviceId: string) => void;
  onPlayerStateChanged?: (state: any) => void;
}

export function useSpotifyPlayer({ 
  accessToken, 
  onPlayerReady, 
  onPlayerStateChanged 
}: UseSpotifyPlayerProps) {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!accessToken || scriptLoaded.current) return;

    // Load Spotify Web Playback SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      scriptLoaded.current = true;
      initializePlayer();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const initializePlayer = () => {
    if (!window.Spotify) return;

    const spotifyPlayer = new window.Spotify.Player({
      name: '10every Player',
      getOAuthToken: (cb: (token: string) => void) => {
        cb(accessToken);
      },
      volume: 0.5,
    });

    // Ready
    spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id);
      setDeviceId(device_id);
      setIsReady(true);
      onPlayerReady?.(device_id);
    });

    // Not Ready
    spotifyPlayer.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Player State Changed
    spotifyPlayer.addListener('player_state_changed', (state: any) => {
      if (!state) return;
      
      setCurrentTrack(state.track_window.current_track);
      setIsPlaying(!state.paused);
      setPosition(state.position);
      setDuration(state.duration);
      
      onPlayerStateChanged?.(state);
    });

    // Error handling
    spotifyPlayer.addListener('initialization_error', ({ message }: { message: string }) => {
      console.error('Failed to initialize:', message);
    });

    spotifyPlayer.addListener('authentication_error', ({ message }: { message: string }) => {
      console.error('Failed to authenticate:', message);
    });

    spotifyPlayer.addListener('account_error', ({ message }: { message: string }) => {
      console.error('Failed to validate Spotify account:', message);
    });

    spotifyPlayer.addListener('playback_error', ({ message }: { message: string }) => {
      console.error('Failed to perform playback:', message);
    });

    // Connect to the player
    spotifyPlayer.connect();
    setPlayer(spotifyPlayer);
  };

  const playTrack = async (spotifyUri: string) => {
    console.log('playTrack called with:', spotifyUri);
    console.log('Player exists:', !!player);
    console.log('Device ID:', deviceId);
    console.log('Access token:', accessToken ? 'Present' : 'Missing');

    if (!player || !deviceId) {
      console.error('Cannot play track: missing player or deviceId');
      return;
    }

    try {
      console.log('Making API call to play track...');
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [spotifyUri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to play track: ${response.status} ${errorText}`);
      }
      
      console.log('Track play request successful');
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const pause = () => {
    if (!player) return;
    player.pause();
  };

  const resume = () => {
    if (!player) return;
    player.play();
  };

  const seek = (positionMs: number) => {
    if (!player) return;
    player.seek(positionMs);
  };

  return {
    player,
    deviceId,
    isReady,
    isPlaying,
    currentTrack,
    position,
    duration,
    playTrack,
    pause,
    resume,
    seek,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Spotify: any;
  }
}