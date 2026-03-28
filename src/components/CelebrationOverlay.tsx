import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';
import celebrationImg from '@/assets/celebration.jpg';

type Props = {
  show: boolean;
};

export function CelebrationOverlay({ show }: Props) {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [show]);

  const handleLanded = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4'],
      disableForReducedMotion: true,
      zIndex: 9999,
    });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setVisible(false)}
          />

          {/* Image container */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto cursor-pointer"
              onClick={() => setVisible(false)}
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { y: '-100vh', rotate: -15, opacity: 0 }
              }
              animate={
                prefersReduced
                  ? { opacity: 1 }
                  : { y: 0, rotate: 0, opacity: 1 }
              }
              exit={{ opacity: 0, scale: 0.8 }}
              transition={
                prefersReduced
                  ? { duration: 0.3 }
                  : { type: 'spring', damping: 10, stiffness: 100 }
              }
              onAnimationComplete={() => {
                if (!prefersReduced) handleLanded();
              }}
            >
              <motion.img
                src={celebrationImg}
                alt="Celebration!"
                className="max-w-[280px] w-[70vw] rounded-xl shadow-2xl"
                animate={
                  prefersReduced
                    ? {}
                    : { y: [0, -8, 0] }
                }
                transition={
                  prefersReduced
                    ? {}
                    : {
                        repeat: Infinity,
                        duration: 2,
                        ease: 'easeInOut',
                        delay: 0.5,
                      }
                }
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
