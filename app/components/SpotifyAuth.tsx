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
          <Logo className="h-24 sm:h-28 md:h-32 lg:h-36 mx-auto mb-8" />
          
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
          <div className="space-y-4 flex justify-center">
            <div className="relative w-24 h-24">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="absolute inset-0 w-full h-full border border-slate-300 bg-slate-100 transition-all duration-300 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                hover:border-slate-400 hover:shadow-sm touch-manipulation
                active:scale-95 active:bg-slate-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:shadow-none
                disabled:active:scale-100"
              >
                <div className="absolute inset-0 grid place-items-center p-3">
                  {isConnecting ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-600 rounded-full animate-spin"></div>
                      <span className="text-xs tracking-wide text-slate-600">Loading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-slate-600" />
                      <span className="text-xs tracking-wide text-slate-600">Connect</span>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

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
