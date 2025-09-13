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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.duration);
  const lastSentPct = useRef<number>(-1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Use Spotify player state if available, otherwise fallback to local state
  const spotifyIsPlaying = spotifyPlayer?.isPlaying ?? false;
  const spotifyCurrentTime = spotifyPlayer ? Math.floor(spotifyPlayer.position / 1000) : 0;
  const spotifyDuration = spotifyPlayer ? Math.floor(spotifyPlayer.duration / 1000) : track.duration;

  // Update progress based on Spotify player or local state
  useEffect(() => {
    const currentTimeValue = spotifyPlayer ? spotifyCurrentTime : currentTime;
    const durationValue = spotifyPlayer ? spotifyDuration : duration;
    
    if (currentTimeValue <= 0) return;
    const pct = Math.min(100, Math.round((currentTimeValue / durationValue) * 100));
    if (pct === lastSentPct.current) return;
    lastSentPct.current = pct;

    const shouldReveal = track.revealed || pct >= 10;

    onUpdate({
      ...track,
      listened: true,
      listenProgress: pct,
      revealed: shouldReveal,
    });
  }, [spotifyCurrentTime, spotifyDuration, currentTime, duration, track, onUpdate, spotifyPlayer]);


  const handlePlayPause = () => {
    const currentIsPlaying = spotifyPlayer ? spotifyIsPlaying : isPlaying;
    console.log('Play button clicked, isPlaying:', currentIsPlaying);
    console.log('Spotify player available:', !!spotifyPlayer);
    
    if (!currentIsPlaying && !track.listened) {
      onUpdate({ ...track, listened: true });
    }
    
    // Use Spotify Web Playback SDK for full tracks
    if (spotifyPlayer) {
      if (currentIsPlaying) {
        console.log('Pausing track via Spotify...');
        spotifyPlayer.pause();
      } else {
        console.log('Playing track via Spotify...');
        spotifyPlayer.play();
      }
    } else {
      console.warn('No Spotify player available - user needs to authenticate');
      alert('Please connect your Spotify account to play full tracks. Click the "Connect with Spotify" button on the main page.');
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

  const currentTimeValue = spotifyPlayer ? spotifyCurrentTime : currentTime;
  const durationValue = spotifyPlayer ? spotifyDuration : duration;
  const progressPercentage = Math.min(
    100,
    Math.round((currentTimeValue / durationValue) * 100)
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
                {formatTime(currentTimeValue)} / {formatTime(Math.floor(durationValue))}
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
            {(spotifyPlayer ? spotifyIsPlaying : isPlaying) ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
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
        
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={track.audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}