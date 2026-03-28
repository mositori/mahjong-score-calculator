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

/**
 * 牌を面子（3枚以上）と雀頭（2枚）に分けて2行表示。
 * 牌サイズは「最大4面子（12枚）+ gap」が収まるよう、コンテナ幅に対する比率で統一。
 */
export function TileDisplay({ example }: Props) {
  const groups = example.split(' ').filter(Boolean);
  const triplets = groups.filter((g) => parseTiles(g).length >= 3);
  const pairs = groups.filter((g) => parseTiles(g).length < 3);

  // 最大4グループ×3枚=12枚 + gap(グループ間6px×3 + グループ内1px×8 = 26px) が収まる幅
  const tileWidth = 'calc((100% - 26px) / 12)';

  const renderRow = (rowGroups: string[]) => {
    const items: { tile: string; marginLeft: number }[] = [];
    rowGroups.forEach((group, gi) => {
      parseTiles(group).forEach((tile, ti) => {
        items.push({
          tile,
          marginLeft: gi === 0 && ti === 0 ? 0 : ti === 0 ? 6 : 1,
        });
      });
    });

    return (
      <div className="flex items-end">
        {items.map(({ tile, marginLeft }, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{ width: tileWidth, marginLeft }}
          >
            <MahjongTile tile={tile} size="h-auto w-full" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1 mt-1">
      {pairs.length > 0 && renderRow(pairs)}
      {triplets.length > 0 && renderRow(triplets)}
    </div>
  );
}
