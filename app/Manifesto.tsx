import { X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Logo } from './components/Logo';
interface ManifestoProps {
  onClose: () => void;
}

export function Manifesto({ onClose }: ManifestoProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <Logo className="h-24 sm:h-28 md:h-32 lg:h-36 w-auto" />
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

        {/* Manifesto Content */}
        <div className="space-y-8 leading-relaxed">
          <div className="space-y-6">
            <p className="text-lg">
              Algorithms have become the most destructive force in modern music. Gatekeeping has always existed, but now virality and paid streams dominate discovery, leaving emerging artists invisible. The result is an overcrowded, manipulated ecosystem where the best work rarely surfaces.
            </p>

            <p className="text-lg">
              <span className="helvetica-oblique">10</span>every is a new way to share and discover music that's fair, random, and human-first. Every day at <span className="helvetica-oblique">10</span>am, the first ten tracks submitted are released anonymously. No algorithms, no favoritism — just music, stripped of hype and bias.
            </p>
          </div>

          <div className="border-l-2 border-primary/20 pl-8 space-y-6">
            <div className="space-y-3">
              <h3 className="font-medium tracking-wide">Submission</h3>
              <p>Artists text us their Spotify link (ensuring streams credit them directly).</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium tracking-wide">Presentation</h3>
              <p>Tracks appear as anonymous tiles.</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium tracking-wide">Engagement</h3>
              <p>Listeners must hear at least <span className="helvetica-oblique">10%</span> before rating or revealing the artist.</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium tracking-wide">Fairness</h3>
              <p>Everyone gets the same chance, every day.</p>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <p className="text-lg">
              <span className="helvetica-oblique">10</span>every removes algorithmic control and creates a more equitable landscape where discovery is random, authentic, and artist-driven. It's a platform built to give unheard voices their moment — and to restore the thrill of finding music outside the noise.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <Button
            onClick={onClose}
            variant="outline"
            className="tracking-wide"
          >
            Return to Today's Algorithm
          </Button>
        </div>
      </div>
    </div>
  );
}