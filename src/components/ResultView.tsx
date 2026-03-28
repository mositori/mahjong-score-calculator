import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';
import { calculateScore, getTierName, getBasePoints, getTotalPoints } from '../logic/scoreCalculator';
import { CelebrationOverlay } from './CelebrationOverlay';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { hapticResult } from '@/lib/haptics';

type Props = {
  isDealer: boolean;
  isTsumo: boolean;
  han: number;
  fu: number;
  honba: number;
  breakdown: string[];
  onBack: () => void;
  onReset: () => void;
  onResetKeepDealer: () => void;
};

function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = useState(0);
  const startTime = useRef(0);

  useEffect(() => {
    if (target === 0) return;
    startTime.current = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

function fireConfetti(tierName: string | null) {
  if (!tierName) return;

  const base = { disableForReducedMotion: true, zIndex: 9999 };

  switch (tierName) {
    case '満貫':
      confetti({ ...base, particleCount: 40, spread: 55, origin: { y: 0.7 } });
      break;
    case '跳満':
      confetti({ ...base, particleCount: 70, spread: 70, origin: { y: 0.65 } });
      break;
    case '倍満':
      confetti({ ...base, particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => confetti({ ...base, particleCount: 50, spread: 100, origin: { y: 0.7 } }), 300);
      break;
    case '三倍満':
      confetti({ ...base, particleCount: 120, spread: 90, origin: { y: 0.6 }, colors: ['#FFD700', '#FFA500', '#FF6347'] });
      setTimeout(() => confetti({ ...base, particleCount: 80, spread: 120, origin: { y: 0.5 }, colors: ['#FFD700', '#FFA500'] }), 400);
      break;
    case '役満': {
      // Full screen burst
      const fire = (opts: confetti.Options) => confetti({ ...base, ...opts });
      fire({ particleCount: 80, spread: 100, origin: { x: 0.3, y: 0.5 }, colors: ['#FFD700', '#FF0000', '#FF6347'] });
      fire({ particleCount: 80, spread: 100, origin: { x: 0.7, y: 0.5 }, colors: ['#FFD700', '#FF0000', '#FF6347'] });
      setTimeout(() => {
        fire({ particleCount: 100, spread: 160, origin: { y: 0.4 }, colors: ['#FFD700', '#FFA500', '#FF0000', '#FF6347'] });
      }, 300);
      setTimeout(() => {
        fire({ particleCount: 60, spread: 120, origin: { y: 0.6 }, colors: ['#FFD700', '#FFA500'] });
      }, 600);
      break;
    }
  }
}

function ScoreValue({ value, label, index }: { value: number; label: string; index: number }) {
  const displayed = useCountUp(value, 600);
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className="flex justify-between items-center py-3 border-b last:border-b-0"
      initial={shouldReduceMotion ? undefined : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25, delay: 0.3 + index * 0.1 }}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-2xl font-bold tabular-nums">{displayed.toLocaleString()}点</span>
    </motion.div>
  );
}

export function ResultView({ isDealer, isTsumo, han, fu, honba, breakdown, onBack, onReset, onResetKeepDealer }: Props) {
  const result = calculateScore(isDealer, isTsumo, han, fu, honba);
  const base = getBasePoints(han, fu);
  const tierName = getTierName(base);
  const isYakuman = tierName === '役満';
  const totalPoints = getTotalPoints(result, isDealer, isTsumo);
  const showCelebration = totalPoints >= 12000;
  const hasFired = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!hasFired.current) {
      hasFired.current = true;
      fireConfetti(tierName);
      hapticResult(tierName);
    }
  }, [tierName]);

  let scoreIndex = 0;

  return (
    <>
      {/* Flash overlay for yakuman */}
      {isYakuman && <div className="yakuman-flash" />}

      {/* Celebration image for 12000+ points */}
      <CelebrationOverlay show={showCelebration} />

      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
      >
        <Card className={isYakuman ? 'ring-2 ring-primary shadow-lg' : ''}>
          <CardHeader className="text-center pb-2">
            {tierName && (
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={shouldReduceMotion ? { duration: 0 } : {
                  duration: 0.5,
                  delay: 0.15,
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <CardTitle className={`text-3xl text-primary ${isYakuman ? 'yakuman-pulse' : ''}`}>
                  {tierName}
                </CardTitle>
              </motion.div>
            )}
          </CardHeader>
          <CardContent>
            {result.ronPayment != null && (
              <ScoreValue value={result.ronPayment} label="放銃者の支払い" index={scoreIndex++} />
            )}

            {isTsumo && isDealer && result.tsumoPaymentNonDealer != null && (
              <ScoreValue value={result.tsumoPaymentNonDealer} label="子の支払い（各自）" index={scoreIndex++} />
            )}

            {isTsumo && !isDealer && (
              <>
                {result.tsumoPaymentDealer != null && (
                  <ScoreValue value={result.tsumoPaymentDealer} label="親の支払い" index={scoreIndex++} />
                )}
                {result.tsumoPaymentNonDealer != null && (
                  <ScoreValue value={result.tsumoPaymentNonDealer} label="子の支払い（各自）" index={scoreIndex++} />
                )}
              </>
            )}

            <motion.div
              className="text-center text-xs text-muted-foreground mt-4"
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25, delay: 0.5 }}
            >
              {han}翻 {fu}符{honba > 0 ? ` ${honba}本場` : ''} — {isDealer ? '親' : '子'} / {isTsumo ? 'ツモ' : 'ロン'}
            </motion.div>

            {breakdown.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {breakdown.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30, delay: 0.6 + i * 0.05 }}
                  >
                    <Badge variant="accent">{item}</Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25, delay: 0.7 }}
      >
        <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground" onClick={onBack}>
          ← 戻る
        </Button>
      </motion.div>
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25, delay: 0.8 }}
      >
        <Button className="w-full mt-2" size="lg" onClick={onResetKeepDealer}>
          もう一局
        </Button>
      </motion.div>
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25, delay: 0.9 }}
      >
        <Button variant="secondary" className="w-full mt-2" size="lg" onClick={onReset}>
          最初からやり直す
        </Button>
      </motion.div>
    </>
  );
}
