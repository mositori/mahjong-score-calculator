import { motion, useReducedMotion } from 'motion/react';
import type { HandType } from '../types';
import { Button } from './ui/button';

type Props = {
  onSelect: (handType: HandType) => void;
};

const options: { label: string; description: string; value: HandType }[] = [
  { label: '役満', description: '国士無双・四暗刻など', value: 'yakuman' },
  { label: '七対子', description: '7つの対子（トイツ）', value: 'chiitoitsu' },
  { label: 'ピンフ', description: '順子のみ・両面待ち・役牌以外の雀頭', value: 'pinfu' },
  { label: 'その他', description: '上記以外の手', value: 'other' },
];

export function StepHandType({ onSelect }: Props) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="flex-1 flex flex-col justify-center pb-[10svh]">
      <motion.h2
        className="text-xl font-bold text-center mb-5"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        手の形は？
      </motion.h2>
      <div className="flex flex-col gap-3">
        {options.map((opt, i) => (
          <motion.div
            key={opt.value}
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.05 + i * 0.05, ease: [0.25, 0.1, 0.25, 1] as const }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start text-left h-auto py-4 px-5"
              onClick={() => onSelect(opt.value)}
            >
              <div>
                <div className="text-base font-bold">{opt.label}</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">{opt.description}</div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
