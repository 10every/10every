'use client';

import type { Track } from './types';
import { Check, Star, Plus, Eye } from 'lucide-react';

type TrackTileProps = {
  track: Track;
  onClick: () => void;
};

export default function TrackTile({ track, onClick }: TrackTileProps) {
  const indicators: React.ReactElement[] = [];

  if (track.listened && !track.revealed) {
    indicators.push(<Check key="check" className="w-3 h-3 text-muted-foreground" />);
  }
  if ((track.rating ?? 0) > 0) {
    indicators.push(<Star key="star" className="w-3 h-3 text-primary fill-primary" />);
  }
  if (track.downloaded) {
    indicators.push(<Plus key="added" className="w-3 h-3 text-primary" />);
  }

  const hasInteracted = track.listened || (track.rating ?? 0) > 0 || track.downloaded;

  return (
    <div className="relative w-full aspect-square [perspective:1000px] overflow-hidden">
      <div
        className={`absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d]
        ${track.revealed ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* FRONT */}
        <button
          type="button"
          onClick={onClick}
          className={`absolute inset-0 w-full h-full [backface-visibility:hidden]
          border border-border bg-background transition-all duration-300 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          hover:border-primary hover:shadow-sm
          ${hasInteracted && !track.revealed ? 'bg-muted/30 opacity-80' : ''}`}
        >
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-muted-foreground/30 text-lg font-mono helvetica-oblique">
              {String(track.id).padStart(2, '0')}
            </span>
          </div>

          {track.listenProgress > 0 && track.listenProgress < 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-background/20">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${track.listenProgress}%` }}
              />
            </div>
          )}

          {indicators.length > 0 && (
            <div className="absolute top-2 right-2 flex gap-1 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
              {indicators}
            </div>
          )}
        </button>

        {/* BACK */}
        <button
          type="button"
          onClick={onClick}
          className="absolute inset-0 w-full h-full [backface-visibility:hidden]
          [transform:rotateY(180deg)] border-2 border-primary/30 shadow-lg
          hover:shadow-xl hover:border-primary/50
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {track.albumArt && (
            <>
              <img
                src={
                  typeof track.albumArt === 'string'
                    ? track.albumArt
                    : (track.albumArt as any).src
                }
                alt={`${track.artist ?? ''} - ${track.title ?? ''}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 space-y-1">
                  <div className="text-white font-semibold text-base leading-tight truncate">
                    {track.title}
                  </div>
                  <div className="text-white/90 text-sm truncate">{track.artist}</div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-xs font-medium">REVEALED</span>
                    </div>

                    {track.rank && track.rank <= 3 && (
                      <div className="bg-yellow-500/90 text-black text-xs font-bold px-2 py-1 rounded helvetica-oblique">
                        #{track.rank}
                      </div>
                    )}

                    <span className="text-white/60 text-xs font-mono helvetica-oblique">
                      {String(track.id).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {track.listenProgress > 0 && track.listenProgress < 100 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/30">
              <div
                className="h-full bg-white/80 transition-all duration-300"
                style={{ width: `${track.listenProgress}%` }}
              />
            </div>
          )}

          <div className="absolute top-3 right-3 flex gap-1">
            {(track.rating ?? 0) > 0 && (
              <div className="bg-yellow-500/90 text-black rounded-full p-1">
                <Star className="w-3 h-3 fill-current" />
              </div>
            )}
            {track.downloaded && (
              <div className="bg-green-500/90 text-white rounded-full p-1">
                <Plus className="w-3 h-3" />
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}