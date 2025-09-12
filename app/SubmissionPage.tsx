import { useState } from 'react';
import { X, Upload, Clock, Music2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Logo } from './components/Logo';

interface SubmissionPageProps {
  onClose: () => void;
}

export function SubmissionPage({ onClose }: SubmissionPageProps) {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotifyUrl.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spotifyUrl }),
      });

      if (response.ok) {
        setSubmitted(true);
        setSpotifyUrl('');
      } else {
        const error = await response.json();
        alert(`Submission failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit track. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidSpotifyUrl = (url: string) => {
    return url.includes('open.spotify.com/track/') || url.includes('spotify:track:');
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Logo className="h-8" />
                <span className="text-muted-foreground tracking-wide">submit</span>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              
              {/* Submission Form */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Music2 className="w-6 h-6" />
                    <h1 className="tracking-wide">Submit Your Spotify Track</h1>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="spotify-url" className="text-muted-foreground tracking-wide">
                      Spotify Track URL
                    </Label>
                    <Input
                      id="spotify-url"
                      type="url"
                      value={spotifyUrl}
                      onChange={(e) => setSpotifyUrl(e.target.value)}
                      placeholder="https://open.spotify.com/track/..."
                      className="bg-input-background border-border"
                      disabled={isSubmitting || submitted}
                    />
                    <p className="text-muted-foreground text-sm tracking-wide">
                      Paste your Spotify track link here. Streams will credit you directly.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={!isValidSpotifyUrl(spotifyUrl) || isSubmitting || submitted}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 tracking-wide"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : submitted ? 'Track Submitted' : 'Submit Track'}
                  </Button>

                  {submitted && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-muted-foreground text-sm tracking-wide">
                        Your track has been submitted for consideration in tomorrow's selection.
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* How It Works */}
              <div className="space-y-8">
                <h2 className="tracking-wide">How 10every Works</h2>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center helvetica-oblique">
                        1
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="tracking-wide">Submit</h3>
                      <p className="text-muted-foreground tracking-wide">
                        Share your Spotify track link with us
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center helvetica-oblique">
                        2
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="tracking-wide">Selection</h3>
                      <p className="text-muted-foreground tracking-wide">
                        First <span className="helvetica-oblique">10</span> tracks submitted daily get featured
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center helvetica-oblique">
                        3
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="tracking-wide">Anonymous Release</h3>
                      <p className="text-muted-foreground tracking-wide">
                        Tracks appear without artist names at <span className="helvetica-oblique">10am</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center helvetica-oblique">
                        4
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="tracking-wide">Discovery</h3>
                      <p className="text-muted-foreground tracking-wide">
                        Listeners must hear <span className="helvetica-oblique">10%</span> before revealing artist
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Deadline Notice */}
            <div className="mt-16 max-w-2xl">
              <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-blue-900 dark:text-blue-100 tracking-wide">Daily Deadline</h3>
                </div>
                <p className="text-blue-700 dark:text-blue-200 tracking-wide">
                  Submit before <span className="helvetica-oblique">10am</span> to have a chance at today's feature.
                  Only the first <span className="helvetica-oblique">10</span> submissions make it.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}