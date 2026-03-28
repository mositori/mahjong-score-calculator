import { describe, test, expect } from 'vitest';
import { getExcludedYaku, getConflictingYaku } from '../logic/yakuExclusions';

describe('getExcludedYaku', () => {
  describe('handType による排他', () => {
    test('七対子: 面子系・カン系の役を除外', () => {
      const excluded = getExcludedYaku('chiitoitsu', {});
      expect(excluded).toContain('iipeiko');
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('ittsu');
      expect(excluded).toContain('toitoi');
      expect(excluded).toContain('sananko');
      expect(excluded).toContain('rinshan');
      expect(excluded).toContain('yakuhai');
      // 除外されない役
      expect(excluded).not.toContain('tanyao');
      expect(excluded).not.toContain('riichi');
      expect(excluded).not.toContain('honitsu');
    });

    test('ピンフ: 刻子系・カン系の役を除外', () => {
      const excluded = getExcludedYaku('pinfu', {});
      expect(excluded).toContain('yakuhai');
      expect(excluded).toContain('toitoi');
      expect(excluded).toContain('sananko');
      expect(excluded).toContain('rinshan');
      // 除外されない役
      expect(excluded).not.toContain('tanyao');
      expect(excluded).not.toContain('sanshoku');
      expect(excluded).not.toContain('iipeiko');
    });

    test('other: handType による除外なし', () => {
      const excluded = getExcludedYaku('other', {});
      expect(excluded.size).toBe(0);
    });

    test('null: handType による除外なし', () => {
      const excluded = getExcludedYaku(null, {});
      expect(excluded.size).toBe(0);
    });
  });

  describe('役同士の相互排他', () => {
    test('タンヤオ選択時: 役牌・混一色を除外', () => {
      const excluded = getExcludedYaku('other', { tanyao: 1 });
      expect(excluded).toContain('yakuhai');
      expect(excluded).toContain('honitsu');
    });

    test('役牌選択時: タンヤオを除外', () => {
      const excluded = getExcludedYaku('other', { yakuhai: 2 });
      expect(excluded).toContain('tanyao');
    });

    test('対々和選択時: 順子系の役を除外', () => {
      const excluded = getExcludedYaku('other', { toitoi: 1 });
      expect(excluded).toContain('iipeiko');
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('ittsu');
    });

    test('三暗刻選択時: 順子系の役を除外', () => {
      const excluded = getExcludedYaku('other', { sananko: 1 });
      expect(excluded).toContain('iipeiko');
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('ittsu');
    });

    test('混一色選択時: 清一色・タンヤオを除外', () => {
      const excluded = getExcludedYaku('other', { honitsu: 1 });
      expect(excluded).toContain('chinitsu');
      expect(excluded).toContain('tanyao');
    });

    test('清一色選択時: 混一色を除外', () => {
      const excluded = getExcludedYaku('other', { chinitsu: 1 });
      expect(excluded).toContain('honitsu');
    });

    test('三色同順と一気通貫は相互排他', () => {
      expect(getExcludedYaku('other', { sanshoku: 1 })).toContain('ittsu');
      expect(getExcludedYaku('other', { ittsu: 1 })).toContain('sanshoku');
    });

    test('海底/河底と嶺上開花は相互排他', () => {
      expect(getExcludedYaku('other', { haitei: 1 })).toContain('rinshan');
      expect(getExcludedYaku('other', { rinshan: 1 })).toContain('haitei');
    });
  });

  describe('handType + 選択の複合', () => {
    test('七対子 + タンヤオ: 両方の排他が合算される', () => {
      const excluded = getExcludedYaku('chiitoitsu', { tanyao: 1 });
      // handType による排他
      expect(excluded).toContain('iipeiko');
      expect(excluded).toContain('toitoi');
      expect(excluded).toContain('yakuhai');
      // 選択による排他
      expect(excluded).toContain('honitsu');
    });
  });

  describe('未選択の役は排他を発生させない', () => {
    test('値が0の役は排他を発生させない', () => {
      const excluded = getExcludedYaku('other', { tanyao: 0 });
      expect(excluded).not.toContain('yakuhai');
      expect(excluded).not.toContain('honitsu');
    });
  });
});

describe('getConflictingYaku', () => {
  test('タンヤオの競合: 役牌・混一色', () => {
    const conflicts = getConflictingYaku('tanyao');
    expect(conflicts).toContain('yakuhai');
    expect(conflicts).toContain('honitsu');
    expect(conflicts).toHaveLength(2);
  });

  test('対々和の競合: 順子系の役', () => {
    const conflicts = getConflictingYaku('toitoi');
    expect(conflicts).toContain('iipeiko');
    expect(conflicts).toContain('sanshoku');
    expect(conflicts).toContain('ittsu');
    expect(conflicts).toHaveLength(3);
  });

  test('海底/河底の競合: 嶺上開花のみ', () => {
    const conflicts = getConflictingYaku('haitei');
    expect(conflicts).toEqual(['rinshan']);
  });

  test('排他ルールのない役: 空配列', () => {
    const conflicts = getConflictingYaku('riichi');
    expect(conflicts).toEqual([]);
  });
});
