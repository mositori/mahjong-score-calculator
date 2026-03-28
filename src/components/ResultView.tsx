import { calculateScore } from '../logic/scoreCalculator';

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
    <div className="step">
      <div className="result-card">
        {result.tierName && <div className="result-tier">{result.tierName}</div>}

        {result.ronPayment != null && (
          <div className="result-score">
            <span className="result-label">放銃者の支払い</span>
            <span className="result-value">{result.ronPayment.toLocaleString()}点</span>
          </div>
        )}

        {isTsumo && isDealer && result.tsumoPaymentNonDealer != null && (
          <div className="result-score">
            <span className="result-label">子の支払い（各自）</span>
            <span className="result-value">{result.tsumoPaymentNonDealer.toLocaleString()}点</span>
          </div>
        )}

        {isTsumo && !isDealer && (
          <>
            {result.tsumoPaymentDealer != null && (
              <div className="result-score">
                <span className="result-label">親の支払い</span>
                <span className="result-value">{result.tsumoPaymentDealer.toLocaleString()}点</span>
              </div>
            )}
            {result.tsumoPaymentNonDealer != null && (
              <div className="result-score">
                <span className="result-label">子の支払い（各自）</span>
                <span className="result-value">{result.tsumoPaymentNonDealer.toLocaleString()}点</span>
              </div>
            )}
          </>
        )}

        <div className="result-detail">
          {han}翻 {fu}符 — {isDealer ? '親' : '子'} / {isTsumo ? 'ツモ' : 'ロン'}
        </div>

        {breakdown.length > 0 && (
          <div className="result-breakdown">
            {breakdown.map((item, i) => (
              <span key={i} className="breakdown-tag">{item}</span>
            ))}
          </div>
        )}
      </div>

      <button className="reset-button" onClick={onReset}>やり直す</button>
    </div>
  );
}
