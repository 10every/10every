'use client';

import { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { Upload, FileText } from 'lucide-react';
import { Button } from './components/ui/button';
import { SubmissionPage } from './SubmissionPage';
import { Manifesto } from './Manifesto';

interface Track {
  id: number;
  title: string;
  artist: string;
  spotifyUrl: string;
  albumArt: string;
}

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [showSubmission, setShowSubmission] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);

  // Mock tracks for now - you can replace with real API call
  useEffect(() => {
    const mockTracks: Track[] = [
      { id: 1, title: "Track 1", artist: "Artist 1", spotifyUrl: "https://open.spotify.com/track/4qjVtuuXzU8O6Z3I80JjB", albumArt: "/placeholder.png" },
      { id: 2, title: "Track 2", artist: "Artist 2", spotifyUrl: "https://open.spotify.com/track/2jgbxTfK1U2leeuUudxAaD", albumArt: "/placeholder.png" },
      { id: 3, title: "Track 3", artist: "Artist 3", spotifyUrl: "https://open.spotify.com/track/3h7cIUPJ0Re2JryPOxW0bL", albumArt: "/placeholder.png" },
      { id: 4, title: "Track 4", artist: "Artist 4", spotifyUrl: "https://open.spotify.com/track/4f7WXvbpugXffV1I2L5i5G", albumArt: "/placeholder.png" },
      { id: 5, title: "Track 5", artist: "Artist 5", spotifyUrl: "https://open.spotify.com/track/2T6d8iUQo1a1Lt9TboNqRW", albumArt: "/placeholder.png" },
      { id: 6, title: "Track 6", artist: "Artist 6", spotifyUrl: "https://open.spotify.com/track/5S0uPH9I35AgMZJlu6LjkX", albumArt: "/placeholder.png" },
      { id: 7, title: "Track 7", artist: "Artist 7", spotifyUrl: "https://open.spotify.com/track/3kSxrNy5X5yzaXk5hTdLb6", albumArt: "/placeholder.png" },
      { id: 8, title: "Track 8", artist: "Artist 8", spotifyUrl: "https://open.spotify.com/track/2Iyz3f0diV6eLkfNDZLqYN", albumArt: "/placeholder.png" },
      { id: 9, title: "Track 9", artist: "Artist 9", spotifyUrl: "https://open.spotify.com/track/5v2VXH3R9vNtUr0i5XL9iF", albumArt: "/placeholder.png" },
      { id: 10, title: "Track 10", artist: "Artist 10", spotifyUrl: "https://open.spotify.com/track/3o4xJ0fJwmx6SF5XLs4f50", albumArt: "/placeholder.png" },
    ];
    setTracks(mockTracks);
  }, []);

  const extractSpotifyId = (url: string) => {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="mb-4">
            <Logo className="mx-auto h-24 w-auto" />
          </div>
          
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setShowSubmission(true)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Upload className="w-4 h-4 mr-2" />
              submit
            </Button>
            <Button
              onClick={() => setShowManifesto(true)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <FileText className="w-4 h-4 mr-2" />
              manifesto
            </Button>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {tracks.map((track) => {
              const spotifyId = extractSpotifyId(track.spotifyUrl);
              return (
                <div key={track.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="aspect-square mb-4">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {showSubmission && <SubmissionPage onClose={() => setShowSubmission(false)} />}
      {showManifesto && <Manifesto onClose={() => setShowManifesto(false)} />}
    </div>
  );
}
