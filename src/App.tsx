import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { State, Action, HandType, FuInputData } from './types';

import { calculateFu } from './logic/fuCalculator';
import { calculateYakuHan, yakuList, doraList } from './logic/yakuList';
import { StepDealer } from './components/StepDealer';
import { StepWinType } from './components/StepWinType';
import { StepHandType } from './components/StepHandType';
import { StepMenzen } from './components/StepMenzen';
import { StepFuInput } from './components/StepFuInput';
import { StepYakuSelect } from './components/StepYakuSelect';
import { ResultView } from './components/ResultView';
import { ProgressBar } from './components/ProgressBar';
import { SelectionSummary } from './components/SelectionSummary';
import { Button } from './components/ui/button';

const initialState: State = {
  step: 'dealer',
  stepHistory: [],
  stepKey: 0,
  transitionDirection: 'forward',
  isDealer: null,
  isTsumo: null,
  handType: null,
  isMenzen: true,
  fuInputData: null,
  yakuSelection: null,
  honba: 0,
};

function reducer(state: State, action: Action): State {
  const pushStep = (nextStep: State['step'], updates: Partial<State>): State => ({
    ...state,
    ...updates,
    step: nextStep,
    stepHistory: [...state.stepHistory, state.step],
    stepKey: state.stepKey + 1,
    transitionDirection: 'forward',
  });

  switch (action.type) {
    case 'SET_HONBA':
      return { ...state, honba: action.honba };

    case 'SET_DEALER':
      return pushStep('winType', { isDealer: action.isDealer });

    case 'SET_WIN_TYPE':
      return pushStep('handType', { isTsumo: action.isTsumo });

    case 'SET_HAND_TYPE':
      if (action.handType === 'yakuman') {
        return pushStep('result', { handType: 'yakuman', isMenzen: true });
      }
      if (action.handType === 'chiitoitsu') {
        return pushStep('yakuSelect', { handType: 'chiitoitsu', isMenzen: true });
      }
      if (action.handType === 'pinfu') {
        return pushStep('yakuSelect', { handType: 'pinfu', isMenzen: true });
      }
      return pushStep('menzen', { handType: 'other' });

    case 'SET_MENZEN':
      return pushStep('fuInput', { isMenzen: action.isMenzen });

    case 'SET_FU_INPUT':
      return pushStep('yakuSelect', { fuInputData: action.data });

    case 'SET_YAKU':
      return pushStep('result', { yakuSelection: action.selection });

    case 'BACK': {
      if (state.stepHistory.length === 0) return state;
      const history = [...state.stepHistory];
      const prevStep = history.pop()!;
      return {
        ...state,
        step: prevStep,
        stepHistory: history,
        stepKey: state.stepKey + 1,
        transitionDirection: 'back',
      };
    }

    case 'RESET':
      return { ...initialState, stepKey: state.stepKey + 1 };

    case 'RESET_KEEP_DEALER':
      return {
        ...initialState,
        step: 'winType',
        stepHistory: ['dealer'],
        stepKey: state.stepKey + 1,
        transitionDirection: 'forward',
        isDealer: state.isDealer,
        honba: state.honba + 1,
      };
  }
}

