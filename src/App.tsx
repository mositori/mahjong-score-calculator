import { useReducer } from 'react';
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
      if (yaku.type === 'counter' && value > 0) {
        breakdown.push(`${yaku.name}×${value}(${h * value}翻)`);
      } else {
        breakdown.push(`${yaku.name}(${h}翻)`);
      }
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

  const showBack = state.stepHistory.length > 0 && state.step !== 'result';
  const isForward = state.transitionDirection === 'forward';

  const slideVariants = shouldReduceMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, x: isForward ? 40 : -40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: isForward ? -40 : 40 },
      };

  return (
    <div className="max-w-md mx-auto px-5 py-8">
      <motion.h1
        className="text-2xl font-bold text-center text-primary mb-4"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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
            transition={{ duration: 0.15 }}
          >
            <Button variant="ghost" size="sm" className="mb-3 text-muted-foreground" onClick={() => dispatch({ type: 'BACK' })}>
              ← 戻る
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={state.stepKey}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          {state.step === 'dealer' && (
            <StepDealer
              honba={state.honba}
              onHonbaChange={(honba) => dispatch({ type: 'SET_HONBA', honba })}
              onSelect={(isDealer) => dispatch({ type: 'SET_DEALER', isDealer })}
            />
          )}

          {state.step === 'winType' && (
            <StepWinType
              onSelect={(isTsumo) => dispatch({ type: 'SET_WIN_TYPE', isTsumo })}
            />
          )}

          {state.step === 'handType' && (
            <StepHandType onSelect={(handType: HandType) => dispatch({ type: 'SET_HAND_TYPE', handType })} />
          )}

          {state.step === 'menzen' && (
            <StepMenzen onSelect={(isMenzen) => dispatch({ type: 'SET_MENZEN', isMenzen })} />
          )}

          {state.step === 'fuInput' && (
            <StepFuInput onSubmit={(data: FuInputData) => dispatch({ type: 'SET_FU_INPUT', data })} />
          )}

          {state.step === 'yakuSelect' && (
            <StepYakuSelect
              isMenzen={state.isMenzen}
              handType={state.handType}
              onSubmit={(selection) => dispatch({ type: 'SET_YAKU', selection })}
            />
          )}

          {state.step === 'result' && state.isDealer != null && state.isTsumo != null && (() => {
            const { han, fu, breakdown } = computeResult(state);
            return (
              <ResultView
                isDealer={state.isDealer!}
                isTsumo={state.isTsumo!}
                han={han}
                fu={fu}
                honba={state.honba}
                breakdown={breakdown}
                onBack={() => dispatch({ type: 'BACK' })}
                onReset={() => dispatch({ type: 'RESET' })}
                onResetKeepDealer={() => dispatch({ type: 'RESET_KEEP_DEALER' })}
              />
            );
          })()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
