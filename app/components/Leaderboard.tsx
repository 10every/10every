'use client';

// Leaderboard component with daily and all-time rankings
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Star, Calendar, Clock } from 'lucide-react';

interface LeaderboardEntry {
  track_id: string;
  total_ratings: number;
  total_score: number;
  average_rating: number;
  title: string;
  artist: string;
  spotify_url: string;
  album_art: string;
  rank: number;
  daily_position?: number;
  featured_date?: string;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  period: string;
  total: number;
  limit: number;
}

interface LeaderboardProps {
  onClose: () => void;
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [period, setPeriod] = useState<'today' | 'all-time'>('today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?period=${period}&limit=50`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-mono text-muted-foreground">#{rank}</span>;
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= fullStars 
                ? 'text-yellow-500 fill-current' 
                : star === fullStars + 1 && hasHalfStar
                ? 'text-yellow-500 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          {formatRating(rating)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl max-h-[80vh] mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[60vh]">
          <Tabs value={period} onValueChange={(value) => setPeriod(value as 'today' | 'all-time')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="today" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Today</span>
              </TabsTrigger>
              <TabsTrigger value="all-time" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>All Time</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              {data?.leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tracks rated today yet</p>
                </div>
              ) : (
                data?.leaderboard.map((entry, index) => (
                  <div
                    key={entry.track_id}
                    className="flex items-center space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="flex-shrink-0">
                      {entry.album_art ? (
                        <img
                          src={entry.album_art}
                          alt={entry.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">🎵</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{entry.artist}</p>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      {renderStars(entry.average_rating)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.total_ratings} rating{entry.total_ratings !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {entry.daily_position && (
                      <Badge variant="secondary" className="flex-shrink-0">
                        Position #{entry.daily_position}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="all-time" className="space-y-4">
              {data?.leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tracks rated yet</p>
                </div>
              ) : (
                data?.leaderboard.map((entry, index) => (
                  <div
                    key={entry.track_id}
                    className="flex items-center space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="flex-shrink-0">
                      {entry.album_art ? (
                        <img
                          src={entry.album_art}
                          alt={entry.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">🎵</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{entry.artist}</p>
                      {entry.featured_date && (
                        <p className="text-xs text-muted-foreground">
                          Featured: {new Date(entry.featured_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0 text-right">
                      {renderStars(entry.average_rating)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.total_ratings} rating{entry.total_ratings !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