function computeResult(state: State): { han: number; fu: number; breakdown: string[] } {
  const breakdown: string[] = [];

  if (state.handType === 'yakuman') {
    return { han: 13, fu: 30, breakdown: ['役満'] };
  }

  let han = 0;

  // 手の形による翻
  if (state.handType === 'chiitoitsu') {
    han += 2;
    breakdown.push('七対子(2翻)');
  }
  if (state.handType === 'pinfu') {
    han += 1;
    breakdown.push('ピンフ(1翻)');
  }

  // 門前清自摸和
  if (state.isMenzen && state.isTsumo) {
    han += 1;
    breakdown.push('門前ツモ(1翻)');
  }

  // 役の選択から翻数
  if (state.yakuSelection) {
    const yakuHan = calculateYakuHan(state.yakuSelection, state.isMenzen);
    han += yakuHan;

    // 内訳
    for (const yaku of yakuList) {
      const value = state.yakuSelection[yaku.id] ?? 0;
      if (value <= 0) continue;
      const h = state.isMenzen ? yaku.han : yaku.kuisagari;
      if (h <= 0) continue;
      breakdown.push(
        yaku.type === 'counter'
          ? `${yaku.name}×${value}(${h * value}翻)`
          : `${yaku.name}(${h}翻)`,
      );
    }
    for (const d of doraList) {
      const value = state.yakuSelection[d.id] ?? 0;
      if (value > 0) {
        breakdown.push(`${d.name}(${value}翻)`);
      }
    }
  }

  // 符の計算
  const fu = calculateFu({
    isTsumo: state.isTsumo ?? false,
    isMenzen: state.isMenzen,
    isChiitoitsu: state.handType === 'chiitoitsu',
    isPinfu: state.handType === 'pinfu',
    waitType: state.fuInputData?.waitType ?? 'open',
    isYakuhaiHead: state.fuInputData?.isYakuhaiHead ?? false,
    mentsuFu: state.fuInputData?.mentsuFu ?? 0,
  });

  return { han, fu, breakdown };
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const shouldReduceMotion = useReducedMotion();
  const stepContainerRef = useRef<HTMLDivElement>(null);

  // ステップ切り替え時にトップへスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.stepKey]);

  const showBack = state.stepHistory.length > 0 && state.step !== 'result';
  const isForward = state.transitionDirection === 'forward';
  const resultData = useMemo(() => {
    if (state.step !== 'result' || state.isDealer == null || state.isTsumo == null) return null;
    return { ...computeResult(state), isDealer: state.isDealer, isTsumo: state.isTsumo };
  }, [state]);

  // useCallback for dispatch wrappers to stabilize references for memoized children
  const handleSetHonba = useCallback((honba: number) => dispatch({ type: 'SET_HONBA', honba }), []);
  const handleSetDealer = useCallback((isDealer: boolean) => dispatch({ type: 'SET_DEALER', isDealer }), []);
  const handleSetWinType = useCallback((isTsumo: boolean) => dispatch({ type: 'SET_WIN_TYPE', isTsumo }), []);
  const handleSetHandType = useCallback((handType: HandType) => dispatch({ type: 'SET_HAND_TYPE', handType }), []);
  const handleSetMenzen = useCallback((isMenzen: boolean) => dispatch({ type: 'SET_MENZEN', isMenzen }), []);
  const handleSetFuInput = useCallback((data: FuInputData) => dispatch({ type: 'SET_FU_INPUT', data }), []);
  const handleSetYaku = useCallback((selection: Record<string, number>) => dispatch({ type: 'SET_YAKU', selection }), []);
  const handleBack = useCallback(() => dispatch({ type: 'BACK' }), []);
  const handleReset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const handleResetKeepDealer = useCallback(() => dispatch({ type: 'RESET_KEEP_DEALER' }), []);

  const slideVariants = shouldReduceMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, x: isForward ? 40 : -40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: isForward ? -40 : 40 },
      };

  return (
    <div className="max-w-md mx-auto px-5 py-8 min-h-svh flex flex-col">
      <motion.h1
        className="text-2xl font-bold text-center text-primary mb-4"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
      >
        麻雀点数計算
      </motion.h1>

      {state.step !== 'result' && (
        <ProgressBar step={state.step} handType={state.handType} />
      )}

      {state.step !== 'dealer' && state.step !== 'result' && (
        <SelectionSummary state={state} />
      )}

      <AnimatePresence mode="wait" initial={false}>
        {showBack && (
          <motion.div
            key="back-button"
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 35 }}
          >
            <Button variant="ghost" size="sm" className="mb-3 text-muted-foreground" onClick={handleBack}>
              ← 戻る
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={stepContainerRef} className="flex-1 flex flex-col">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={state.stepKey}
          className="flex-1 flex flex-col"
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
        >
          {state.step === 'dealer' && (
            <StepDealer
              honba={state.honba}
              onHonbaChange={handleSetHonba}
              onSelect={handleSetDealer}
            />
          )}

          {state.step === 'winType' && (
            <StepWinType
              onSelect={handleSetWinType}
            />
          )}

          {state.step === 'handType' && (
            <StepHandType onSelect={handleSetHandType} />
          )}

          {state.step === 'menzen' && (
            <StepMenzen onSelect={handleSetMenzen} />
          )}

          {state.step === 'fuInput' && (
            <StepFuInput onSubmit={handleSetFuInput} />
          )}

          {state.step === 'yakuSelect' && (
            <StepYakuSelect
              isMenzen={state.isMenzen}
              handType={state.handType}
              onSubmit={handleSetYaku}
            />
          )}

          {resultData && (
              <ResultView
                isDealer={resultData.isDealer}
                isTsumo={resultData.isTsumo}
                han={resultData.han}
                fu={resultData.fu}
                honba={state.honba}
                breakdown={resultData.breakdown}
                onBack={handleBack}
                onReset={handleReset}
                onResetKeepDealer={handleResetKeepDealer}
              />
          )}
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
