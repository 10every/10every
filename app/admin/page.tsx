'use client';

import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Music2, Calendar, User, Clock } from 'lucide-react';
import Image from 'next/image';
import { Logo } from '../components/Logo';

interface Submission {
  id: number;
  spotify_url: string;
  spotify_id: string;
  title: string;
  artist: string;
  album: string;
  album_art_url: string;
  duration_ms: number;
  preview_url: string;
  submitted_at: string;
  status: string;
  featured: boolean;
  featured_date: string | null;
  is_featured_today: boolean;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
        
        // Pre-select today's featured tracks
        const featuredToday = data.submissions
          .filter((s: Submission) => s.is_featured_today)
          .map((s: Submission) => s.id);
        setSelectedTracks(featuredToday);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackSelect = (trackId: number) => {
    setSelectedTracks(prev => {
      if (prev.includes(trackId)) {
        return prev.filter(id => id !== trackId);
      } else if (prev.length < 10) {
        return [...prev, trackId];
      }
      return prev;
    });
  };

  const handleSaveFeaturedTracks = async () => {
    if (selectedTracks.length !== 10) {
      alert('Please select exactly 10 tracks');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/featured-tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackIds: selectedTracks }),
      });

      if (response.ok) {
        alert('Featured tracks updated successfully!');
        fetchSubmissions(); // Refresh data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving featured tracks:', error);
      alert('Failed to save featured tracks');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo className="h-24" />
              <div>
                <h1 className="text-3xl font-bold tracking-wide">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">Select 10 tracks to feature today</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {selectedTracks.length}/10 selected
              </Badge>
              <Button
                onClick={handleSaveFeaturedTracks}
                disabled={selectedTracks.length !== 10 || isSaving}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                {isSaving ? 'Saving...' : 'Save Featured Tracks'}
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-6">
          {submissions.map((submission) => (
            <Card key={submission.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Image
                      src={submission.album_art_url || '/placeholder.png'}
                      alt={submission.title}
                      width={120}
                      height={120}
                      className="w-30 h-30 object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Checkbox
                            checked={selectedTracks.includes(submission.id)}
                            onCheckedChange={() => handleTrackSelect(submission.id)}
                            disabled={!selectedTracks.includes(submission.id) && selectedTracks.length >= 10}
                          />
                          <h3 className="text-lg font-semibold">{submission.title}</h3>
                          {submission.is_featured_today && (
                            <Badge variant="default" className="bg-green-600">
                              Featured Today
                            </Badge>
                          )}
                          {submission.featured && !submission.is_featured_today && (
                            <Badge variant="secondary">
                              Previously Featured
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Music2 className="w-4 h-4" />
                            {submission.artist}
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {submission.album}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {formatDuration(submission.duration_ms)}
                          </p>
                          <p className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Submitted {formatDate(submission.submitted_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(submission.spotify_url, '_blank')}
                        >
                          Open in Spotify
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-20">
            <Music2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
            <p className="text-muted-foreground">
              Submissions will appear here once users start submitting tracks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
