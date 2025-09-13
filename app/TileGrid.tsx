'use client';

import type { Track } from './types';
import TrackTile from './TrackTile';

type TileGridProps = {
  tracks: Track[];
  onTileClick: (track: Track) => void;
};

export function TileGrid({ tracks, onTileClick }: TileGridProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 place-items-stretch">
        {tracks.map((track) => (
          <div key={track.id} className="w-full h-full">
            <TrackTile track={track} onClick={() => onTileClick(track)} />
          </div>
        ))}
      </div>

      <div className="text-center mt-12 text-muted-foreground text-sm tracking-wide">
        tracks reveal after <span className="helvetica-oblique">10%</span> listen • daily selection resets at midnight
      </div>
    </div>
  );
}