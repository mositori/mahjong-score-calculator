import { useState } from 'react';
import { yakuList, doraList } from '../logic/yakuList';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type Props = {
  isMenzen: boolean;
  onSubmit: (selection: Record<string, number>) => void;
};

export function StepYakuSelect({ isMenzen, onSubmit }: Props) {
  const [selection, setSelection] = useState<Record<string, number>>({});

  const isRiichi = (selection['riichi'] ?? 0) > 0;

  const toggle = (id: string) => {
    setSelection((prev) => ({ ...prev, [id]: prev[id] ? 0 : 1 }));
  };

  const setCount = (id: string, delta: number, max: number) => {
    setSelection((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(max, (prev[id] ?? 0) + delta)),
    }));
  };

  const visibleYaku = yakuList.filter((yaku) => {
    if (yaku.condition === 'menzen' && !isMenzen) return false;
    if (yaku.condition === 'riichi' && !isRiichi) return false;
    if (!isMenzen && yaku.kuisagari === 0) return false;
    return true;
  });

  const visibleDora = doraList.filter((d) => {
    if (d.condition === 'riichi' && !isRiichi) return false;
    return true;
  });

  return (
    <div className="step-animate">
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
    </div>
  );
}
