import { motion } from 'motion/react';
import type { State } from '../types';

type Props = {
  state: State;
};

const handTypeLabels: Record<string, string> = {
  yakuman: '役満',
  chiitoitsu: '七対子',
  pinfu: 'ピンフ',
  other: 'その他',
};

export function SelectionSummary({ state }: Props) {
  const items: string[] = [];

  if (state.isDealer !== null) {
    items.push(state.isDealer ? '親' : '子');
  }
  if (state.isTsumo !== null) {
    items.push(state.isTsumo ? 'ツモ' : 'ロン');
  }
  if (state.handType !== null) {
    items.push(handTypeLabels[state.handType]);
  }
  if (state.handType === 'other' && state.step !== 'menzen' && state.stepHistory.includes('menzen')) {
    items.push(state.isMenzen ? '門前' : '副露');
  }
  if (state.honba > 0) {
    items.push(`${state.honba}本場`);
  }

  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 flex-wrap">
      {items.map((item, i) => (
        <motion.span
          key={`${item}-${i}`}
          className="flex items-center gap-1.5"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.03 }}
        >
          {i > 0 && <span className="text-muted-foreground/50">›</span>}
          <span>{item}</span>
        </motion.span>
      ))}
    </div>
  );
}
