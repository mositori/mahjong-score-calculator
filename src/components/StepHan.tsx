import { OptionButton } from './OptionButton';

type Props = {
  onSelect: (han: number) => void;
};

const hanOptions: { label: string; value: number }[] = [
  { label: '1翻', value: 1 },
  { label: '2翻', value: 2 },
  { label: '3翻', value: 3 },
  { label: '4翻', value: 4 },
  { label: '5翻', value: 5 },
  { label: '6〜7翻', value: 6 },
  { label: '8〜10翻', value: 8 },
  { label: '11〜12翻', value: 11 },
  { label: '13翻以上', value: 13 },
];

export function StepHan({ onSelect }: Props) {
  return (
    <div className="step">
      <h2 className="step-question">翻数は？</h2>
      <div className="step-options three-col">
        {hanOptions.map((opt) => (
          <OptionButton key={opt.value} label={opt.label} onClick={() => onSelect(opt.value)} />
        ))}
      </div>
    </div>
  );
}
