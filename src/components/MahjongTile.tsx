import { tileImages } from '@/assets/tiles';
import { cn } from '@/lib/utils';

type Props = {
  /** 牌コード（例: "1m", "5z", "7p"） */
  tile: string;
  /** 高さクラス（デフォルト: "h-8"） */
  size?: string;
  className?: string;
};

export function MahjongTile({ tile, size = 'h-8', className }: Props) {
  const src = tileImages[tile];
  if (!src) return null;

  return (
    <img
      src={src}
      alt={tile}
      className={cn(size, 'w-auto', className)}
      draggable={false}
    />
  );
}
