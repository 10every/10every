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
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight">10every</h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-medium">Connect & Discover</h2>
            <div className="w-16 h-0.5 bg-foreground mx-auto"></div>
          </div>
        </div>
        
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Connect your Spotify account to access the daily selection of curated tracks.
          </p>
          <p className="text-lg">
            Each day, ten tracks. Rate, discover, collect.
          </p>
        </div>
        
        <Button
          onClick={handleSpotifyLogin}
          disabled={isLoading}
          className="w-full bg-foreground text-background hover:bg-foreground/90 text-lg py-6 rounded-lg font-medium"
        >
          <Music2 className="w-5 h-5 mr-3" />
          {isLoading ? 'Connecting...' : 'Connect Spotify'}
        </Button>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>🔒</span>
            <span>We access only playback controls and track metadata. Your listening history and personal data remain private.</span>
          </div>
          
          <button className="text-sm text-muted-foreground hover:text-foreground underline">
            Continue without Spotify
          </button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Daily selection resets at midnight
        </div>
      </div>
    </div>
  );
}
