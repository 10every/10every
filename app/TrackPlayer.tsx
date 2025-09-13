'use client';

import { useEffect, useRef, useState } from 'react';
import type { Track } from './types';
import { Play, Pause, Plus, Star, X, ExternalLink, Eye } from 'lucide-react';
import { Button } from './components/ui/button';

type TrackPlayerProps = {
  track: Track;
  onClose: () => void;
  onUpdate: (t: Track) => void;
  spotifyPlayer?: {
    isPlaying: boolean;
    currentTrack: any;
    position: number;
    duration: number;
    pause: () => void;
    play: () => void;
  };
};

export function TrackPlayer({ track, onClose, onUpdate, spotifyPlayer }: TrackPlayerProps) {
  const [rating, setRating] = useState(track.rating ?? 0);
  const [downloaded, setDownloaded] = useState(track.downloaded);
  const lastSentPct = useRef<number>(-1);

  // Use Spotify player state if available, otherwise fallback to local state
  const isPlaying = spotifyPlayer?.isPlaying ?? false;
  const currentTime = spotifyPlayer ? Math.floor(spotifyPlayer.position / 1000) : 0;
  const duration = spotifyPlayer ? Math.floor(spotifyPlayer.duration / 1000) : track.duration;

  // Update progress based on Spotify player or local state
  useEffect(() => {
    if (currentTime <= 0) return;
    const pct = Math.min(100, Math.round((currentTime / duration) * 100));
    if (pct === lastSentPct.current) return;
    lastSentPct.current = pct;

    const shouldReveal = track.revealed || pct >= 10;

    onUpdate({
      ...track,
      listened: true,
      listenProgress: pct,
      revealed: shouldReveal,
    });
  }, [currentTime, duration, track, onUpdate]);


  const handlePlayPause = () => {
    console.log('Play button clicked, isPlaying:', isPlaying);
    console.log('Spotify player available:', !!spotifyPlayer);
    
    if (!isPlaying && !track.listened) {
      onUpdate({ ...track, listened: true });
    }
    
    if (spotifyPlayer) {
      if (isPlaying) {
        console.log('Pausing track...');
        spotifyPlayer.pause();
      } else {
        console.log('Playing track...');
        spotifyPlayer.play();
      }
    } else {
      console.warn('No Spotify player available, trying fallback...');
      // Fallback: Use HTML5 audio with preview URL
      if (track.audioUrl && track.audioUrl !== 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav') {
        console.log('Using HTML5 audio fallback with preview URL');
        const audio = new Audio(track.audioUrl);
        audio.play().catch(err => {
          console.error('HTML5 audio playback failed:', err);
          alert('Unable to play track. This may be due to browser restrictions or the track not being available.');
        });
      } else {
        alert('Spotify Web Playback requires Spotify Premium. Please upgrade your account to play full tracks.');
      }
    }
  };

  const handleRate = (newRating: number) => {
    const finalRating = rating === newRating ? 0 : newRating;
    setRating(finalRating);
    onUpdate({ ...track, rating: finalRating });
  };

  const handleAddToLibrary = () => {
    if (downloaded) return;
    setDownloaded(true);
    onUpdate({ ...track, downloaded: true });
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercentage = Math.min(
    100,
    Math.round((currentTime / track.duration) * 100)
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border max-w-md w-full p-8 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm font-mono helvetica-oblique">
              Track {String(track.id).padStart(2, '0')}
            </span>
            {track.revealed && (
              <span className="inline-flex items-center gap-1 text-primary">
                <Eye className="w-3 h-3" />
                <span className="text-xs">Revealed</span>
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Revealed info */}
        {track.revealed && (
          <div className="mb-8">
            <div className="flex gap-4 items-center">
              {track.albumArt && (
                <div className="w-16 h-16 rounded overflow-hidden">
                  <img
                    src={typeof track.albumArt === 'string' ? track.albumArt : track.albumArt.src}
                    alt={`${track.artist ?? ''} - ${track.title ?? ''}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-medium truncate">{track.title}</h3>
                <p className="text-muted-foreground text-sm truncate">{track.artist}</p>
                {track.spotifyUrl && (
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open in Spotify
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="h-16 bg-muted/20 relative overflow-hidden">
            <div
              className="h-full bg-primary/20 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-xs text-muted-foreground font-mono helvetica-oblique">
                {formatTime(currentTime)} / {formatTime(Math.floor(track.duration))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePlayPause}
            className="h-16 w-16 rounded-full"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </Button>
        </div>

        {/* Actions */}
        <div className="flex justify-center items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRate(star)}
                  className="h-8 w-8 p-0"
                >
                  <Star
                    className={`w-4 h-4 ${star <= rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                  />
                </Button>
              ))}
            </div>
            {rating > 0 && (
              <span className="text-xs text-muted-foreground">
                Rated {rating}/5
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddToLibrary}
            disabled={downloaded}
            className="h-8 w-8 p-0"
          >
            <Plus className={`w-4 h-4 ${downloaded ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
        </div>

        <div className="text-center mt-8 text-xs text-muted-foreground">
          {track.revealed ? (
            <>Revealed at <span className="helvetica-oblique">{Math.round(track.listenProgress)}%</span> • Archived at midnight</>
          ) : (
            <>Anonymous • Listen to <span className="helvetica-oblique">10%</span> to reveal • Archived at midnight</>
          )}
        </div>
      </div>
    </div>
  );
}