import { Button } from './ui/button';

type Props = {
  onSelect: (isDealer: boolean) => void;
};

export function StepDealer({ onSelect }: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
      <h2 className="text-xl font-bold text-center mb-5">親ですか？子ですか？</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" className="text-lg" onClick={() => onSelect(true)}>親</Button>
        <Button variant="outline" size="lg" className="text-lg" onClick={() => onSelect(false)}>子</Button>
      </div>
    </div>
  );
}
