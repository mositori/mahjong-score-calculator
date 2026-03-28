import type { HandType } from '../types';
import { Button } from './ui/button';

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
    <div className="step-animate">
      <h2 className="text-xl font-bold text-center mb-5">手の形は？</h2>
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <Button
            key={opt.value}
            variant="outline"
            size="lg"
            className="justify-start text-left h-auto py-4 px-5"
            onClick={() => onSelect(opt.value)}
          >
            <div>
              <div className="text-base font-bold">{opt.label}</div>
              <div className="text-xs text-muted-foreground font-normal mt-0.5">{opt.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
