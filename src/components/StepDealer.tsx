import { motion, useReducedMotion } from 'motion/react';
import { Button } from './ui/button';

type Props = {
  onSelect: (isDealer: boolean) => void;
};

export function StepDealer({ onSelect }: Props) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="flex-1 flex flex-col justify-center pb-[20svh]">
      <motion.h2
        className="text-xl font-bold text-center mb-6"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
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
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30, delay: 0.08 + i * 0.06 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          >
            <Button variant="outline" className="w-full h-16 text-xl font-bold" onClick={() => onSelect(opt.value)}>
              {opt.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
