import { OptionButton } from './OptionButton';

type Props = {
  onSelect: (isTsumo: boolean) => void;
};

export function StepWinType({ onSelect }: Props) {
  return (
    <div className="step">
      <h2 className="step-question">ツモですか？ロンですか？</h2>
      <div className="step-options two-col">
        <OptionButton label="ツモ" onClick={() => onSelect(true)} />
        <OptionButton label="ロン" onClick={() => onSelect(false)} />
      </div>
    </div>
  );
}
