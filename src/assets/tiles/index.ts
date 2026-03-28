// 萬子 (Man)
import Man1 from './Man1.svg';
import Man2 from './Man2.svg';
import Man3 from './Man3.svg';
import Man4 from './Man4.svg';
import Man5 from './Man5.svg';
import Man6 from './Man6.svg';
import Man7 from './Man7.svg';
import Man8 from './Man8.svg';
import Man9 from './Man9.svg';

// 筒子 (Pin)
import Pin1 from './Pin1.svg';
import Pin2 from './Pin2.svg';
import Pin3 from './Pin3.svg';
import Pin4 from './Pin4.svg';
import Pin5 from './Pin5.svg';
import Pin6 from './Pin6.svg';
import Pin7 from './Pin7.svg';
import Pin8 from './Pin8.svg';
import Pin9 from './Pin9.svg';

// 索子 (Sou)
import Sou1 from './Sou1.svg';
import Sou2 from './Sou2.svg';
import Sou3 from './Sou3.svg';
import Sou4 from './Sou4.svg';
import Sou5 from './Sou5.svg';
import Sou6 from './Sou6.svg';
import Sou7 from './Sou7.svg';
import Sou8 from './Sou8.svg';
import Sou9 from './Sou9.svg';

// 字牌 (Honor)
import Ton from './Ton.svg';     // 東 (1z)
import Nan from './Nan.svg';     // 南 (2z)
import Shaa from './Shaa.svg';   // 西 (3z)
import Pei from './Pei.svg';     // 北 (4z)
import Haku from './Haku.svg';   // 白 (5z)
import Hatsu from './Hatsu.svg'; // 發 (6z)
import Chun from './Chun.svg';   // 中 (7z)

/**
 * 牌コード → SVGパスのマッピング
 * 表記: {数字}{スーツ} — m=萬子, p=筒子, s=索子, z=字牌(1-7: 東南西北白發中)
 */
export const tileImages: Record<string, string> = {
  // 萬子
  '1m': Man1, '2m': Man2, '3m': Man3, '4m': Man4, '5m': Man5,
  '6m': Man6, '7m': Man7, '8m': Man8, '9m': Man9,
  // 筒子
  '1p': Pin1, '2p': Pin2, '3p': Pin3, '4p': Pin4, '5p': Pin5,
  '6p': Pin6, '7p': Pin7, '8p': Pin8, '9p': Pin9,
  // 索子
  '1s': Sou1, '2s': Sou2, '3s': Sou3, '4s': Sou4, '5s': Sou5,
  '6s': Sou6, '7s': Sou7, '8s': Sou8, '9s': Sou9,
  // 字牌
  '1z': Ton, '2z': Nan, '3z': Shaa, '4z': Pei,
  '5z': Haku, '6z': Hatsu, '7z': Chun,
};
