import { Button } from './ui/button';

type Props = {
  honba: number;
  onHonbaChange: (honba: number) => void;
  onSelect: (isDealer: boolean) => void;
};

export function StepDealer({ honba, onHonbaChange, onSelect }: Props) {
  return (
    <>
      <h2 className="text-xl font-bold text-center mb-6">親ですか？子ですか？</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-16 text-xl font-bold" onClick={() => onSelect(true)}>親</Button>
        <Button variant="outline" className="h-16 text-xl font-bold" onClick={() => onSelect(false)}>子</Button>
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <span className="text-sm text-muted-foreground">本場</span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 text-lg"
          disabled={honba === 0}
          onClick={() => onHonbaChange(honba - 1)}
        >
          −
        </Button>
        <span className="text-lg font-bold tabular-nums w-6 text-center">{honba}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 text-lg"
          onClick={() => onHonbaChange(honba + 1)}
        >
          +
        </Button>
      </div>
    </>
  );
}
