import { describe, test, expect } from 'vitest';
import { calculateScore, getBasePoints, roundUpTo100 } from '../logic/scoreCalculator';

describe('roundUpTo100', () => {
  test('rounds up to nearest 100', () => {
    expect(roundUpTo100(960)).toBe(1000);
    expect(roundUpTo100(1000)).toBe(1000);
    expect(roundUpTo100(1001)).toBe(1100);
    expect(roundUpTo100(240)).toBe(300);
  });
});

describe('getBasePoints', () => {
  test('yakuman (13+ han)', () => {
    expect(getBasePoints(13, 30)).toBe(8000);
    expect(getBasePoints(26, 30)).toBe(8000);
  });
  test('sanbaiman (11-12 han)', () => {
    expect(getBasePoints(11, 30)).toBe(6000);
    expect(getBasePoints(12, 30)).toBe(6000);
  });
  test('baiman (8-10 han)', () => {
    expect(getBasePoints(8, 30)).toBe(4000);
    expect(getBasePoints(10, 30)).toBe(4000);
  });
  test('haneman (6-7 han)', () => {
    expect(getBasePoints(6, 30)).toBe(3000);
    expect(getBasePoints(7, 30)).toBe(3000);
  });
  test('mangan (5 han)', () => {
    expect(getBasePoints(5, 30)).toBe(2000);
  });
  test('mangan by 4han 30fu', () => {
    expect(getBasePoints(4, 30)).toBe(2000);
  });
  test('4han 25fu is NOT mangan', () => {
    expect(getBasePoints(4, 25)).toBe(1600);
  });
  test('3han 60fu is NOT mangan', () => {
    expect(getBasePoints(3, 60)).toBe(1920);
  });
  test('formula capped at 2000', () => {
    expect(getBasePoints(4, 40)).toBe(2000);
  });
  test('1han 30fu base points', () => {
    expect(getBasePoints(1, 30)).toBe(240);
  });
  test('3han 40fu base points', () => {
    expect(getBasePoints(3, 40)).toBe(1280);
  });
});

describe('calculateScore', () => {
  test('子ロン 1翻30符 → 1000', () => {
    const r = calculateScore(false, false, 1, 30);
    expect(r.ronPayment).toBe(1000);
    expect(r.tierName).toBeNull();
  });

  test('親ロン 3翻40符 → 7700', () => {
    const r = calculateScore(true, false, 3, 40);
    expect(r.ronPayment).toBe(7700);
    expect(r.tierName).toBeNull();
  });

  test('子ツモ 1翻30符 → 親500/子300', () => {
    const r = calculateScore(false, true, 1, 30);
    expect(r.tsumoPaymentDealer).toBe(500);
    expect(r.tsumoPaymentNonDealer).toBe(300);
  });

  test('親ツモ 3翻40符 → 各2600', () => {
    const r = calculateScore(true, true, 3, 40);
    expect(r.tsumoPaymentNonDealer).toBe(2600);
    expect(r.tsumoPaymentDealer).toBeNull();
  });

  test('子ロン 満貫(5翻) → 8000', () => {
    const r = calculateScore(false, false, 5, 30);
    expect(r.ronPayment).toBe(8000);
    expect(r.tierName).toBe('満貫');
  });

  test('親ロン 満貫(5翻) → 12000', () => {
    const r = calculateScore(true, false, 5, 30);
    expect(r.ronPayment).toBe(12000);
    expect(r.tierName).toBe('満貫');
  });

  test('子ツモ 満貫(5翻) → 親4000/子2000', () => {
    const r = calculateScore(false, true, 5, 30);
    expect(r.tsumoPaymentDealer).toBe(4000);
    expect(r.tsumoPaymentNonDealer).toBe(2000);
    expect(r.tierName).toBe('満貫');
  });

  test('子ツモ 跳満(6翻) → 親6000/子3000', () => {
    const r = calculateScore(false, true, 6, 30);
    expect(r.tsumoPaymentDealer).toBe(6000);
    expect(r.tsumoPaymentNonDealer).toBe(3000);
    expect(r.tierName).toBe('跳満');
  });

  test('親ツモ 役満(13翻) → 各16000', () => {
    const r = calculateScore(true, true, 13, 30);
    expect(r.tsumoPaymentNonDealer).toBe(16000);
    expect(r.tierName).toBe('役満');
  });

  test('子ロン 4翻30符 → 満貫 8000', () => {
    const r = calculateScore(false, false, 4, 30);
    expect(r.ronPayment).toBe(8000);
    expect(r.tierName).toBe('満貫');
  });

  test('子ロン 3翻60符 → 7700 (NOT満貫)', () => {
    const r = calculateScore(false, false, 3, 60);
    expect(r.ronPayment).toBe(7700);
    expect(r.tierName).toBeNull();
  });

  test('子ロン 倍満(8翻) → 16000', () => {
    const r = calculateScore(false, false, 8, 30);
    expect(r.ronPayment).toBe(16000);
    expect(r.tierName).toBe('倍満');
  });

  test('子ロン 三倍満(11翻) → 24000', () => {
    const r = calculateScore(false, false, 11, 30);
    expect(r.ronPayment).toBe(24000);
    expect(r.tierName).toBe('三倍満');
  });

  test('子ロン 役満(13翻) → 32000', () => {
    const r = calculateScore(false, false, 13, 30);
    expect(r.ronPayment).toBe(32000);
    expect(r.tierName).toBe('役満');
  });

  test('親ロン 役満(13翻) → 48000', () => {
    const r = calculateScore(true, false, 13, 30);
    expect(r.ronPayment).toBe(48000);
    expect(r.tierName).toBe('役満');
  });

  test('子ロン 1翻30符 2本場 → 1600', () => {
    const r = calculateScore(false, false, 1, 30, 2);
    expect(r.ronPayment).toBe(1600);
  });

  test('親ロン 3翻40符 1本場 → 8000', () => {
    const r = calculateScore(true, false, 3, 40, 1);
    expect(r.ronPayment).toBe(8000);
  });

  test('子ツモ 1翻30符 1本場 → 親600/子400', () => {
    const r = calculateScore(false, true, 1, 30, 1);
    expect(r.tsumoPaymentDealer).toBe(600);
    expect(r.tsumoPaymentNonDealer).toBe(400);
  });

  test('親ツモ 3翻40符 1本場 → 各2700', () => {
    const r = calculateScore(true, true, 3, 40, 1);
    expect(r.tsumoPaymentNonDealer).toBe(2700);
  });

  test('honba=0 は加算なし', () => {
    const r = calculateScore(false, false, 1, 30, 0);
    expect(r.ronPayment).toBe(1000);
  });
});
