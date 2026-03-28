import { useState } from 'react';
import { yakuList, doraList } from '../logic/yakuList';

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
    setSelection((prev) => {
      const next = Math.max(0, Math.min(max, (prev[id] ?? 0) + delta));
      return { ...prev, [id]: next };
    });
  };

  const visibleYaku = yakuList.filter((yaku) => {
    if (yaku.condition === 'menzen' && !isMenzen) return false;
    if (yaku.condition === 'riichi' && !isRiichi) return false;
    // 鳴きで食い下がり0の役は表示しない
    if (!isMenzen && yaku.kuisagari === 0) return false;
    return true;
  });

  const visibleDora = doraList.filter((d) => {
    if (d.condition === 'riichi' && !isRiichi) return false;
    return true;
  });

  return (
    <div className="step">
      <h2 className="step-question">あてはまる役をタップ</h2>

      <div className="yaku-section">
        <h3 className="yaku-section-title">役</h3>
        <div className="yaku-list">
          {visibleYaku.map((yaku) => {
            const value = selection[yaku.id] ?? 0;
            const han = isMenzen ? yaku.han : yaku.kuisagari;

            if (yaku.type === 'counter') {
              return (
                <div key={yaku.id} className="yaku-counter-row">
                  <div className="yaku-info">
                    <span className="yaku-name">{yaku.name}</span>
                    <span className="yaku-han">+{han}翻</span>
                  </div>
                  <span className="yaku-desc">{yaku.description}</span>
                  <div className="counter-controls">
                    <button className="counter-btn" onClick={() => setCount(yaku.id, -1, yaku.maxCount ?? 4)}>-</button>
                    <span className="counter-value">{value}</span>
                    <button className="counter-btn" onClick={() => setCount(yaku.id, 1, yaku.maxCount ?? 4)}>+</button>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={yaku.id}
                className={`yaku-toggle ${value ? 'active' : ''}`}
                onClick={() => toggle(yaku.id)}
              >
                <div className="yaku-info">
                  <span className="yaku-name">{yaku.name}</span>
                  <span className="yaku-han">+{han}翻</span>
                </div>
                <span className="yaku-desc">{yaku.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="yaku-section">
        <h3 className="yaku-section-title">ドラ</h3>
        <div className="dora-list">
          {visibleDora.map((d) => (
            <div key={d.id} className="yaku-counter-row">
              <span className="yaku-name">{d.name}</span>
              <div className="counter-controls">
                <button className="counter-btn" onClick={() => setCount(d.id, -1, d.maxCount)}>-</button>
                <span className="counter-value">{selection[d.id] ?? 0}</span>
                <button className="counter-btn" onClick={() => setCount(d.id, 1, d.maxCount)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="submit-btn" onClick={() => onSubmit(selection)}>計算する</button>
    </div>
  );
}
