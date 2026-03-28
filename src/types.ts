export type ScoreResult = {
  tierName: string | null;
  ronPayment: number | null;
  tsumoPaymentDealer: number | null;
  tsumoPaymentNonDealer: number | null;
};

export type HandType = 'yakuman' | 'chiitoitsu' | 'pinfu' | 'other';

export type Step = 'dealer' | 'winType' | 'handType' | 'menzen'
  | 'fuInput' | 'yakuSelect' | 'result';

export type FuInputData = {
  waitType: 'open' | 'closed';
  isYakuhaiHead: boolean;
  mentsuFu: number;
};

export type State = {
  step: Step;
  stepHistory: Step[];
  stepKey: number;
  transitionDirection: 'forward' | 'back';
  isDealer: boolean | null;
  isTsumo: boolean | null;
  handType: HandType | null;
  isMenzen: boolean;
  fuInputData: FuInputData | null;
  yakuSelection: Record<string, number> | null;
};

export type Action =
  | { type: 'SET_DEALER'; isDealer: boolean }
  | { type: 'SET_WIN_TYPE'; isTsumo: boolean }
  | { type: 'SET_HAND_TYPE'; handType: HandType }
  | { type: 'SET_MENZEN'; isMenzen: boolean }
  | { type: 'SET_FU_INPUT'; data: FuInputData }
  | { type: 'SET_YAKU'; selection: Record<string, number> }
  | { type: 'BACK' }
  | { type: 'RESET' }
  | { type: 'RESET_KEEP_DEALER' };
