/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities, @typescript-eslint/no-explicit-any */
'use client';
import type { Track } from './types';
import { Button } from './components/ui/button';
import { Star, Plus, RotateCcw, Crown, Medal, Award, Trophy, Calendar, Zap, FileText } from 'lucide-react';
import { useState } from 'react';
const logoImage = '/logo.png';
const placeholderAlbum = '/placeholder.png';

interface EndOfDayRecapProps {
  tracks: Track[];
  onNewDay: () => void;
  onShowManifesto?: () => void;
}

// Extended track interface for all-time data
interface AllTimeTrack extends Track {
  dayNumber: number;
  dateDiscovered: string;
}

export function EndOfDayRecap({ tracks, onNewDay, onShowManifesto }: EndOfDayRecapProps) {
  const [view, setView] = useState<'today' | 'alltime'>('today');

  // Generate mock all-time data (100 tracks from previous days)
  const generateAllTimeData = (): AllTimeTrack[] => {
    const artists = [
      "Radiohead", "The Beatles", "Pink Floyd", "Led Zeppelin", "David Bowie",
      "Queen", "The Rolling Stones", "Bob Dylan", "Nirvana", "The Clash",
      "Arcade Fire", "Vampire Weekend", "LCD Soundsystem", "The Strokes", "Arctic Monkeys",
      "Tame Impala", "Glass Animals", "MGMT", "Foster the People", "Two Door Cinema Club",
      "Phoenix", "Daft Punk", "Justice", "Moderat", "Bon Iver",
      "Sufjan Stevens", "Fleet Foxes", "Grizzly Bear", "Animal Collective", "Beach House",
      "Mac DeMarco", "King Krule", "FKA twigs", "James Blake", "Thom Yorke",
      "Aphex Twin", "Boards of Canada", "Autechre", "Squarepusher", "Flying Lotus",
      "Kendrick Lamar", "Frank Ocean", "Tyler, The Creator", "Earl Sweatshirt", "Vince Staples",
      "Danny Brown", "Death Grips", "Run The Jewels", "MF DOOM", "Madvillain"
    ];

    const allTimeTracks: AllTimeTrack[] = [];
    
    // Generate 100 tracks from the last 30 days
    for (let i = 0; i < 100; i++) {
      const dayNumber = Math.floor(i / 3.3) + 1; // Roughly 3-4 tracks per day
      const daysAgo = 30 - dayNumber;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      const artist = artists[Math.floor(Math.random() * artists.length)];
      const trackTitles = [
        "Midnight Symphony", "Electric Dreams", "Neon Lights", "City Pulse", "Ocean Waves",
        "Desert Wind", "Mountain Echo", "River Flow", "Forest Whisper", "Cosmic Dance",
        "Digital Love", "Analog Heart", "Synthetic Soul", "Organic Mind", "Virtual Reality",
        "Parallel Universe", "Time Machine", "Space Odyssey", "Future Past", "Present Moment"
      ];
      
      const baseScore = Math.random() * 150; // Random base score
      const engagementBonus = Math.random() * 50; // Additional engagement
      const totalScore = baseScore + engagementBonus;
      
      allTimeTracks.push({
        id: 1000 + i,
        audioUrl: `https://example.com/track-${i}`,
        duration: 120 + Math.random() * 180,
        listened: true,
        rating: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : null,
        downloaded: Math.random() > 0.7,
        listenProgress: 30 + Math.random() * 70,
        revealed: true,
        score: totalScore,
        rank: i + 1,
        artist: artist,
        title: trackTitles[Math.floor(Math.random() * trackTitles.length)],
        albumArt: placeholderAlbum,
        spotifyUrl: `https://open.spotify.com/track/example-${i}`,
        dayNumber: dayNumber,
        dateDiscovered: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    // Sort by score (highest first) and assign proper ranks
    return allTimeTracks
      .sort((a, b) => b.score - a.score)
      .map((track, index) => ({ ...track, rank: index + 1 }));
  };
  const getTopTracks = () => {
    if (view === 'today') {
      // Get tracks with meaningful engagement (revealed tracks only)
      const engagedTracks = tracks.filter(track => 
        track.revealed && (track.rating || track.downloaded || track.listenProgress > 50)
      );
      
      // Sort by rank (lowest rank number = highest position)
      return engagedTracks
        .sort((a, b) => (a.rank || 11) - (b.rank || 11))
        .slice(0, 10); // All 10 tracks for today
    } else {
      // Return all-time top 100
      return generateAllTimeData().slice(0, 100);
    }
  };

  const getRankIcon = (rank: number, isAllTime: boolean = false) => {
    if (rank === 1) return (
      <div className={`${isAllTime ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-yellow-500'} text-white rounded-full p-2 shadow-lg`}>
        <Crown className="w-6 h-6" />
      </div>
    );
    if (rank === 2) return (
      <div className={`${isAllTime ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 'bg-gray-400'} text-white rounded-full p-2 shadow-lg`}>
        <Medal className="w-6 h-6" />
      </div>
    );
    if (rank === 3) return (
      <div className={`${isAllTime ? 'bg-gradient-to-br from-amber-500 to-amber-700' : 'bg-amber-600'} text-white rounded-full p-2 shadow-lg`}>
        <Award className="w-6 h-6" />
      </div>
    );
    if (isAllTime && rank <= 10) return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full p-2 shadow-md">
        <Trophy className="w-6 h-6" />
      </div>
    );
    return (
      <div className="bg-muted text-muted-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold">
        <span className="text-sm helvetica-oblique">#{rank}</span>
      </div>
    );
  };

  const getStats = () => {
    const listened = tracks.filter(track => track.listened).length;
    const revealed = tracks.filter(track => track.revealed).length;
    const rated = tracks.filter(track => track.rating && track.rating > 0).length;
    const added = tracks.filter(track => track.downloaded).length;
    
    return { listened, revealed, rated, added };
  };

  const topTracks = getTopTracks();
  const stats = getStats();
  const allTimeData = generateAllTimeData();

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className={`mx-auto text-center space-y-8 ${view === 'alltime' ? 'max-w-4xl' : 'max-w-md'}`}>
        <header className="relative">
          <div className="mb-3">
            <img 
              src={logoImage} 
              alt="10every" 
              className="h-10 mx-auto"
            />
          </div>
          <p className="text-muted-foreground text-sm tracking-wide">Rankings Archive</p>
          
          {/* Manifesto Link */}
          {onShowManifesto && (
            <div className="absolute top-0 right-0">
              <Button
                onClick={onShowManifesto}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground text-xs tracking-wide"
              >
                <FileText className="w-3 h-3 mr-1" />
                manifesto
              </Button>
            </div>
          )}
          
          {/* View Toggle */}
          <div className="mt-6 flex items-center justify-center">
            <div className="bg-muted p-1 rounded-lg flex">
              <button
                onClick={() => setView('today')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  view === 'today' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Today (10)
              </button>
              <button
                onClick={() => setView('alltime')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  view === 'alltime' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                All Time (100)
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {view === 'today' && (
            <div className="border border-border p-6 space-y-4">
              <h2 className="text-lg font-medium">Today's Session</h2>
              
              <div className="grid grid-cols-4 gap-3 text-center">
                <div>
                  <div className="text-xl font-mono helvetica-oblique">{stats.listened}</div>
                  <div className="text-xs text-muted-foreground">Listened</div>
                </div>
                <div>
                  <div className="text-xl font-mono helvetica-oblique">{stats.revealed}</div>
                  <div className="text-xs text-muted-foreground">Revealed</div>
                </div>
                <div>
                  <div className="text-xl font-mono helvetica-oblique">{stats.rated}</div>
                  <div className="text-xs text-muted-foreground">Rated</div>
                </div>
                <div>
                  <div className="text-xl font-mono helvetica-oblique">{stats.added}</div>
                  <div className="text-xs text-muted-foreground">Added</div>
                </div>
              </div>
            </div>
          )}

          {view === 'alltime' && (
            <div className="border border-border p-6 space-y-4">
              <h2 className="text-lg font-medium">All-Time Statistics</h2>
              
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-mono helvetica-oblique">100</div>
                  <div className="text-xs text-muted-foreground">Total Tracks</div>
                </div>
                <div>
                  <div className="text-2xl font-mono helvetica-oblique">30</div>
                  <div className="text-xs text-muted-foreground">Days Active</div>
                </div>
                <div>
                  <div className="text-2xl font-mono helvetica-oblique">{allTimeData.filter(t => t.rating && t.rating >= 4).length}</div>
                  <div className="text-xs text-muted-foreground">High Rated</div>
                </div>
                <div>
                  <div className="text-2xl font-mono helvetica-oblique">{allTimeData.filter(t => t.downloaded).length}</div>
                  <div className="text-xs text-muted-foreground">Added to Library</div>
                </div>
              </div>
            </div>
          )}

          {/* Rankings */}
          {topTracks.length > 0 && (
            <div className="border border-border p-6 space-y-6">
              <h2 className="text-xl font-medium text-center">
                {view === 'today' ? "Today's Top Discoveries" : "All-Time Greatest Hits"}
              </h2>
              
              <div className={`space-y-3 ${view === 'alltime' ? 'max-h-96 overflow-y-auto' : ''}`}>
                {topTracks.map((track, index) => {
                  const isAllTime = view === 'alltime';
                  const trackData = isAllTime ? track as AllTimeTrack : track;
                  
                  return (
                    <div key={track.id} className={`
                      flex items-center gap-4 p-3 rounded-lg transition-all duration-300
                      ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20' : 
                        index === 1 ? 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 border border-gray-400/20' :
                        index === 2 ? 'bg-gradient-to-r from-amber-600/10 to-amber-700/10 border border-amber-600/20' :
                        isAllTime && index < 10 ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20' :
                        'bg-muted/20 border border-border/50'}
                    `}>
                      {/* Rank Icon */}
                      <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
                        {getRankIcon(track.rank || 0, isAllTime)}
                      </div>
                      
                      {/* Album Art */}
                      {track.albumArt && (
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={typeof track.albumArt === 'string' ? track.albumArt : track.albumArt.src}
                            alt={`${track.artist} - ${track.title}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {track.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {track.artist}
                        </div>
                        {isAllTime && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Day <span className="helvetica-oblique">{(trackData as AllTimeTrack).dayNumber}</span> • {(trackData as AllTimeTrack).dateDiscovered}
                          </div>
                        )}
                      </div>
                      
                      {/* Score */}
                      <div className="text-xs text-muted-foreground text-right flex-shrink-0">
                        <div className="font-mono helvetica-oblique">{Math.round(track.score)} pts</div>
                      </div>
                      
                      {/* Engagement Stats */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {track.rating && (
                          <div className="flex items-center gap-1 bg-yellow-500/20 px-1.5 py-0.5 rounded">
                            <Star className="w-2.5 h-2.5 fill-current text-yellow-600" />
                            <span className="text-xs font-medium helvetica-oblique">{track.rating}</span>
                          </div>
                        )}
                        {track.downloaded && (
                          <div className="bg-green-500/20 p-0.5 rounded">
                            <Plus className="w-2.5 h-2.5 text-green-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Overall message */}
              <div className="text-center pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  {view === 'today' 
                    ? "Rankings based on listening time, ratings, and library adds"
                    : "Top 100 tracks from your discovery journey"}
                </p>
              </div>
            </div>
          )}

          {view === 'today' && (
            <>
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm mb-4">
                  Today's algorithm has concluded. Tracks archived.
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Return tomorrow for the next iteration of discovery.
                </p>
              </div>

              <Button 
                onClick={onNewDay}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Day (Demo)
              </Button>
            </>
          )}

          {view === 'alltime' && (
            <div className="text-center py-6">
              <p className="text-muted-foreground text-sm mb-2">
                Your complete discovery archive
              </p>
              <p className="text-xs text-muted-foreground/60">
                <span className="helvetica-oblique">100</span> tracks • <span className="helvetica-oblique">30</span> days • Infinite possibilities
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}