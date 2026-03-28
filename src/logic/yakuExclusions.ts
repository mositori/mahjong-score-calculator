import type { HandType } from '../types';
import { YAKUHAI_IDS } from './yakuList';

// A. handType による排他（手の形で確定的に除外）
const handTypeExclusions: Partial<Record<HandType, string[]>> = {
  chiitoitsu: [
    'iipeiko', 'sanshoku', 'ittsu', 'toitoi', 'sananko', 'rinshan',
    ...YAKUHAI_IDS,
    'chankan', 'chanta', 'sanshoku_doukou', 'shousangen', 'junchan', 'ryanpeikou',
  ],
  pinfu: [
    ...YAKUHAI_IDS, 'toitoi', 'sananko', 'rinshan',
    'chankan', 'sanshoku_doukou', 'shousangen', 'honroutou',
  ],
};

// B. 役同士の相互排他ペア
const mutualExclusions: [string, string][] = [
  // --- 既存役同士 ---
  ...YAKUHAI_IDS.map(id => ['tanyao', id] as [string, string]),
  ['tanyao', 'honitsu'],
  ['tanyao', 'ittsu'],
  ['iipeiko', 'toitoi'],
  ['iipeiko', 'sananko'],
  ['sanshoku', 'toitoi'],
  ['sanshoku', 'sananko'],
  ['sanshoku', 'ittsu'],
  ['sanshoku', 'honitsu'],
  ['sanshoku', 'chinitsu'],
  ['ittsu', 'toitoi'],
  ['ittsu', 'sananko'],
  ...YAKUHAI_IDS.map(id => [id, 'chinitsu'] as [string, string]),
  ['honitsu', 'chinitsu'],
  ['haitei', 'rinshan'],

  // --- 搶槓 ---
  ['chankan', 'haitei'],
  ['chankan', 'rinshan'],

  // --- ダブルリーチ ---
  ['double_riichi', 'riichi'],

  // --- チャンタ ---
  ['chanta', 'tanyao'],
  ['chanta', 'junchan'],
  ['chanta', 'honroutou'],
  ['chanta', 'ittsu'],

  // --- 三色同刻 ---
  ['sanshoku_doukou', 'sanshoku'],
  ['sanshoku_doukou', 'iipeiko'],
  ['sanshoku_doukou', 'ittsu'],
  ['sanshoku_doukou', 'honitsu'],
  ['sanshoku_doukou', 'chinitsu'],
  ['sanshoku_doukou', 'ryanpeikou'],

  // --- 小三元 ---
  ['shousangen', 'tanyao'],
  ['shousangen', 'chinitsu'],
  ['shousangen', 'ryanpeikou'],

  // --- 混老頭 ---
  ['honroutou', 'tanyao'],
  ['honroutou', 'iipeiko'],
  ['honroutou', 'sanshoku'],
  ['honroutou', 'ittsu'],
  ['honroutou', 'chinitsu'],
  ['honroutou', 'ryanpeikou'],

  // --- 純チャン ---
  ['junchan', 'tanyao'],
  ...YAKUHAI_IDS.map(id => ['junchan', id] as [string, string]),
  ['junchan', 'honitsu'],
  ['junchan', 'ittsu'],

  // --- 二盃口 ---
  ['ryanpeikou', 'iipeiko'],
  ['ryanpeikou', 'toitoi'],
  ['ryanpeikou', 'sananko'],
  ['ryanpeikou', 'sanshoku'],
  ['ryanpeikou', 'ittsu'],
  ...YAKUHAI_IDS.map(id => ['ryanpeikou', id] as [string, string]),
];

/** handType と現在の選択状態から、除外すべき役IDのSetを返す */
export function getExcludedYaku(
  handType: HandType | null,
  selection: Record<string, number>,
): Set<string> {
  const excluded = new Set<string>();

  if (handType && handTypeExclusions[handType]) {
    for (const id of handTypeExclusions[handType]!) {
      excluded.add(id);
    }
  }

  for (const [a, b] of mutualExclusions) {
    if ((selection[a] ?? 0) > 0) excluded.add(b);
    if ((selection[b] ?? 0) > 0) excluded.add(a);
  }

  return excluded;
}

/** 指定した役と競合する役IDの配列を返す */
export function getConflictingYaku(yakuId: string): string[] {
  const conflicts: string[] = [];
  for (const [a, b] of mutualExclusions) {
    if (a === yakuId) conflicts.push(b);
    if (b === yakuId) conflicts.push(a);
  }
  return conflicts;
}
