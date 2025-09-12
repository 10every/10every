import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Sparkles } from 'lucide-react';

interface RevealAnimationProps {
  isRevealed: boolean;
  trackTitle?: string;
  trackArtist?: string;
  onComplete?: () => void;
}

export function RevealAnimation({ isRevealed, trackTitle, trackArtist, onComplete }: RevealAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isRevealed) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, onComplete]);

  if (!showAnimation) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            duration: 0.6,
            delay: 0.2 
          }}
          className="relative"
        >
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Eye className="w-12 h-12 text-primary" />
          </div>
          
          {/* Sparkle effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                delay: 0.5 + i * 0.1,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="absolute"
              style={{
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
              }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-2"
        >
          <h2 className="text-xl font-medium text-primary">Track Revealed!</h2>
          {trackTitle && trackArtist && (
            <div className="space-y-1">
              <p className="text-lg font-medium">{trackTitle}</p>
              <p className="text-muted-foreground">{trackArtist}</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm text-muted-foreground"
        >
          You've listened to 10% of this track
        </motion.div>
      </div>
    </motion.div>
  );
}