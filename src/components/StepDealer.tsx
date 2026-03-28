import { Button } from './ui/button';

type Props = {
  onSelect: (isDealer: boolean) => void;
};

export function StepDealer({ onSelect }: Props) {
  return (
    <>
      <h2 className="text-xl font-bold text-center mb-6">親ですか？子ですか？</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-16 text-xl font-bold" onClick={() => onSelect(true)}>親</Button>
        <Button variant="outline" className="h-16 text-xl font-bold" onClick={() => onSelect(false)}>子</Button>
      </div>
    </>
  );
}
