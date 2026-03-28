import { useEffect, useRef, useState } from 'react';
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
  breakdown: string[];
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

function ScoreValue({ value, label }: { value: number; label: string }) {
  const displayed = useCountUp(value, 600);
  return (
    <div className="flex justify-between items-center py-3 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-2xl font-bold tabular-nums">{displayed.toLocaleString()}点</span>
    </div>
  );
}

export function ResultView({ isDealer, isTsumo, han, fu, breakdown, onReset, onResetKeepDealer }: Props) {
  const result = calculateScore(isDealer, isTsumo, han, fu);
  const base = getBasePoints(han, fu);
  const tierName = getTierName(base);
  const isYakuman = tierName === '役満';
  const totalPoints = getTotalPoints(result, isDealer, isTsumo);
  const showCelebration = totalPoints >= 12000;
  const hasFired = useRef(false);

  useEffect(() => {
    if (!hasFired.current) {
      hasFired.current = true;
      fireConfetti(tierName);
      hapticResult(tierName);
    }
  }, [tierName]);

  return (
    <>
      {/* Flash overlay for yakuman */}
      {isYakuman && <div className="yakuman-flash" />}

      {/* Celebration image for 12000+ points */}
      <CelebrationOverlay show={showCelebration} />

      <Card className={isYakuman ? 'ring-2 ring-primary shadow-lg' : ''}>
        <CardHeader className="text-center pb-2">
          {tierName && (
            <CardTitle className={`text-3xl text-primary ${isYakuman ? 'yakuman-pulse' : ''}`}>
              {tierName}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {result.ronPayment != null && (
            <ScoreValue value={result.ronPayment} label="放銃者の支払い" />
          )}

          {isTsumo && isDealer && result.tsumoPaymentNonDealer != null && (
            <ScoreValue value={result.tsumoPaymentNonDealer} label="子の支払い（各自）" />
          )}

          {isTsumo && !isDealer && (
            <>
              {result.tsumoPaymentDealer != null && (
                <ScoreValue value={result.tsumoPaymentDealer} label="親の支払い" />
              )}
              {result.tsumoPaymentNonDealer != null && (
                <ScoreValue value={result.tsumoPaymentNonDealer} label="子の支払い（各自）" />
              )}
            </>
          )}

          <div className="text-center text-xs text-muted-foreground mt-4">
            {han}翻 {fu}符 — {isDealer ? '親' : '子'} / {isTsumo ? 'ツモ' : 'ロン'}
          </div>

          {breakdown.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
              {breakdown.map((item, i) => (
                <Badge key={i} variant="accent">{item}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button className="w-full mt-5" size="lg" onClick={onResetKeepDealer}>
        もう一局
      </Button>
      <Button variant="secondary" className="w-full mt-2" size="lg" onClick={onReset}>
        最初からやり直す
      </Button>
    </>
  );
}
