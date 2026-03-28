import { Fragment, useState } from 'react';
import type { FuInputData } from '../types';
import { Button } from './ui/button';

type Props = {
  onSubmit: (data: FuInputData) => void;
};

type MentsuType = { id: string; fu: number };

type MentsuRow = {
  rowLabel: string;
  chun: MentsuType;
  yao: MentsuType;
};

const koutsuRows: MentsuRow[] = [
  { rowLabel: 'ポン（明）', chun: { id: 'minko_chun', fu: 2 }, yao: { id: 'minko_yao', fu: 4 } },
  { rowLabel: '自力（暗）', chun: { id: 'anko_chun', fu: 4 }, yao: { id: 'anko_yao', fu: 8 } },
];

const kantsuRows: MentsuRow[] = [
  { rowLabel: '大明槓・加槓', chun: { id: 'minkan_chun', fu: 8 }, yao: { id: 'minkan_yao', fu: 16 } },
  { rowLabel: '暗槓', chun: { id: 'ankan_chun', fu: 16 }, yao: { id: 'ankan_yao', fu: 32 } },
];

const allMentsu = [...koutsuRows, ...kantsuRows].flatMap((r) => [r.chun, r.yao]);

function HelpToggle({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs shrink-0"
        onClick={() => setOpen(!open)}
        aria-label="ヘルプ"
      >
        ?
      </button>
      {open && (
        <p className="text-xs text-muted-foreground mt-1.5 p-2.5 bg-muted/50 rounded-md leading-relaxed">
          {text}
        </p>
      )}
    </>
  );
}

function CellCounter({ fu, value, onChange, disableIncrement }: {
  fu: number; value: number; onChange: (v: number) => void; disableIncrement: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-2 px-1">
      <span className="text-xs text-muted-foreground">+{fu}符</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="counter" onClick={() => onChange(Math.max(0, value - 1))} disabled={value === 0}>-</Button>
        <span className="w-5 text-center font-bold text-sm">{value}</span>
        <Button variant="outline" size="counter" onClick={() => onChange(Math.min(4, value + 1))} disabled={disableIncrement}>+</Button>
      </div>
    </div>
  );
}

function MentsuGrid({ rows, counts, onChange, disableIncrement }: {
  rows: MentsuRow[];
  counts: Record<string, number>;
  onChange: (id: string, v: number) => void;
  disableIncrement: boolean;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_1fr] border rounded-lg overflow-hidden bg-card">
      {/* Column headers */}
      <div className="bg-muted/50 border-b" />
      <div className="text-xs font-semibold text-center py-2 px-1 bg-muted/50 border-b border-l">中張牌（2〜8）</div>
      <div className="text-xs font-semibold text-center py-2 px-1 bg-muted/50 border-b border-l">么九牌（1,9,字）</div>
      {/* Rows */}
      {rows.map((row, i) => (
        <Fragment key={row.rowLabel}>
          <div className={`flex items-center px-3 text-xs font-semibold whitespace-nowrap ${i > 0 ? 'border-t' : ''}`}>
            {row.rowLabel}
          </div>
          <div className={`flex justify-center border-l ${i > 0 ? 'border-t' : ''}`}>
            <CellCounter
              fu={row.chun.fu}
              value={counts[row.chun.id] ?? 0}
              onChange={(v) => onChange(row.chun.id, v)}
              disableIncrement={disableIncrement && (counts[row.chun.id] ?? 0) === 0}
            />
          </div>
          <div className={`flex justify-center border-l ${i > 0 ? 'border-t' : ''}`}>
            <CellCounter
              fu={row.yao.fu}
              value={counts[row.yao.id] ?? 0}
              onChange={(v) => onChange(row.yao.id, v)}
              disableIncrement={disableIncrement && (counts[row.yao.id] ?? 0) === 0}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export function StepFuInput({ onSubmit }: Props) {
  const [waitType, setWaitType] = useState<'open' | 'closed'>('open');
  const [isYakuhaiHead, setIsYakuhaiHead] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [showKan, setShowKan] = useState(false);

  const mentsuFu = allMentsu.reduce(
    (sum, m) => sum + m.fu * (counts[m.id] ?? 0), 0,
  );

  const totalMentsuCount = allMentsu.reduce(
    (sum, m) => sum + (counts[m.id] ?? 0), 0,
  );

  const maxReached = totalMentsuCount >= 4;

  const handleCountChange = (id: string, v: number) => {
    const current = counts[id] ?? 0;
    const diff = v - current;
    if (diff > 0 && totalMentsuCount + diff > 4) return;
    setCounts({ ...counts, [id]: v });
  };

  return (
    <>
      <h2 className="text-xl font-bold text-center mb-5">符の計算</h2>

      {/* 待ちの形 */}
      <div className="mb-5 pb-4 border-b">
        <div className="flex items-center mb-1">
          <h3 className="text-sm font-bold">待ちの形</h3>
          <HelpToggle text="最後のアガリ牌の受け入れが2種類以上なら「両面・シャンポン」です。例: 2-3で1と4待ちは両面。1-3で2だけ待ちは嵌張、1-2で3だけ待ちは辺張、1枚だけ待ちは単騎です。" />
        </div>
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
        <div className="flex items-center mb-1">
          <h3 className="text-sm font-bold">雀頭（頭）</h3>
          <HelpToggle text="頭が三元牌（白・發・中）、場風牌（東場なら東）、または自風牌（自分の風）の場合は「役牌」を選んでください。連風牌（例: 東場の東家の東）も「役牌」です。" />
        </div>
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
        <div className="flex items-center mb-2">
          <h3 className="text-sm font-bold">刻子・槓子</h3>
          <HelpToggle text="同じ牌3枚の組み合わせが刻子です。自分で揃えたら「暗刻」、ポンしたら「明刻」。1・9・字牌の刻子は中張牌（2〜8）より符が高くなります。槓子（4枚）はさらに高い符がつきます。" />
        </div>
        <Button
          variant="secondary"
          className="w-full mb-3 text-sm"
          onClick={() => onSubmit({ waitType, isYakuhaiHead, mentsuFu: 0 })}
        >
          刻子なし（順子のみ）→ 次へ
        </Button>

        <h4 className="text-xs font-semibold text-muted-foreground mb-1">刻子</h4>
        <MentsuGrid
          rows={koutsuRows}
          counts={counts}
          onChange={handleCountChange}
          disableIncrement={maxReached}
        />

        {!showKan ? (
          <button
            className="w-full mt-3 py-2 text-xs text-muted-foreground border border-dashed rounded-lg"
            onClick={() => setShowKan(true)}
          >
            槓子がある
          </button>
        ) : (
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-muted-foreground mb-1">槓子</h4>
            <MentsuGrid
              rows={kantsuRows}
              counts={counts}
              onChange={handleCountChange}
              disableIncrement={maxReached}
            />
          </div>
        )}

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">面子: {totalMentsuCount}/4</span>
          {mentsuFu > 0 && (
            <span className="text-sm font-bold text-primary">
              刻子・槓子の符: +{mentsuFu}
            </span>
          )}
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={() => onSubmit({ waitType, isYakuhaiHead, mentsuFu })}>
        次へ
      </Button>
    </>
  );
}
