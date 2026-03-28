export type YakuDef = {
  id: string;
  name: string;
  description: string;
  han: number;
  kuisagari: number; // 食い下がり時の翻数（0なら門前のみ）
  type: 'toggle' | 'counter';
  maxCount?: number; // counterの場合の最大値
  condition?: 'menzen' | 'riichi'; // 表示条件
  example?: string; // 牌の例示（スペース区切りで面子グループ、例: "2m3m4m 2p3p4p"）
};

export const yakuList: YakuDef[] = [
  // 基本役
  { id: 'riichi', name: 'リーチ', description: '宣言してから上がった', han: 1, kuisagari: 0, type: 'toggle', condition: 'menzen' },
  { id: 'ippatsu', name: '一発', description: 'リーチ後1巡以内に上がった', han: 1, kuisagari: 0, type: 'toggle', condition: 'riichi' },
  { id: 'tanyao', name: 'タンヤオ', description: '1・9・字牌がない', han: 1, kuisagari: 1, type: 'toggle', example: '2m3m4m 3p4p5p 4s5s6s 7s7s7s 8p8p' },
  { id: 'yakuhai', name: '役牌', description: '白・發・中・場風・自風', han: 1, kuisagari: 1, type: 'counter', maxCount: 4, example: '5z5z5z' },
  { id: 'iipeiko', name: '一盃口', description: '同じ順子が2組ある', han: 1, kuisagari: 0, type: 'toggle', condition: 'menzen', example: '3p3p4p4p5p5p' },

  // 2翻役
  { id: 'sanshoku', name: '三色同順', description: '3色で同じ数の順子', han: 2, kuisagari: 1, type: 'toggle', example: '4m5m6m 4p5p6p 4s5s6s' },
  { id: 'ittsu', name: '一気通貫', description: '同じ色で1〜9', han: 2, kuisagari: 1, type: 'toggle', example: '1m2m3m 4m5m6m 7m8m9m' },
  { id: 'toitoi', name: '対々和', description: 'すべて刻子', han: 2, kuisagari: 2, type: 'toggle', example: '3m3m3m 5p5p5p 9s9s9s 2z2z2z 7p7p' },
  { id: 'sananko', name: '三暗刻', description: '暗刻が3つ', han: 2, kuisagari: 2, type: 'toggle', example: '1m1m1m 5p5p5p 9s9s9s' },

  // 3翻以上
  { id: 'honitsu', name: '混一色', description: '1色＋字牌のみ', han: 3, kuisagari: 2, type: 'toggle', example: '1m2m3m 5m6m7m 9m9m9m 1z1z1z 3z3z' },
  { id: 'chinitsu', name: '清一色', description: '1色のみ', han: 6, kuisagari: 5, type: 'toggle', example: '1m2m3m 3m4m5m 6m7m8m 9m9m9m 1m1m' },

  // 特殊
  { id: 'haitei', name: '海底/河底', description: '最後の牌で上がった', han: 1, kuisagari: 1, type: 'toggle' },
  { id: 'rinshan', name: '嶺上開花', description: 'カンした後に上がった', han: 1, kuisagari: 1, type: 'toggle' },
];

export type DoraDef = {
  id: string;
  name: string;
  maxCount: number;
  condition?: 'riichi';
};

export const doraList: DoraDef[] = [
  { id: 'dora', name: 'ドラ', maxCount: 12 },
  { id: 'uraDora', name: '裏ドラ', maxCount: 12, condition: 'riichi' },
];

export function calculateYakuHan(
  selection: Record<string, number>,
  isMenzen: boolean,
): number {
  let total = 0;

  for (const yaku of yakuList) {
    const value = selection[yaku.id] ?? 0;
    if (value <= 0) continue;

    if (yaku.type === 'toggle') {
      const han = isMenzen ? yaku.han : yaku.kuisagari;
      if (han > 0) total += han;
    } else {
      // counter (役牌 etc.)
      const han = isMenzen ? yaku.han : yaku.kuisagari;
      if (han > 0) total += han * value;
    }
  }

  for (const dora of doraList) {
    total += selection[dora.id] ?? 0;
  }

  return total;
}
