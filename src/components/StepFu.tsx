import { OptionButton } from './OptionButton';

type Props = {
  onSelect: (fu: number) => void;
};

const fuOptions = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

export function StepFu({ onSelect }: Props) {
  return (
    <div className="step">
      <h2 className="step-question">符数は？</h2>
      <div className="step-options three-col">
        {fuOptions.map((fu) => (
          <OptionButton key={fu} label={`${fu}符`} onClick={() => onSelect(fu)} />
        ))}
      </div>
    </div>
  );
}
