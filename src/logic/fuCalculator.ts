export type FuInput = {
  isTsumo: boolean;
  isMenzen: boolean;
  isChiitoitsu: boolean;
  isPinfu: boolean;
  waitType: 'open' | 'closed'; // open=両面/シャンポン, closed=嵌張/辺張/単騎
  isYakuhaiHead: boolean;
  mentsuFu: number;
};

export function calculateFu(input: FuInput): number {
  if (input.isChiitoitsu) return 25;
  if (input.isPinfu && input.isTsumo) return 20;
  if (input.isPinfu) return 30; // ピンフロン

  // 副底
  let fu = input.isMenzen && !input.isTsumo ? 30 : 20;

  // 待ち
  if (input.waitType === 'closed') fu += 2;

  // 雀頭
  if (input.isYakuhaiHead) fu += 2;

  // 刻子・槓子
  fu += input.mentsuFu;

  // 門前ツモ
  if (input.isTsumo && input.isMenzen) fu += 2;

  // 10符単位に切り上げ
  fu = Math.ceil(fu / 10) * 10;

  // 鳴きロンで30未満にはならない
  if (!input.isTsumo && fu < 30) fu = 30;

  return fu;
}
