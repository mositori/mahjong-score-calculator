import { calculateScore } from '../logic/scoreCalculator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type Props = {
  isDealer: boolean;
  isTsumo: boolean;
  han: number;
  fu: number;
  breakdown: string[];
  onReset: () => void;
};

export function ResultView({ isDealer, isTsumo, han, fu, breakdown, onReset }: Props) {
  const result = calculateScore(isDealer, isTsumo, han, fu);

  return (
    <div className="step-animate">
      <Card>
        <CardHeader className="text-center pb-2">
          {result.tierName && (
            <CardTitle className="text-3xl text-primary">{result.tierName}</CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {result.ronPayment != null && (
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-sm text-muted-foreground">放銃者の支払い</span>
              <span className="text-2xl font-bold">{result.ronPayment.toLocaleString()}点</span>
            </div>
          )}

          {isTsumo && isDealer && result.tsumoPaymentNonDealer != null && (
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-sm text-muted-foreground">子の支払い（各自）</span>
              <span className="text-2xl font-bold">{result.tsumoPaymentNonDealer.toLocaleString()}点</span>
            </div>
          )}

          {isTsumo && !isDealer && (
            <>
              {result.tsumoPaymentDealer != null && (
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-sm text-muted-foreground">親の支払い</span>
                  <span className="text-2xl font-bold">{result.tsumoPaymentDealer.toLocaleString()}点</span>
                </div>
              )}
              {result.tsumoPaymentNonDealer != null && (
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-muted-foreground">子の支払い（各自）</span>
                  <span className="text-2xl font-bold">{result.tsumoPaymentNonDealer.toLocaleString()}点</span>
                </div>
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

      <Button variant="secondary" className="w-full mt-5" size="lg" onClick={onReset}>
        やり直す
      </Button>
    </div>
  );
}
