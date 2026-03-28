import { useState } from 'react';
import { yakuList, doraList } from '../logic/yakuList';
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

  const excluded = getExcludedYaku(handType, selection);

  const visibleYaku = yakuList.filter((yaku) => {
    if (yaku.condition === 'menzen' && !isMenzen) return false;
    if (yaku.condition === 'riichi' && !isRiichi) return false;
    if (!isMenzen && yaku.kuisagari === 0) return false;
    if (excluded.has(yaku.id)) return false;
    return true;
  });

  const visibleDora = doraList.filter((d) => {
    if (d.condition === 'riichi' && !isRiichi) return false;
    return true;
  });

  return (
    <>
      <h2 className="text-xl font-bold text-center mb-5">あてはまる役をタップ</h2>

      {/* 役 */}
      <div className="mb-5">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">役</h3>
        <div className="flex flex-col gap-2">
          {visibleYaku.map((yaku) => {
            const value = selection[yaku.id] ?? 0;
            const han = isMenzen ? yaku.han : yaku.kuisagari;

            if (yaku.type === 'counter') {
              return (
                <div key={yaku.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
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
                </div>
              );
            }

            return (
              <button
                key={yaku.id}
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
              </button>
            );
          })}
        </div>
      </div>

      {/* ドラ */}
      <div className="mb-5">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">ドラ</h3>
        <div className="flex flex-col gap-2">
          {visibleDora.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <span className="font-bold text-sm">{d.name}</span>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="counter" onClick={() => setCount(d.id, -1, d.maxCount)}>-</Button>
                <span className="w-5 text-center font-bold text-sm">{selection[d.id] ?? 0}</span>
                <Button variant="outline" size="counter" onClick={() => setCount(d.id, 1, d.maxCount)}>+</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={() => onSubmit(selection)}>計算する</Button>
    </>
  );
}
