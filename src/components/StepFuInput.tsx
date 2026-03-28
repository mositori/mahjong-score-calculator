import { useState } from 'react';
import type { FuInputData } from '../types';
import { Button } from './ui/button';

type Props = {
  onSubmit: (data: FuInputData) => void;
};

type MentsuType = { id: string; label: string; fu: number };

const basicMentsu: MentsuType[] = [
  { id: 'minko_chun', label: '明刻（2〜8）', fu: 2 },
  { id: 'minko_yao', label: '明刻（1,9,字）', fu: 4 },
  { id: 'anko_chun', label: '暗刻（2〜8）', fu: 4 },
  { id: 'anko_yao', label: '暗刻（1,9,字）', fu: 8 },
];

const kanMentsu: MentsuType[] = [
  { id: 'minkan_chun', label: '明槓（2〜8）', fu: 8 },
  { id: 'minkan_yao', label: '明槓（1,9,字）', fu: 16 },
  { id: 'ankan_chun', label: '暗槓（2〜8）', fu: 16 },
  { id: 'ankan_yao', label: '暗槓（1,9,字）', fu: 32 },
];

function Counter({ label, fuLabel, value, onChange }: {
  label: string; fuLabel: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-card rounded-lg border">
      <div className="text-sm">
        {label} <span className="text-muted-foreground text-xs">+{fuLabel}符</span>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="counter" onClick={() => onChange(Math.max(0, value - 1))}>-</Button>
        <span className="w-5 text-center font-bold">{value}</span>
        <Button variant="outline" size="counter" onClick={() => onChange(Math.min(4, value + 1))}>+</Button>
      </div>
    </div>
  );
}

export function StepFuInput({ onSubmit }: Props) {
  const [waitType, setWaitType] = useState<'open' | 'closed'>('open');
  const [isYakuhaiHead, setIsYakuhaiHead] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [showKan, setShowKan] = useState(false);

  const mentsuFu = [...basicMentsu, ...kanMentsu].reduce(
    (sum, m) => sum + m.fu * (counts[m.id] ?? 0), 0,
  );

  return (
    <div className="step-animate">
      <h2 className="text-xl font-bold text-center mb-5">符の計算</h2>

      {/* 待ちの形 */}
      <div className="mb-5 pb-4 border-b">
        <h3 className="text-sm font-bold mb-1">待ちの形</h3>
        <p className="text-xs text-muted-foreground mb-2">待ち牌が2種以上なら両面系</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={waitType === 'open' ? 'selected' : 'unselected'}
            size="sm"
            className="text-xs"
            onClick={() => setWaitType('open')}
          >
            両面・シャンポン
          </Button>
          <Button
            variant={waitType === 'closed' ? 'selected' : 'unselected'}
            size="sm"
            className="text-xs"
            onClick={() => setWaitType('closed')}
          >
            嵌張・辺張・単騎
          </Button>
        </div>
      </div>

      {/* 雀頭 */}
      <div className="mb-5 pb-4 border-b">
        <h3 className="text-sm font-bold mb-1">雀頭（頭）</h3>
        <p className="text-xs text-muted-foreground mb-2">白・發・中・場風牌・自風牌</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={!isYakuhaiHead ? 'selected' : 'unselected'}
            size="sm"
            className="text-xs"
            onClick={() => setIsYakuhaiHead(false)}
          >
            役牌以外
          </Button>
          <Button
            variant={isYakuhaiHead ? 'selected' : 'unselected'}
            size="sm"
            className="text-xs"
            onClick={() => setIsYakuhaiHead(true)}
          >
            役牌
          </Button>
        </div>
      </div>

      {/* 刻子・槓子 */}
      <div className="mb-5">
        <h3 className="text-sm font-bold mb-2">刻子・槓子</h3>
        <Button
          variant="secondary"
          className="w-full mb-3 text-sm"
          onClick={() => onSubmit({ waitType, isYakuhaiHead, mentsuFu: 0 })}
        >
          刻子なし（順子のみ）→ 次へ
        </Button>

        <div className="flex flex-col gap-2">
          {basicMentsu.map((m) => (
            <Counter
              key={m.id}
              label={m.label}
              fuLabel={String(m.fu)}
              value={counts[m.id] ?? 0}
              onChange={(v) => setCounts({ ...counts, [m.id]: v })}
            />
          ))}
        </div>

        {!showKan ? (
          <button
            className="w-full mt-2 py-2 text-xs text-muted-foreground border border-dashed rounded-lg"
            onClick={() => setShowKan(true)}
          >
            槓子がある
          </button>
        ) : (
          <div className="flex flex-col gap-2 mt-2">
            {kanMentsu.map((m) => (
              <Counter
                key={m.id}
                label={m.label}
                fuLabel={String(m.fu)}
                value={counts[m.id] ?? 0}
                onChange={(v) => setCounts({ ...counts, [m.id]: v })}
              />
            ))}
          </div>
        )}

        {mentsuFu > 0 && (
          <div className="mt-2 text-sm font-bold text-primary text-right">
            刻子・槓子の符: +{mentsuFu}
          </div>
        )}
      </div>

      <Button className="w-full" size="lg" onClick={() => onSubmit({ waitType, isYakuhaiHead, mentsuFu })}>
        次へ
      </Button>
    </div>
  );
}
