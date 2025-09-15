'use client';

import { useState, useEffect } from 'react';
import { X, Play, Pause, Check, Clock, Music2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import Image from 'next/image';

interface Submission {
  id: string;
  spotifyUrl: string;
  artist: string;
  title: string;
  albumArt: string;
  duration: number;
  submittedAt: string;
  previewUrl?: string;
  selected: boolean;
  order?: number;
}

interface AdminPanelProps {
  onClose: () => void;
  onPublishSelection: (selectedTracks: Submission[]) => void;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [showSelected, setShowSelected] = useState(false);
  const [sortBy, setSortBy] = useState<'time' | 'artist' | 'title'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isPublished, setIsPublished] = useState(false);

  // Load real submissions from API
  useEffect(() => {
    const loadSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions');
        const data = await response.json();
        setSubmissions(data.submissions.map((sub: any) => ({
          id: sub.id.toString(),
          spotifyUrl: sub.spotify_url,
          artist: sub.artist,
          title: sub.title,
          albumArt: sub.album_art_url || '/placeholder.png',
          duration: Math.floor(sub.duration_ms / 1000),
          submittedAt: new Date(sub.submitted_at).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          selected: false
        })));
      } catch (error) {
        console.error('Error loading submissions:', error);
        setSubmissions([]);
      }
    };
    
    loadSubmissions();
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleToggleSelection = (id: string) => {
    console.log('Toggling selection for:', id);
    setSubmissions(prev => {
      const updated = prev.map(submission => {
        if (submission.id === id) {
          const newSelected = !submission.selected;
          console.log('Updated selection for', id, 'to', newSelected);
          return { ...submission, selected: newSelected };
        }
        return submission;
      });
      
      const newCount = updated.filter(s => s.selected).length;
      console.log('New selected count:', newCount);
      setSelectedCount(newCount);
      return updated;
    });
  };

  const handlePlayPreview = (id: string) => {
    setCurrentlyPlaying(currentlyPlaying === id ? null : id);
  };

  const handleSort = (by: 'time' | 'artist' | 'title') => {
    if (sortBy === by) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(by);
      setSortOrder('asc');
    }
  };

  const sortedSubmissions = [...submissions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'time':
        comparison = a.submittedAt.localeCompare(b.submittedAt);
        break;
      case 'artist':
        comparison = a.artist.localeCompare(b.artist);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const filteredSubmissions = showSelected 
    ? sortedSubmissions.filter(s => s.selected)
    : sortedSubmissions;

  const handleAutoPick = () => {
    console.log('Auto-picking 10 tracks...');
    const shuffled = [...submissions].sort(() => Math.random() - 0.5);
    const autoSelected = shuffled.slice(0, 10);
    
    setSubmissions(prev => {
      const updated = prev.map(submission => ({
        ...submission,
        selected: autoSelected.some(selected => selected.id === submission.id)
      }));
      
      const newCount = updated.filter(s => s.selected).length;
      setSelectedCount(newCount);
      console.log('Auto-selected count:', newCount);
      return updated;
    });
  };

  const handlePublishSelection = async () => {
    console.log('Publish button clicked! - v2');
    const selectedTracks = submissions.filter(s => s.selected);
    console.log('Selected tracks:', selectedTracks.length, selectedTracks);
    console.log('All submissions:', submissions);
    
    if (selectedTracks.length === 10) {
      try {
        console.log('Publishing tracks...');
      const response = await fetch('/api/featured-tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({
            tracks: selectedTracks.map(track => ({
              spotify_url: track.spotifyUrl,
              title: track.title,
              artist: track.artist,
              album_art_url: track.albumArt,
              duration_ms: track.duration * 1000,
            }))
          })
        });

        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Response data:', responseData);

      if (response.ok) {
          console.log('Publish successful!');
          setIsPublished(true);
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
      } else {
          console.error('Failed to publish tracks:', responseData);
          alert('Failed to publish tracks. Check console for details.');
        }
      } catch (error) {
        console.error('Error publishing tracks:', error);
        alert('Error publishing tracks: ' + (error instanceof Error ? error.message : String(error)));
      }
    } else {
      console.log('Not enough tracks selected:', selectedTracks.length);
      alert(`Please select exactly 10 tracks. Currently selected: ${selectedTracks.length}`);
    }
  };

  const getSortIcon = (column: 'time' | 'artist' | 'title') => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  if (isPublished) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h1 className="tracking-wide">Selection Published</h1>
            <p className="text-muted-foreground">Today's <span className="helvetica-oblique">10</span> tracks are now live</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="min-h-full">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Image 
                  src="/logo.png" 
                  alt="10every admin" 
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="tracking-wide">Daily Curation</h1>
                    <Badge variant="outline" className="helvetica-oblique">
                      {selectedCount}/10
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground tracking-wide">
                    Select <span className="helvetica-oblique">10</span> tracks from today's submissions
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowSelected(!showSelected)}
                  variant="outline"
                  size="sm"
                  className="text-xs tracking-wide"
                >
                  {showSelected ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                  {showSelected ? 'Show All' : 'Selected Only'}
                </Button>
                
                <Button
                  onClick={handleAutoPick}
                  variant="outline"
                  size="sm"
                  className="text-xs tracking-wide"
                >
                  <Music2 className="w-3 h-3 mr-1" />
                  Auto Pick 10
                </Button>
                
                <Button
                  onClick={handlePublishSelection}
                  className="text-xs tracking-wide"
                >
                  <Music2 className="w-3 h-3 mr-1" />
                  Publish Selection ({selectedCount}/10)
                </Button>
                
              <Button
                  onClick={() => window.history.back()}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
              </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="space-y-6">
            
            {/* Stats & Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-sm text-muted-foreground">
                  <span className="helvetica-oblique">{submissions.length}</span> submissions received
                </div>
                <div className="text-sm text-muted-foreground">
                  Last submission at <span className="helvetica-oblique">10:22</span>
                </div>
              </div>
              
              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground tracking-wide">Sort by:</span>
                <Button
                  onClick={() => handleSort('time')}
                  variant={sortBy === 'time' ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs tracking-wide"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Time {getSortIcon('time')}
                </Button>
                <Button
                  onClick={() => handleSort('artist')}
                  variant={sortBy === 'artist' ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs tracking-wide"
                >
                  Artist {getSortIcon('artist')}
                </Button>
                <Button
                  onClick={() => handleSort('title')}
                  variant={sortBy === 'title' ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs tracking-wide"
                >
                  Title {getSortIcon('title')}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Submissions List */}
            <div className="space-y-1">
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No submissions yet. Upload some tracks to get started!</p>
                </div>
              ) : (
                filteredSubmissions.map((submission, index) => (
                  <div
                    key={submission.id}
                    className={`
                      group relative flex items-center gap-4 p-4 rounded-lg border transition-all duration-200
                      ${submission.selected 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'border-border hover:border-border/60 hover:bg-muted/50'
                      }
                    `}
                  >
                    {/* Selection Checkbox */}
                    <div className="flex items-center">
                      <Checkbox
                        checked={submission.selected}
                        onCheckedChange={() => handleToggleSelection(submission.id)}
                        disabled={!submission.selected && selectedCount >= 10}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>
                  
                    {/* Order Number (for selected tracks) */}
                    {submission.selected && (
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs helvetica-oblique">
                        {sortedSubmissions.filter(s => s.selected).indexOf(submission) + 1}
                      </div>
                    )}
                    
                    {/* Album Art */}
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={submission.albumArt || '/placeholder.png'}
                        alt={`${submission.artist} - ${submission.title}`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                        </div>
                        
                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {submission.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                            {submission.artist}
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div className="text-xs text-muted-foreground helvetica-oblique">
                      {formatDuration(submission.duration)}
                        </div>
                    
                    {/* Submission Time */}
                    <div className="text-xs text-muted-foreground helvetica-oblique">
                      {submission.submittedAt}
                      </div>
                      
                    {/* Play Button */}
                        <Button
                      onClick={() => handlePlayPreview(submission.id)}
                      variant="ghost"
                          size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {currentlyPlaying === submission.id ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                        </Button>
                    
                    {/* Selection indicator */}
                    {submission.selected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                ))
              )}
                    </div>

            {/* Selection Summary */}
            {selectedCount > 0 && (
              <div className="border border-border p-6 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Today's Selection</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="helvetica-oblique">{selectedCount}</span> of <span className="helvetica-oblique">10</span> tracks selected
                    </p>
                  </div>
                  
                  {selectedCount === 10 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Ready to publish</span>
                    </div>
                  )}
                </div>
                
                {selectedCount < 10 && (
                  <div className="mt-4">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(selectedCount / 10) * 100}%` }}
                      ></div>
        </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Select <span className="helvetica-oblique">{10 - selectedCount}</span> more tracks
            </p>
          </div>
        )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}