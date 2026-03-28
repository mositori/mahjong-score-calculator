import { Button } from './ui/button';

type Props = {
  onSelect: (isTsumo: boolean) => void;
};

export function StepWinType({ onSelect }: Props) {
  return (
    <>
      <h2 className="text-xl font-bold text-center mb-6">ツモですか？ロンですか？</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-16 text-xl font-bold" onClick={() => onSelect(true)}>ツモ</Button>
        <Button variant="outline" className="h-16 text-xl font-bold" onClick={() => onSelect(false)}>ロン</Button>
      </div>
    </>
  );
}
