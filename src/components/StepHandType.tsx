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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
      <h2 className="text-xl font-bold text-center mb-5">手の形は？</h2>
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <Button
            key={opt.value}
            variant="outline"
            size="lg"
            className="justify-start text-left h-auto py-3 px-4"
            onClick={() => onSelect(opt.value)}
          >
            <div>
              <div className="text-base font-bold">{opt.label}</div>
              <div className="text-xs text-muted-foreground font-normal">{opt.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
