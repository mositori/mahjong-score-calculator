import { describe, test, expect } from 'vitest';
import { getExcludedYaku, getConflictingYaku } from '../logic/yakuExclusions';
import { YAKUHAI_IDS } from '../logic/yakuList';

describe('getExcludedYaku', () => {
  describe('handType による排他', () => {
    test('七対子: 面子系・カン系の役を除外', () => {
      const excluded = getExcludedYaku('chiitoitsu', {});
      // 既存の除外
      expect(excluded).toContain('iipeiko');
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('ittsu');
      expect(excluded).toContain('toitoi');
      expect(excluded).toContain('sananko');
      expect(excluded).toContain('rinshan');
      for (const id of YAKUHAI_IDS) {
        expect(excluded).toContain(id);
      }
      // 新規の除外
      expect(excluded).toContain('chankan');
      expect(excluded).toContain('chanta');
      expect(excluded).toContain('sanshoku_doukou');
      expect(excluded).toContain('shousangen');
      expect(excluded).toContain('junchan');
      expect(excluded).toContain('ryanpeikou');
      // 除外されない役
      expect(excluded).not.toContain('tanyao');
      expect(excluded).not.toContain('riichi');
      expect(excluded).not.toContain('honitsu');
      expect(excluded).not.toContain('honroutou');
    });

    test('ピンフ: 刻子系・カン系の役を除外', () => {
      const excluded = getExcludedYaku('pinfu', {});
      // 既存の除外
      for (const id of YAKUHAI_IDS) {
        expect(excluded).toContain(id);
      }
      expect(excluded).toContain('toitoi');
      expect(excluded).toContain('sananko');
      expect(excluded).toContain('rinshan');
      // 新規の除外
      expect(excluded).toContain('chankan');
      expect(excluded).toContain('sanshoku_doukou');
      expect(excluded).toContain('shousangen');
      expect(excluded).toContain('honroutou');
      // 除外されない役
      expect(excluded).not.toContain('tanyao');
      expect(excluded).not.toContain('sanshoku');
      expect(excluded).not.toContain('iipeiko');
      expect(excluded).not.toContain('ryanpeikou');
      expect(excluded).not.toContain('chanta');
      expect(excluded).not.toContain('junchan');
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
    test('タンヤオ選択時: 役牌・混一色・一気通貫を除外', () => {
      const excluded = getExcludedYaku('other', { tanyao: 1 });
      for (const id of YAKUHAI_IDS) {
        expect(excluded).toContain(id);
      }
      expect(excluded).toContain('honitsu');
      expect(excluded).toContain('ittsu');
      expect(excluded).toContain('chanta');
      expect(excluded).toContain('shousangen');
      expect(excluded).toContain('honroutou');
      expect(excluded).toContain('junchan');
    });

    test('役牌（白）選択時: タンヤオ・清一色・純チャンを除外', () => {
      const excluded = getExcludedYaku('other', { haku: 1 });
      expect(excluded).toContain('tanyao');
      expect(excluded).toContain('chinitsu');
      expect(excluded).toContain('junchan');
      expect(excluded).toContain('ryanpeikou');
    });

    test('役牌（場風）選択時: タンヤオ・清一色・純チャンを除外', () => {
      const excluded = getExcludedYaku('other', { bakaze: 1 });
      expect(excluded).toContain('tanyao');
      expect(excluded).toContain('chinitsu');
      expect(excluded).toContain('junchan');
      expect(excluded).toContain('ryanpeikou');
    });

    test('役牌同士は排他しない', () => {
      const excluded = getExcludedYaku('other', { haku: 1 });
      expect(excluded).not.toContain('hatsu');
      expect(excluded).not.toContain('chun');
      expect(excluded).not.toContain('bakaze');
      expect(excluded).not.toContain('jikaze');
    });

    test('全5つの役牌を同時選択可能', () => {
      const selection = { haku: 1, hatsu: 1, chun: 1, bakaze: 1, jikaze: 1 };
      const excluded = getExcludedYaku('other', selection);
      for (const id of YAKUHAI_IDS) {
        expect(excluded).not.toContain(id);
      }
    });

    test('対々和選択時: 順子系の役を除外', () => {
      const excluded = getExcludedYaku('other', { toitoi: 1 });
      expect(excluded).toContain('iipeiko');
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('ittsu');
      expect(excluded).toContain('ryanpeikou');
    });

    test('三暗刻選択時: 順子系の役を除外', () => {
      const excluded = getExcludedYaku('other', { sananko: 1 });
      expect(excluded).toContain('iipeiko');
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('ittsu');
      expect(excluded).toContain('ryanpeikou');
    });

    test('混一色選択時: 清一色・タンヤオ・三色系を除外', () => {
      const excluded = getExcludedYaku('other', { honitsu: 1 });
      expect(excluded).toContain('chinitsu');
      expect(excluded).toContain('tanyao');
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('sanshoku_doukou');
      expect(excluded).toContain('junchan');
    });

    test('清一色選択時: 混一色・役牌・三色系を除外', () => {
      const excluded = getExcludedYaku('other', { chinitsu: 1 });
      expect(excluded).toContain('honitsu');
      for (const id of YAKUHAI_IDS) {
        expect(excluded).toContain(id);
      }
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('sanshoku_doukou');
      expect(excluded).toContain('shousangen');
      expect(excluded).toContain('honroutou');
    });

    test('三色同順と一気通貫は相互排他', () => {
      expect(getExcludedYaku('other', { sanshoku: 1 })).toContain('ittsu');
      expect(getExcludedYaku('other', { ittsu: 1 })).toContain('sanshoku');
    });

    test('海底/河底と嶺上開花は相互排他', () => {
      expect(getExcludedYaku('other', { haitei: 1 })).toContain('rinshan');
      expect(getExcludedYaku('other', { rinshan: 1 })).toContain('haitei');
    });

    test('搶槓は海底・嶺上と相互排他', () => {
      expect(getExcludedYaku('other', { chankan: 1 })).toContain('haitei');
      expect(getExcludedYaku('other', { chankan: 1 })).toContain('rinshan');
      expect(getExcludedYaku('other', { haitei: 1 })).toContain('chankan');
      expect(getExcludedYaku('other', { rinshan: 1 })).toContain('chankan');
    });

    test('ダブルリーチとリーチは相互排他', () => {
      expect(getExcludedYaku('other', { double_riichi: 1 })).toContain('riichi');
      expect(getExcludedYaku('other', { riichi: 1 })).toContain('double_riichi');
    });

    test('チャンタの排他: タンヤオ・純チャン・混老頭・一気通貫', () => {
      const excluded = getExcludedYaku('other', { chanta: 1 });
      expect(excluded).toContain('tanyao');
      expect(excluded).toContain('junchan');
      expect(excluded).toContain('honroutou');
      expect(excluded).toContain('ittsu');
    });

    test('三色同刻の排他: 三色同順・一盃口・一気通貫・混一色・清一色・二盃口', () => {
      const excluded = getExcludedYaku('other', { sanshoku_doukou: 1 });
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('iipeiko');
      expect(excluded).toContain('ittsu');
      expect(excluded).toContain('honitsu');
      expect(excluded).toContain('chinitsu');
      expect(excluded).toContain('ryanpeikou');
    });

    test('小三元の排他: タンヤオ・清一色・二盃口', () => {
      const excluded = getExcludedYaku('other', { shousangen: 1 });
      expect(excluded).toContain('tanyao');
      expect(excluded).toContain('chinitsu');
      expect(excluded).toContain('ryanpeikou');
    });

    test('混老頭の排他: タンヤオ・一盃口・三色同順・一気通貫・清一色・二盃口', () => {
      const excluded = getExcludedYaku('other', { honroutou: 1 });
      expect(excluded).toContain('tanyao');
      expect(excluded).toContain('iipeiko');
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('ittsu');
      expect(excluded).toContain('chinitsu');
      expect(excluded).toContain('ryanpeikou');
      expect(excluded).toContain('chanta');
    });

    test('純チャンの排他: タンヤオ・役牌・混一色・一気通貫', () => {
      const excluded = getExcludedYaku('other', { junchan: 1 });
      expect(excluded).toContain('tanyao');
      for (const id of YAKUHAI_IDS) {
        expect(excluded).toContain(id);
      }
      expect(excluded).toContain('honitsu');
      expect(excluded).toContain('ittsu');
      expect(excluded).toContain('chanta');
    });

    test('二盃口の排他: 一盃口・対々和・三暗刻・三色同順・一気通貫・役牌', () => {
      const excluded = getExcludedYaku('other', { ryanpeikou: 1 });
      expect(excluded).toContain('iipeiko');
      expect(excluded).toContain('toitoi');
      expect(excluded).toContain('sananko');
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('ittsu');
      for (const id of YAKUHAI_IDS) {
        expect(excluded).toContain(id);
      }
      expect(excluded).toContain('sanshoku_doukou');
      expect(excluded).toContain('shousangen');
      expect(excluded).toContain('honroutou');
    });

    test('一気通貫選択時: タンヤオも除外される', () => {
      const excluded = getExcludedYaku('other', { ittsu: 1 });
      expect(excluded).toContain('tanyao');
      expect(excluded).toContain('sanshoku');
      expect(excluded).toContain('toitoi');
      expect(excluded).toContain('sananko');
      expect(excluded).toContain('chanta');
      expect(excluded).toContain('sanshoku_doukou');
      expect(excluded).toContain('junchan');
      expect(excluded).toContain('ryanpeikou');
    });
  });

  describe('handType + 選択の複合', () => {
    test('七対子 + タンヤオ: 両方の排他が合算される', () => {
      const excluded = getExcludedYaku('chiitoitsu', { tanyao: 1 });
      // handType による排他
      expect(excluded).toContain('iipeiko');
      expect(excluded).toContain('toitoi');
      for (const id of YAKUHAI_IDS) {
        expect(excluded).toContain(id);
      }
      // 選択による排他
      expect(excluded).toContain('honitsu');
      expect(excluded).toContain('ittsu');
    });

    test('七対子 + 混老頭: 両立可能（除外されない）', () => {
      const excluded = getExcludedYaku('chiitoitsu', { honroutou: 1 });
      // honroutou自体は七対子で除外されていない
      expect(excluded).not.toContain('honroutou');
    });
  });

  describe('未選択の役は排他を発生させない', () => {
    test('値が0の役は排他を発生させない', () => {
      const excluded = getExcludedYaku('other', { tanyao: 0 });
      for (const id of YAKUHAI_IDS) {
        expect(excluded).not.toContain(id);
      }
      expect(excluded).not.toContain('honitsu');
    });
  });
});

describe('getConflictingYaku', () => {
  test('タンヤオの競合: 役牌・混一色・一気通貫・チャンタ・小三元・混老頭・純チャン', () => {
    const conflicts = getConflictingYaku('tanyao');
    for (const id of YAKUHAI_IDS) {
      expect(conflicts).toContain(id);
    }
    expect(conflicts).toContain('honitsu');
    expect(conflicts).toContain('ittsu');
    expect(conflicts).toContain('chanta');
    expect(conflicts).toContain('shousangen');
    expect(conflicts).toContain('honroutou');
    expect(conflicts).toContain('junchan');
    // 5 yakuhai + honitsu + ittsu + chanta + shousangen + honroutou + junchan = 11
    expect(conflicts).toHaveLength(11);
  });

  test('白の競合: タンヤオ・清一色・純チャン・二盃口', () => {
    const conflicts = getConflictingYaku('haku');
    expect(conflicts).toContain('tanyao');
    expect(conflicts).toContain('chinitsu');
    expect(conflicts).toContain('junchan');
    expect(conflicts).toContain('ryanpeikou');
    expect(conflicts).toHaveLength(4);
  });

  test('場風の競合: タンヤオ・清一色・純チャン・二盃口', () => {
    const conflicts = getConflictingYaku('bakaze');
    expect(conflicts).toContain('tanyao');
    expect(conflicts).toContain('chinitsu');
    expect(conflicts).toContain('junchan');
    expect(conflicts).toContain('ryanpeikou');
    expect(conflicts).toHaveLength(4);
  });

  test('対々和の競合: 順子系の役', () => {
    const conflicts = getConflictingYaku('toitoi');
    expect(conflicts).toContain('iipeiko');
    expect(conflicts).toContain('sanshoku');
    expect(conflicts).toContain('ittsu');
    expect(conflicts).toContain('ryanpeikou');
    expect(conflicts).toHaveLength(4);
  });

  test('海底/河底の競合: 嶺上開花・搶槓', () => {
    const conflicts = getConflictingYaku('haitei');
    expect(conflicts).toContain('rinshan');
    expect(conflicts).toContain('chankan');
    expect(conflicts).toHaveLength(2);
  });

  test('排他ルールのない役: 空配列', () => {
    const conflicts = getConflictingYaku('ippatsu');
    expect(conflicts).toEqual([]);
  });

  test('二盃口の競合数', () => {
    const conflicts = getConflictingYaku('ryanpeikou');
    expect(conflicts).toContain('iipeiko');
    expect(conflicts).toContain('toitoi');
    expect(conflicts).toContain('sananko');
    expect(conflicts).toContain('sanshoku');
    expect(conflicts).toContain('ittsu');
    for (const id of YAKUHAI_IDS) {
      expect(conflicts).toContain(id);
    }
    expect(conflicts).toContain('sanshoku_doukou');
    expect(conflicts).toContain('shousangen');
    expect(conflicts).toContain('honroutou');
    // iipeiko + toitoi + sananko + sanshoku + ittsu + 5 yakuhai + sanshoku_doukou + shousangen + honroutou = 13
    expect(conflicts).toHaveLength(13);
  });

  test('ダブルリーチの競合: リーチのみ', () => {
    const conflicts = getConflictingYaku('double_riichi');
    expect(conflicts).toEqual(['riichi']);
  });
});
