import { X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Logo } from './components/Logo';
interface ManifestoProps {
  onClose: () => void;
}

export function Manifesto({ onClose }: ManifestoProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="container mx-auto px-6 py-6 max-w-4xl flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Logo className="h-16 sm:h-20 md:h-24 w-auto" />
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
        <div className="flex-1 space-y-4 leading-relaxed">
          <div className="space-y-3">
            <p className="text-base">
              Algorithms have become the most destructive force in modern music. Gatekeeping has always existed, but now virality and paid streams dominate discovery, leaving emerging artists invisible. The result is an overcrowded, manipulated ecosystem where the best work rarely surfaces.
            </p>

            <p className="text-base">
              <span className="helvetica-oblique">10</span>every is a new way to share and discover music that's fair, random, and human-first. Every day at <span className="helvetica-oblique">10</span>am, the first ten tracks submitted are released anonymously. No algorithms, no favoritism — just music, stripped of hype and bias.
            </p>
          </div>

          <div className="border-l-2 border-primary/20 pl-6 space-y-3">
            <div className="space-y-1">
              <h3 className="font-medium tracking-wide text-sm">Submission</h3>
              <p className="text-sm">Artists text us their Spotify link (ensuring streams credit them directly).</p>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium tracking-wide text-sm">Presentation</h3>
              <p className="text-sm">Tracks appear as anonymous tiles.</p>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium tracking-wide text-sm">Engagement</h3>
              <p className="text-sm">Listeners must hear at least <span className="helvetica-oblique">10%</span> before rating or revealing the artist.</p>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium tracking-wide text-sm">Fairness</h3>
              <p className="text-sm">Everyone gets the same chance, every day.</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-base">
              <span className="helvetica-oblique">10</span>every removes algorithmic control and creates a more equitable landscape where discovery is random, authentic, and artist-driven. It's a platform built to give unheard voices their moment — and to restore the thrill of finding music outside the noise.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border text-center">
          <Button
            onClick={onClose}
            variant="outline"
            className="tracking-wide text-sm"
          >
            Return to Today's Algorithm
          </Button>
        </div>
      </div>
    </div>
  );
}