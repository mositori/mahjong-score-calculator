import type { ScoreResult } from '../types';

export function roundUpTo100(n: number): number {
  return Math.ceil(n / 100) * 100;
}

export function getBasePoints(han: number, fu: number): number {
  if (han >= 13) return 8000;
  if (han >= 11) return 6000;
  if (han >= 8) return 4000;
  if (han >= 6) return 3000;
  if (han >= 5) return 2000;
  if (han === 4 && fu >= 30) return 2000;
  return Math.min(fu * Math.pow(2, han + 2), 2000);
}

export function getTierName(basePoints: number): string | null {
  if (basePoints >= 8000) return '役満';
  if (basePoints >= 6000) return '三倍満';
  if (basePoints >= 4000) return '倍満';
  if (basePoints >= 3000) return '跳満';
  if (basePoints >= 2000) return '満貫';
  return null;
}

export function calculateScore(
  isDealer: boolean,
  isTsumo: boolean,
  han: number,
  fu: number,
  honba: number = 0,
): ScoreResult {
  const base = getBasePoints(han, fu);
  const tierName = getTierName(base);

  if (isTsumo) {
    if (isDealer) {
      const each = roundUpTo100(base * 2) + 100 * honba;
      return { tierName, ronPayment: null, tsumoPaymentDealer: null, tsumoPaymentNonDealer: each };
    } else {
      const dealerPays = roundUpTo100(base * 2) + 100 * honba;
      const nonDealerPays = roundUpTo100(base) + 100 * honba;
      return { tierName, ronPayment: null, tsumoPaymentDealer: dealerPays, tsumoPaymentNonDealer: nonDealerPays };
    }
  } else {
    if (isDealer) {
      return { tierName, ronPayment: roundUpTo100(base * 6) + 300 * honba, tsumoPaymentDealer: null, tsumoPaymentNonDealer: null };
    } else {
      return { tierName, ronPayment: roundUpTo100(base * 4) + 300 * honba, tsumoPaymentDealer: null, tsumoPaymentNonDealer: null };
    }
  }
}
