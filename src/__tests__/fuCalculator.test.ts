import { describe, test, expect } from 'vitest';
import { calculateFu } from '../logic/fuCalculator';

const base = {
  isTsumo: false,
  isMenzen: true,
  isChiitoitsu: false,
  isPinfu: false,
  waitType: 'open' as const,
  isYakuhaiHead: false,
  mentsuFu: 0,
};

describe('calculateFu', () => {
  test('七対子 → 25符', () => {
    expect(calculateFu({ ...base, isChiitoitsu: true })).toBe(25);
  });

  test('ピンフツモ → 20符', () => {
    expect(calculateFu({ ...base, isPinfu: true, isTsumo: true })).toBe(20);
  });

  test('ピンフロン → 30符', () => {
    expect(calculateFu({ ...base, isPinfu: true })).toBe(30);
  });

  test('門前ロン + 両面 + 役牌雀頭なし + 刻子なし → 30符', () => {
    expect(calculateFu({ ...base })).toBe(30);
  });

  test('門前ロン + 嵌張 + 役牌雀頭 + 暗刻(1,9)1個 → 50符', () => {
    // 30 + 2(嵌張) + 2(役牌雀頭) + 8(暗刻么九) = 42 → 50符
    expect(calculateFu({ ...base, waitType: 'closed', isYakuhaiHead: true, mentsuFu: 8 })).toBe(50);
  });

  test('門前ツモ + 両面 + 暗刻(中張)1個 → 30符', () => {
    // 20 + 4(暗刻中張) + 2(ツモ) = 26 → 30符
    expect(calculateFu({ ...base, isTsumo: true, mentsuFu: 4 })).toBe(30);
  });

  test('鳴きロン + 両面 + 明刻(1,9)1個 → 30符', () => {
    // 20 + 4(明刻么九) = 24 → 30符
    expect(calculateFu({ ...base, isMenzen: false, mentsuFu: 4 })).toBe(30);
  });

  test('鳴きロン + 単騎 + 明刻(1,9)1個 → 30符', () => {
    // 20 + 2(単騎) + 4(明刻么九) = 26 → 30符
    expect(calculateFu({ ...base, isMenzen: false, waitType: 'closed', mentsuFu: 4 })).toBe(30);
  });

  test('鳴きツモ + 両面 + 明刻(中張)1個 → 30符', () => {
    // 20 + 2(明刻中張) = 22 → 30符
    expect(calculateFu({ ...base, isMenzen: false, isTsumo: true, mentsuFu: 2 })).toBe(30);
  });

  test('門前ロン + 嵌張 + 暗刻(1,9)2個 → 50符', () => {
    // 30 + 2(嵌張) + 16(暗刻么九×2) = 48 → 50符
    expect(calculateFu({ ...base, waitType: 'closed', mentsuFu: 16 })).toBe(50);
  });

  test('門前ロン + 暗槓(1,9) → 70符', () => {
    // 30 + 32(暗槓么九) = 62 → 70符
    expect(calculateFu({ ...base, mentsuFu: 32 })).toBe(70);
  });
});
