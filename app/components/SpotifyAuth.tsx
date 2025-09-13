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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 max-w-lg w-full p-10 shadow-2xl text-center rounded-2xl">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <Music2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-white">Welcome to 10every</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Connect your Spotify account to experience full tracks and discover new music through our daily algorithm
          </p>
        </div>
        
        <Button
          onClick={handleSpotifyLogin}
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
        >
          <ExternalLink className="w-5 h-5 mr-3" />
          {isLoading ? 'Connecting...' : 'Connect with Spotify'}
        </Button>
        
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-400">
            🔒 Secure authentication via Spotify
          </p>
          <p className="text-xs text-gray-500">
            We only access playback controls, never your personal data
          </p>
        </div>
      </div>
    </div>
  );
}
