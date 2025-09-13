'use client';

import { useState } from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';

interface SpotifyAuthProps {
  onAuthSuccess: (accessToken: string) => void;
}

export function SpotifyAuth({ onAuthSuccess }: SpotifyAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
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
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Logo className="h-24 mx-auto mb-8" />
          
          <div className="space-y-2">
            <h1 className="tracking-wide text-2xl">Connect & Discover</h1>
            <div className="w-12 h-px bg-foreground mx-auto"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Connect your Spotify account to access the daily selection of curated tracks.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              Each day, ten tracks. Rate, discover, collect.
            </p>
          </div>

          {/* Connection Button */}
          <div className="space-y-4">
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-foreground text-background hover:bg-foreground/90 py-4 tracking-wide"
            >
              {isConnecting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                  <span>Initializing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Connect Spotify</span>
                </div>
              )}
            </Button>

            {/* Security Note */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Lock className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">
                We access only playback controls and track metadata. 
                Your listening history and personal data remain private.
              </p>
            </div>
          </div>

          {/* Skip Option */}
          <div className="text-center pt-4 border-t border-border">
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wide">
              Continue without Spotify
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground tracking-wide">
            Daily selection resets at midnight
          </p>
          <div className="helvetica-oblique text-xs text-muted-foreground mt-1">
            00:00:00
          </div>
        </div>
      </div>
    </div>
  );
}
