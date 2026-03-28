import { Button } from './ui/button';

type Props = {
  onSelect: (isTsumo: boolean) => void;
};

export function StepWinType({ onSelect }: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
      <h2 className="text-xl font-bold text-center mb-5">ツモですか？ロンですか？</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" className="text-lg" onClick={() => onSelect(true)}>ツモ</Button>
        <Button variant="outline" size="lg" className="text-lg" onClick={() => onSelect(false)}>ロン</Button>
      </div>
    </div>
  );
}
