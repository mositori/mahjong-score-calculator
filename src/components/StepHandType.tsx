import type { HandType } from '../types';
import { OptionButton } from './OptionButton';

type Props = {
  onSelect: (handType: HandType) => void;
};

const options: { label: string; description: string; value: HandType }[] = [
  { label: '役満', description: '国士無双・四暗刻など', value: 'yakuman' },
  { label: '七対子', description: '7つの対子（トイツ）', value: 'chiitoitsu' },
  { label: 'ピンフ', description: '順子のみ・両面待ち・役牌以外の雀頭', value: 'pinfu' },
  { label: 'その他', description: '上記以外の手', value: 'other' },
];

export function StepHandType({ onSelect }: Props) {
  return (
    <div className="step">
      <h2 className="step-question">手の形は？</h2>
      <div className="step-options-list">
        {options.map((opt) => (
          <div key={opt.value} className="option-with-desc">
            <OptionButton label={opt.label} onClick={() => onSelect(opt.value)} />
            <span className="option-desc">{opt.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
