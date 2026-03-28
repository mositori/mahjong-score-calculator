import { motion, useReducedMotion } from 'motion/react';
import { Button } from './ui/button';

type Props = {
  honba: number;
  onHonbaChange: (honba: number) => void;
  onSelect: (isDealer: boolean) => void;
};

export function StepDealer({ honba, onHonbaChange, onSelect }: Props) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <>
      <motion.h2
        className="text-xl font-bold text-center mb-6"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        親ですか？子ですか？
      </motion.h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: '親', value: true },
          { label: '子', value: false },
        ].map((opt, i) => (
          <motion.div
            key={opt.label}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, delay: 0.08 + i * 0.06, ease: [0.25, 0.1, 0.25, 1] as const }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          >
            <Button variant="outline" className="w-full h-16 text-xl font-bold" onClick={() => onSelect(opt.value)}>
              {opt.label}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <span className="text-sm text-muted-foreground">本場</span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 text-lg"
          disabled={honba === 0}
          onClick={() => onHonbaChange(honba - 1)}
        >
          −
        </Button>
        <span className="text-lg font-bold tabular-nums w-6 text-center">{honba}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 text-lg"
          onClick={() => onHonbaChange(honba + 1)}
        >
          +
        </Button>
      </div>
    </>
  );
}
