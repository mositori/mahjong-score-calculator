import { motion, useReducedMotion } from 'motion/react';
import type { Step, HandType } from '../types';

type Props = {
  step: Step;
  handType: HandType | null;
};

const paths: Record<string, Step[]> = {
  yakuman: ['dealer', 'winType', 'handType', 'result'],
  chiitoitsu: ['dealer', 'winType', 'handType', 'yakuSelect', 'result'],
  pinfu: ['dealer', 'winType', 'handType', 'yakuSelect', 'result'],
  other: ['dealer', 'winType', 'handType', 'menzen', 'fuInput', 'yakuSelect', 'result'],
};

function getProgress(step: Step, handType: HandType | null): number {
  const path = handType ? paths[handType] : paths.other;
  const index = path.indexOf(step);
  if (index === -1) return 0;
  return index / (path.length - 1);
}

export function ProgressBar({ step, handType }: Props) {
  const progress = getProgress(step, handType);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="h-1 bg-muted rounded-full mb-4 overflow-hidden">
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={false}
        animate={{ width: `${progress * 100}%` }}
        transition={shouldReduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 300, damping: 30 }
        }
      />
    </div>
  );
}
