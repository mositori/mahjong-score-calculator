import type { HandType } from '../types';

// A. handType による排他（手の形で確定的に除外）
const handTypeExclusions: Partial<Record<HandType, string[]>> = {
  chiitoitsu: ['iipeiko', 'sanshoku', 'ittsu', 'toitoi', 'sananko', 'rinshan', 'yakuhai'],
  pinfu: ['yakuhai', 'toitoi', 'sananko', 'rinshan'],
};

// B. 役同士の相互排他ペア
const mutualExclusions: [string, string][] = [
  ['tanyao', 'yakuhai'],
  ['tanyao', 'honitsu'],
  ['iipeiko', 'toitoi'],
  ['iipeiko', 'sananko'],
  ['sanshoku', 'toitoi'],
  ['sanshoku', 'sananko'],
  ['sanshoku', 'ittsu'],
  ['ittsu', 'toitoi'],
  ['ittsu', 'sananko'],
  ['honitsu', 'chinitsu'],
  ['haitei', 'rinshan'],
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
