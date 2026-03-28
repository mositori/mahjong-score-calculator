import { motion, useReducedMotion } from 'motion/react';
import { Button } from './ui/button';

type Props = {
  honba: number;
  onHonbaChange: (honba: number) => void;
  onSelect: (isTsumo: boolean) => void;
};

export function StepWinType({ honba, onHonbaChange, onSelect }: Props) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <>
      <motion.h2
        className="text-xl font-bold text-center mb-6"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        ツモですか？ロンですか？
      </motion.h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'ツモ', value: true },
          { label: 'ロン', value: false },
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

      <div className="mt-6">
        <p className="text-sm text-center mb-3 text-muted-foreground">親は何連荘目ですか？</p>
        <div className="flex items-center justify-center gap-3">
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
      </div>
    </>
  );
}
