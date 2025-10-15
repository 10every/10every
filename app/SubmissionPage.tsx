import { useState } from 'react';
import { X, Upload, Clock } from 'lucide-react';
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
        <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Logo className="h-20 sm:h-24 md:h-28 w-auto" />
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
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              
              {/* Submission Form */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="space-y-6">
                    <h1 className="text-lg tracking-wide text-muted-foreground">submit your spotify track</h1>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="spotify-url" className="text-sm tracking-wide text-muted-foreground">
                      spotify track url
                    </Label>
                    <Input
                      id="spotify-url"
                      type="url"
                      value={spotifyUrl}
                      onChange={(e) => setSpotifyUrl(e.target.value)}
                      placeholder="https://open.spotify.com/track/..."
                      className="bg-input-background border-border h-12 text-base"
                      disabled={isSubmitting || submitted}
                    />
                    <p className="text-sm tracking-wide text-muted-foreground leading-relaxed">
                      paste your spotify track link here. streams will credit you directly.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={!isValidSpotifyUrl(spotifyUrl) || isSubmitting || submitted}
                    className="w-full text-sm tracking-wide h-12 relative overflow-hidden transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: '#B7C9E5', 
                      color: '#000000',
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                    }}
                  >
                    {/* Glassmorphism reflective sheen */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 30%, transparent 60%)',
                        borderRadius: 'inherit'
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-center">
                      <Upload className="w-5 h-5 mr-2" />
                      {isSubmitting ? 'submitting...' : submitted ? 'track submitted' : 'submit track'}
                    </div>
                  </Button>

                  {submitted && (
                    <div className="p-6 bg-muted rounded-lg">
                      <p className="text-sm tracking-wide text-muted-foreground leading-relaxed">
                        your track has been submitted for consideration in tomorrow's selection.
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* How It Works */}
              <div className="space-y-10">
                <h2 className="text-lg tracking-wide text-muted-foreground">how 10every works</h2>
                
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center helvetica-oblique text-sm" style={{ backgroundColor: '#B7C9E5', color: '#000000' }}>
                        1
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-base tracking-wide text-muted-foreground">submit</h3>
                      <p className="text-sm tracking-wide text-muted-foreground leading-relaxed">
                        share your spotify track link with us.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center helvetica-oblique text-sm" style={{ backgroundColor: '#B7C9E5', color: '#000000' }}>
                        2
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-base tracking-wide text-muted-foreground">selection</h3>
                      <p className="text-sm tracking-wide text-muted-foreground leading-relaxed">
                        first <span className="helvetica-oblique">10</span> tracks submitted daily get featured.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center helvetica-oblique text-sm" style={{ backgroundColor: '#B7C9E5', color: '#000000' }}>
                        3
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-base tracking-wide text-muted-foreground">anonymous release</h3>
                      <p className="text-sm tracking-wide text-muted-foreground leading-relaxed">
                        tracks appear without artist names at <span className="helvetica-oblique">10am</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center helvetica-oblique text-sm" style={{ backgroundColor: '#B7C9E5', color: '#000000' }}>
                        4
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-base tracking-wide text-muted-foreground">discovery</h3>
                      <p className="text-sm tracking-wide text-muted-foreground leading-relaxed">
                        listeners must hear <span className="helvetica-oblique">10%</span> before revealing artist.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}