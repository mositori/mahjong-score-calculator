import { Button } from './ui/button';

type Props = {
  onSelect: (isMenzen: boolean) => void;
};

export function StepMenzen({ onSelect }: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
      <h2 className="text-xl font-bold text-center mb-2">門前ですか？</h2>
      <p className="text-sm text-muted-foreground text-center mb-5">
        チー・ポン・明カンしていない場合は「門前」
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" className="text-lg" onClick={() => onSelect(true)}>門前</Button>
        <Button variant="outline" size="lg" className="text-lg" onClick={() => onSelect(false)}>鳴いている</Button>
      </div>
    </div>
  );
}
