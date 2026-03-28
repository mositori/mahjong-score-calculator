import { OptionButton } from './OptionButton';

type Props = {
  onSelect: (isMenzen: boolean) => void;
};

export function StepMenzen({ onSelect }: Props) {
  return (
    <div className="step">
      <h2 className="step-question">門前ですか？</h2>
      <p className="step-hint">チー・ポン・明カンしていない場合は「門前」</p>
      <div className="step-options two-col">
        <OptionButton label="門前" onClick={() => onSelect(true)} />
        <OptionButton label="鳴いている" onClick={() => onSelect(false)} />
      </div>
    </div>
  );
}
