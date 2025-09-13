'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Music2, ExternalLink } from 'lucide-react';

interface SpotifyAuthProps {
  onAuthSuccess: (accessToken: string) => void;
}

export function SpotifyAuth({ onAuthSuccess }: SpotifyAuthProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSpotifyLogin = () => {
    setIsLoading(true);
    
    // Spotify OAuth parameters
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = 'https://10every.com/callback';
    const scopes = [
      'streaming',
      'user-read-email',
      'user-read-private',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing'
    ].join(' ');
    
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `show_dialog=true`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border max-w-md w-full p-8 shadow-xl text-center">
        <div className="mb-6">
          <Music2 className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Connect to Spotify</h2>
          <p className="text-muted-foreground">
            Link your Spotify account to play full tracks and discover new music
          </p>
        </div>
        
        <Button
          onClick={handleSpotifyLogin}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {isLoading ? 'Connecting...' : 'Connect with Spotify'}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4">
          We'll only access your music playback controls, never your personal data
        </p>
      </div>
    </div>
  );
}
