import { OptionButton } from './OptionButton';

type Props = {
  onSelect: (isDealer: boolean) => void;
};

export function StepDealer({ onSelect }: Props) {
  return (
    <div className="step">
      <h2 className="step-question">親ですか？子ですか？</h2>
      <div className="step-options two-col">
        <OptionButton label="親" onClick={() => onSelect(true)} />
        <OptionButton label="子" onClick={() => onSelect(false)} />
      </div>
    </div>
  );
}
