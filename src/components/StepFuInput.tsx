import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { FuInputData } from '../types';
import { Button } from './ui/button';

type Props = {
  onSubmit: (data: FuInputData) => void;
};

type MentsuEntry = {
  count: 3 | 4;        // 刻子 or 槓子
  isConcealed: boolean; // 暗 or 明
  isTerminal: boolean;  // 么九牌 or 中張牌
};

function getFu(entry: MentsuEntry): number {
  // base: 明刻 中張 = 2
  let fu = 2;
  if (entry.isConcealed) fu *= 2;   // 暗 → ×2
  if (entry.isTerminal) fu *= 2;    // 么九 → ×2
  if (entry.count === 4) fu *= 4;   // 槓子 → ×4
  return fu;
}

function getMentsuLabel(entry: MentsuEntry): string {
  const type = entry.count === 4
    ? (entry.isConcealed ? '暗槓' : '明槓')
    : (entry.isConcealed ? '暗刻' : '明刻');
  const tile = entry.isTerminal ? '么九牌' : '中張牌';
  return `${type}（${tile}）`;
}

type WizardPhase =
  | 'ask-has-mentsu'
  | 'ask-count'
  | 'ask-concealed'
  | 'ask-terminal'
  | 'list';

type JantouChoice = 'sangenpai' | 'kazehai' | 'other';

