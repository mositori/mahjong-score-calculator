import { useReducer } from 'react';
import { StepDealer } from './components/StepDealer';
import { StepWinType } from './components/StepWinType';
import { StepHan } from './components/StepHan';
import { StepFu } from './components/StepFu';
import { ResultView } from './components/ResultView';
import './App.css';

type State = {
  step: number;
  isDealer: boolean | null;
  isTsumo: boolean | null;
  han: number | null;
  fu: number | null;
};

type Action =
  | { type: 'SET_DEALER'; isDealer: boolean }
  | { type: 'SET_WIN_TYPE'; isTsumo: boolean }
  | { type: 'SET_HAN'; han: number }
  | { type: 'SET_FU'; fu: number }
  | { type: 'RESET' };

const initialState: State = { step: 1, isDealer: null, isTsumo: null, han: null, fu: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_DEALER':
      return { ...state, step: 2, isDealer: action.isDealer };
    case 'SET_WIN_TYPE':
      return { ...state, step: 3, isTsumo: action.isTsumo };
    case 'SET_HAN':
      if (action.han >= 5) {
        return { ...state, step: 5, han: action.han, fu: 30 };
      }
      return { ...state, step: 4, han: action.han };
    case 'SET_FU':
      return { ...state, step: 5, fu: action.fu };
    case 'RESET':
      return initialState;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const totalSteps = state.han != null && state.han >= 5 ? 3 : 4;
  const displayStep = Math.min(state.step, totalSteps);

  return (
    <div className="app">
      <h1 className="app-title">麻雀点数計算</h1>

      {state.step < 5 && (
        <div className="progress">Q{displayStep} / {totalSteps}</div>
      )}

      {state.step === 1 && (
        <StepDealer onSelect={(isDealer) => dispatch({ type: 'SET_DEALER', isDealer })} />
      )}
      {state.step === 2 && (
        <StepWinType onSelect={(isTsumo) => dispatch({ type: 'SET_WIN_TYPE', isTsumo })} />
      )}
      {state.step === 3 && (
        <StepHan onSelect={(han) => dispatch({ type: 'SET_HAN', han })} />
      )}
      {state.step === 4 && (
        <StepFu onSelect={(fu) => dispatch({ type: 'SET_FU', fu })} />
      )}
      {state.step === 5 && state.isDealer != null && state.isTsumo != null && state.han != null && state.fu != null && (
        <ResultView
          isDealer={state.isDealer}
          isTsumo={state.isTsumo}
          han={state.han}
          fu={state.fu}
          onReset={() => dispatch({ type: 'RESET' })}
        />
      )}
    </div>
  );
}

export default App;
