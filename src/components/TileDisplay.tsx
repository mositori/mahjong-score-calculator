import { MahjongTile } from './MahjongTile';

type Props = {
  /** 牌の例示文字列（例: "2m3m4m 3p4p5p 7z7z7z 1m1m"） */
  example: string;
};

/** "2m3m4m" → ["2m", "3m", "4m"] */
function parseTiles(group: string): string[] {
  const tiles: string[] = [];
  for (let i = 0; i < group.length - 1; i += 2) {
    tiles.push(group[i] + group[i + 1]);
  }
  return tiles;
}

export function TileDisplay({ example }: Props) {
  const groups = example.split(' ').filter(Boolean);

  return (
    <div className="flex items-end gap-1.5 mt-1">
      {groups.map((group, gi) => (
        <div key={gi} className="flex">
          {parseTiles(group).map((tile, ti) => (
            <MahjongTile key={ti} tile={tile} />
          ))}
        </div>
      ))}
    </div>
  );
}