function HelpToggle({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  return (
    <>
      <button
        className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs shrink-0"
        onClick={() => setOpen(!open)}
        aria-label="ヘルプ"
      >
        ?
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            className="text-xs text-muted-foreground mt-1.5 p-2.5 bg-muted/50 rounded-md leading-relaxed overflow-hidden"
            initial={shouldReduceMotion ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
          >
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}

function MentsuCard({ entry, index, onRemove }: {
  entry: MentsuEntry; index: number; onRemove: () => void;
}) {
  const fu = getFu(entry);
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card border rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-muted-foreground w-5">{index + 1}.</span>
        <div>
          <div className="text-sm font-bold">{getMentsuLabel(entry)}</div>
          <div className="text-xs text-muted-foreground">+{fu}符</div>
        </div>
      </div>
      <button
        className="text-xs text-muted-foreground hover:text-destructive px-2 py-1"
        onClick={onRemove}
        aria-label="削除"
      >
        ✕
      </button>
    </div>
  );
}

export function StepFuInput({ onSubmit }: Props) {
  const [waitType, setWaitType] = useState<'open' | 'closed'>('open');
  const [jantouChoice, setJantouChoice] = useState<JantouChoice>('other');
  const shouldReduceMotion = useReducedMotion();
  const jantouRef = useRef<HTMLDivElement>(null);
  const mentsuRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Mentsu wizard state
  const [entries, setEntries] = useState<MentsuEntry[]>([]);
  const [phase, setPhase] = useState<WizardPhase>('ask-has-mentsu');

  // Current mentsu being built
  const [currentCount, setCurrentCount] = useState<3 | 4 | null>(null);
  const [currentConcealed, setCurrentConcealed] = useState<boolean | null>(null);

  const isYakuhaiHead = jantouChoice !== 'other';
  const mentsuFu = entries.reduce((sum, e) => sum + getFu(e), 0);

  const startAddMentsu = () => {
    setCurrentCount(null);
    setCurrentConcealed(null);
    setPhase('ask-count');
  };

  const handleSetCount = (count: 3 | 4) => {
    setCurrentCount(count);
    setPhase('ask-concealed');
  };

  const handleSetConcealed = (concealed: boolean) => {
    setCurrentConcealed(concealed);
    setPhase('ask-terminal');
  };

  const handleSetTerminal = (terminal: boolean) => {
    const newEntry: MentsuEntry = {
      count: currentCount!,
      isConcealed: currentConcealed!,
      isTerminal: terminal,
    };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    setPhase('list');
  };

  const removeMentsu = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    if (newEntries.length === 0) {
      setPhase('ask-has-mentsu');
    }
  };

  const phaseAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 } as const,
        animate: { opacity: 1, y: 0 } as const,
        exit: { opacity: 0, y: -10 } as const,
        transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
      };

  return (
    <>
      <motion.h2
        className="text-xl font-bold text-center mb-5"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
      >
        符の計算
      </motion.h2>

      {/* 待ちの形 */}
      <motion.div
        className="mb-5 pb-4 border-b"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
      >
        <div className="flex items-center mb-1">
          <h3 className="text-sm font-bold">待ちの形</h3>
          <HelpToggle text="最後のアガリ牌の受け入れが2種類以上なら「2種類以上」です。例: 2-3で1と4待ちは2種類以上（両面）。1-3で2だけ待ちや、1-2で3だけ待ち、1枚だけ待ちは1種類です。" />
        </div>
        <p className="text-xs text-muted-foreground mb-2">アガリ牌は何種類ありましたか？</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={waitType === 'open' ? 'selected' : 'unselected'}
            size="sm"
            className="h-auto py-2.5 text-xs"
            onClick={() => { setWaitType('open'); scrollToSection(jantouRef); }}
          >
            <div>
              <div className="font-bold">2種類以上</div>
              <div className="font-normal text-muted-foreground mt-0.5">両面・シャンポンなど</div>
            </div>
          </Button>
          <Button
            variant={waitType === 'closed' ? 'selected' : 'unselected'}
            size="sm"
            className="h-auto py-2.5 text-xs"
            onClick={() => { setWaitType('closed'); scrollToSection(jantouRef); }}
          >
            <div>
              <div className="font-bold">1種類だけ</div>
              <div className="font-normal text-muted-foreground mt-0.5">嵌張・辺張・単騎</div>
            </div>
          </Button>
        </div>
      </motion.div>

      {/* 雀頭 */}
      <motion.div
        ref={jantouRef}
        className="mb-5 pb-4 border-b scroll-mt-4"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
      >
        <div className="flex items-center mb-1">
          <h3 className="text-sm font-bold">雀頭（頭）</h3>
          <HelpToggle text="頭が三元牌（白・發・中）や、場の風・自分の風と同じ風牌の場合は符がつきます。連風牌（例: 東場の東家の東）も該当します。" />
        </div>
        <p className="text-xs text-muted-foreground mb-2">頭（2枚の組）はどれですか？</p>
        <div className="flex flex-col gap-2">
          <Button
            variant={jantouChoice === 'sangenpai' ? 'selected' : 'unselected'}
            size="sm"
            className="h-auto py-2.5 text-xs text-left justify-start"
            onClick={() => { setJantouChoice('sangenpai'); scrollToSection(mentsuRef); }}
          >
            <div>
              <span className="font-bold">白・發・中のどれか</span>
            </div>
          </Button>
          <Button
            variant={jantouChoice === 'kazehai' ? 'selected' : 'unselected'}
            size="sm"
            className="h-auto py-2.5 text-xs text-left justify-start"
            onClick={() => { setJantouChoice('kazehai'); scrollToSection(mentsuRef); }}
          >
            <div>
              <span className="font-bold">場の風や自分の風と同じ風牌</span>
              <span className="font-normal text-muted-foreground ml-1.5">例: 東場なら東</span>
            </div>
          </Button>
          <Button
            variant={jantouChoice === 'other' ? 'selected' : 'unselected'}
            size="sm"
            className="h-auto py-2.5 text-xs text-left justify-start"
            onClick={() => { setJantouChoice('other'); scrollToSection(mentsuRef); }}
          >
            <div>
              <span className="font-bold">どれでもない</span>
            </div>
          </Button>
        </div>
      </motion.div>

      {/* 刻子・槓子 wizard */}
      <motion.div
        ref={mentsuRef}
        className="mb-5 scroll-mt-4"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25, delay: 0.15 }}
      >
        <div className="flex items-center mb-3">
          <h3 className="text-sm font-bold">刻子・槓子</h3>
          <HelpToggle text="同じ牌3枚の組み合わせが刻子です。自分で揃えたら「暗刻」、ポンしたら「明刻」。1・9・字牌の刻子は中張牌（2〜8）より符が高くなります。槓子（4枚）はさらに高い符がつきます。" />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {phase === 'ask-has-mentsu' && (
            <motion.div key="ask-has-mentsu" {...phaseAnimation}>
              <p className="text-sm text-center mb-4 text-muted-foreground">
                同じ牌3枚以上の組み合わせはありますか？
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-14 text-base font-bold"
                  onClick={() => onSubmit({ waitType, isYakuhaiHead, mentsuFu: 0 })}
                >
                  なし（順子のみ）
                </Button>
                <Button
                  variant="outline"
                  className="h-14 text-base font-bold"
                  onClick={startAddMentsu}
                >
                  ある
                </Button>
              </div>
            </motion.div>
          )}

          {phase === 'ask-count' && (
            <motion.div key="ask-count" {...phaseAnimation}>
              <p className="text-sm text-center mb-1 font-bold">
                {entries.length + 1}組目
              </p>
              <p className="text-sm text-center mb-4 text-muted-foreground">
                何枚の組み合わせ？
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 text-left justify-start"
                  onClick={() => handleSetCount(3)}
                >
                  <div>
                    <div className="text-base font-bold">3枚（刻子）</div>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">ポンや暗刻</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 text-left justify-start"
                  onClick={() => handleSetCount(4)}
                >
                  <div>
                    <div className="text-base font-bold">4枚（槓子）</div>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">カンした牌</div>
                  </div>
                </Button>
              </div>
              <button
                className="w-full mt-3 text-xs text-muted-foreground underline"
                onClick={() => setPhase(entries.length > 0 ? 'list' : 'ask-has-mentsu')}
              >
                戻る
              </button>
            </motion.div>
          )}

          {phase === 'ask-concealed' && (
            <motion.div key="ask-concealed" {...phaseAnimation}>
              <p className="text-sm text-center mb-1 font-bold">
                {entries.length + 1}組目 — {currentCount === 3 ? '刻子' : '槓子'}
              </p>
              <p className="text-sm text-center mb-4 text-muted-foreground">
                どうやって揃えた？
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 text-left justify-start"
                  onClick={() => handleSetConcealed(false)}
                >
                  <div>
                    <div className="text-base font-bold">
                      {currentCount === 3 ? 'ポンした（明）' : '明槓・加槓'}
                    </div>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">
                      {currentCount === 3 ? '他家から鳴いた' : '他家から鳴いた or 加槓'}
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 text-left justify-start"
                  onClick={() => handleSetConcealed(true)}
                >
                  <div>
                    <div className="text-base font-bold">
                      {currentCount === 3 ? '自力で揃えた（暗）' : '暗槓'}
                    </div>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">
                      {currentCount === 3 ? '鳴かずに手牌で揃えた' : '手牌4枚でカン'}
                    </div>
                  </div>
                </Button>
              </div>
              <button
                className="w-full mt-3 text-xs text-muted-foreground underline"
                onClick={() => setPhase('ask-count')}
              >
                戻る
              </button>
            </motion.div>
          )}

          {phase === 'ask-terminal' && (
            <motion.div key="ask-terminal" {...phaseAnimation}>
              <p className="text-sm text-center mb-1 font-bold">
                {entries.length + 1}組目 — {currentConcealed
                  ? (currentCount === 3 ? '暗刻' : '暗槓')
                  : (currentCount === 3 ? '明刻' : '明槓')}
              </p>
              <p className="text-sm text-center mb-4 text-muted-foreground">
                どんな牌？
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 text-left justify-start"
                  onClick={() => handleSetTerminal(false)}
                >
                  <div>
                    <div className="text-base font-bold">中張牌</div>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">2〜8の数牌</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 text-left justify-start"
                  onClick={() => handleSetTerminal(true)}
                >
                  <div>
                    <div className="text-base font-bold">么九牌</div>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">1, 9, 字牌</div>
                  </div>
                </Button>
              </div>
              <button
                className="w-full mt-3 text-xs text-muted-foreground underline"
                onClick={() => setPhase('ask-concealed')}
              >
                戻る
              </button>
            </motion.div>
          )}

          {phase === 'list' && (
            <motion.div key="list" {...phaseAnimation}>
              <div className="flex flex-col gap-2 mb-3">
                <AnimatePresence initial={false} mode="popLayout">
                  {entries.map((entry, i) => (
                    <motion.div
                      key={`${getMentsuLabel(entry)}-${i}`}
                      layout={!shouldReduceMotion}
                      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
                    >
                      <MentsuCard
                        entry={entry}
                        index={i}
                        onRemove={() => removeMentsu(i)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {entries.length < 4 && (
                <motion.button
                  className="w-full py-2.5 text-sm text-primary font-semibold border-2 border-dashed border-primary/30 rounded-lg hover:bg-primary/5"
                  onClick={startAddMentsu}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  + もう1組追加（{entries.length}/4）
                </motion.button>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">面子: {entries.length}/4</span>
                {mentsuFu > 0 && (
                  <span className="text-sm font-bold text-primary">
                    刻子・槓子の符: +{mentsuFu}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {(phase === 'list' || phase === 'ask-has-mentsu') && phase === 'list' && (
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
        >
          <Button className="w-full" size="lg" onClick={() => onSubmit({ waitType, isYakuhaiHead, mentsuFu })}>
            次へ
          </Button>
        </motion.div>
      )}

      {phase !== 'ask-has-mentsu' && phase !== 'list' && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          刻子・槓子の質問に回答すると次に進めます
        </p>
      )}
    </>
  );
}
