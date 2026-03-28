import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { yakuList, doraList, DRAGON_YAKUHAI_IDS } from '../logic/yakuList';
import { getExcludedYaku, getConflictingYaku } from '../logic/yakuExclusions';
import type { HandType } from '../types';
import { Button } from './ui/button';
import { TileDisplay } from './TileDisplay';
import { cn } from '@/lib/utils';

type Props = {
  isMenzen: boolean;
  handType: HandType | null;
  onSubmit: (selection: Record<string, number>) => void;
};

export function StepYakuSelect({ isMenzen, handType, onSubmit }: Props) {
  const [selection, setSelection] = useState<Record<string, number>>({});

  const isRiichi = (selection['riichi'] ?? 0) > 0 || (selection['double_riichi'] ?? 0) > 0;

  const toggle = (id: string) => {
    setSelection((prev) => {
      const newValue = prev[id] ? 0 : 1;
      const next = { ...prev, [id]: newValue };
      if (newValue > 0) {
        for (const conflict of getConflictingYaku(id)) {
          next[conflict] = 0;
        }
      }
      return next;
    });
  };

  const setCount = (id: string, delta: number, max: number) => {
    setSelection((prev) => {
      const newValue = Math.max(0, Math.min(max, (prev[id] ?? 0) + delta));
      const next = { ...prev, [id]: newValue };
      if (newValue > 0) {
        for (const conflict of getConflictingYaku(id)) {
          next[conflict] = 0;
        }
      }
      return next;
    });
  };

  const shouldReduceMotion = useReducedMotion();
  const itemAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
      };

  const excluded = getExcludedYaku(handType, selection);

  // 小三元選択中は三元牌の役牌を常に表示
  const isShousangenSelected = (selection['shousangen'] ?? 0) > 0;

  const visibleYaku = yakuList.filter((yaku) => {
    if (yaku.condition === 'menzen' && !isMenzen) return false;
    if (yaku.condition === 'riichi' && !isRiichi) return false;
    if (!isMenzen && yaku.kuisagari === 0) return false;
    if (excluded.has(yaku.id)) {
      // 小三元選択中は三元牌の役牌を除外しない
      if (isShousangenSelected && (DRAGON_YAKUHAI_IDS as readonly string[]).includes(yaku.id)) {
        return true;
      }
      return false;
    }
    return true;
  });

  const visibleDora = doraList.filter((d) => {
    if (d.condition === 'riichi' && !isRiichi) return false;
    return true;
  });

  // 役牌グループとそれ以外を分離
  const yakuhaiYaku = visibleYaku.filter((y) => y.group === 'yakuhai');
  const otherYaku = visibleYaku.filter((y) => y.group !== 'yakuhai');

  // 小三元�ント表示判定
  const selectedDragonCount = DRAGON_YAKUHAI_IDS.filter(id => (selection[id] ?? 0) > 0).length;
  const showDragonHint = isShousangenSelected && selectedDragonCount < 2;

  return (
    <>
      <h2 className="text-xl font-bold text-center mb-5">あてはまる役をタップ</h2>

      {/* 役牌グループ */}
      {yakuhaiYaku.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">役牌</h3>
          <div className="rounded-lg border bg-card p-3">
            {showDragonHint && (
              <div className="mb-3 p-2 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200">
                小三元を選択中 — 三元牌の役牌を2つ選択してください
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 mb-2">
              {yakuhaiYaku.filter(y => (DRAGON_YAKUHAI_IDS as readonly string[]).includes(y.id)).map((yaku) => {
                const value = selection[yaku.id] ?? 0;
                const han = isMenzen ? yaku.han : yaku.kuisagari;
                return (
                  <motion.button
                    key={yaku.id}
                    layout={!shouldReduceMotion}
                    {...itemAnimation}
                    className={cn(
                      "text-center p-2 rounded-lg border-2 transition-colors",
                      value ? "border-primary bg-primary/10" : "border-border hover:border-primary/30",
                      isShousangenSelected && !value && "ring-1 ring-amber-300 dark:ring-amber-700"
                    )}
                    onClick={() => toggle(yaku.id)}
                  >
                    <span className={cn("font-bold text-sm", value && "text-primary")}>{yaku.name}</span>
                    <span className="text-xs text-muted-foreground ml-1">+{han}翻</span>
                  </motion.button>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {yakuhaiYaku.filter(y => !(DRAGON_YAKUHAI_IDS as readonly string[]).includes(y.id)).map((yaku) => {
                const value = selection[yaku.id] ?? 0;
                const han = isMenzen ? yaku.han : yaku.kuisagari;
                return (
                  <motion.button
                    key={yaku.id}
                    layout={!shouldReduceMotion}
                    {...itemAnimation}
                    className={cn(
                      "text-center p-2 rounded-lg border-2 transition-colors",
                      value ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
                    )}
                    onClick={() => toggle(yaku.id)}
                  >
                    <span className={cn("font-bold text-sm", value && "text-primary")}>{yaku.name}</span>
                    <span className="text-xs text-muted-foreground ml-1">+{han}翻</span>
                  </motion.button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">※ 場風と自風が同じ場合（東場の東家など）は両方選択</p>
          </div>
        </div>
      )}

      {/* 役 */}
      <div className="mb-5">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">役</h3>
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false} mode="popLayout">
            {otherYaku.map((yaku) => {
              const value = selection[yaku.id] ?? 0;
              const han = isMenzen ? yaku.han : yaku.kuisagari;

              if (yaku.type === 'counter') {
                return (
                  <motion.div
                    key={yaku.id}
                    layout={!shouldReduceMotion}
                    {...itemAnimation}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{yaku.name}</span>
                        <span className="text-xs font-bold text-primary">+{han}翻</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{yaku.description}</span>
                      {yaku.example && <TileDisplay example={yaku.example} />}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Button variant="outline" size="counter" onClick={() => setCount(yaku.id, -1, yaku.maxCount ?? 4)}>-</Button>
                      <span className="w-5 text-center font-bold text-sm">{value}</span>
                      <Button variant="outline" size="counter" onClick={() => setCount(yaku.id, 1, yaku.maxCount ?? 4)}>+</Button>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.button
                  key={yaku.id}
                  layout={!shouldReduceMotion}
                  {...itemAnimation}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border-2 transition-colors",
                    value ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30"
                  )}
                  onClick={() => toggle(yaku.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("font-bold text-sm", value && "text-primary")}>{yaku.name}</span>
                    <span className="text-xs font-bold text-primary">+{han}翻</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{yaku.description}</span>
                  {yaku.example && <TileDisplay example={yaku.example} />}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ドラ */}
      <div className="mb-5">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">ドラ</h3>
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleDora.map((d) => (
              <motion.div
                key={d.id}
                layout={!shouldReduceMotion}
                {...itemAnimation}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <span className="font-bold text-sm">{d.name}</span>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="counter" onClick={() => setCount(d.id, -1, d.maxCount)}>-</Button>
                  <span className="w-5 text-center font-bold text-sm">{selection[d.id] ?? 0}</span>
                  <Button variant="outline" size="counter" onClick={() => setCount(d.id, 1, d.maxCount)}>+</Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={() => onSubmit(selection)}>計算する</Button>
    </>
  );
}
