import type { StyleConfig } from '../types';

export const UKIYOE_STYLES: StyleConfig[] = [
  {
    id: 'hokusai',
    name: 'Hokusai',
    nameJa: '北斎',
    artist: '葛飾北斎',
    description: '富嶽三十六景スタイル\n大胆な波と幾何学的な構図',
    prompt:
      'ukiyo-e Japanese woodblock print style by Katsushika Hokusai, Thirty-six Views of Mount Fuji aesthetic, bold geometric waves, strong indigo blue and white contrast, dramatic composition, woodblock texture, traditional Japanese art, high detail',
    color: '#1e3a5f',
    bgColor: '#dbeafe',
  },
  {
    id: 'hiroshige',
    name: 'Hiroshige',
    nameJa: '広重',
    artist: '歌川広重',
    description: '東海道五十三次スタイル\n柔らかな風景と霞がかった山',
    prompt:
      'ukiyo-e Japanese woodblock print style by Utagawa Hiroshige, Fifty-three Stations of the Tokaido aesthetic, soft misty landscapes, delicate natural scenery, serene atmosphere, subtle color gradients, traditional Japanese nature art, woodblock texture',
    color: '#1a3d2b',
    bgColor: '#dcfce7',
  },
  {
    id: 'utamaro',
    name: 'Utamaro',
    nameJa: '歌麿',
    artist: '喜多川歌麿',
    description: '美人画スタイル\n優雅な人物と繊細な模様',
    prompt:
      'ukiyo-e Japanese woodblock print style bijinga by Kitagawa Utamaro, elegant figure portrait, detailed kimono patterns, soft pastel colors, graceful composition, close-up portrait framing, traditional Japanese beauty art, woodblock texture',
    color: '#7c1d3f',
    bgColor: '#fce7f3',
  },
  {
    id: 'sharaku',
    name: 'Sharaku',
    nameJa: '写楽',
    artist: '東洲斎写楽',
    description: '役者絵スタイル\n大胆な表情と歌舞伎の迫力',
    prompt:
      'ukiyo-e Japanese woodblock print yakusha-e style by Toshusai Sharaku, bold kabuki actor portrait, dramatic exaggerated expression, simplified geometric background, strong color contrast, powerful pose, traditional Japanese theater art, woodblock texture',
    color: '#7c1d0a',
    bgColor: '#fee2e2',
  },
];

export const JAPANESE_COLORS = [
  { name: '漆黒', hex: '#1a1a1a' },
  { name: '紺', hex: '#003153' },
  { name: '藍', hex: '#1e3a5f' },
  { name: '浅葱', hex: '#2e8b74' },
  { name: '萌黄', hex: '#4a7c42' },
  { name: '朱', hex: '#c0392b' },
  { name: '紅', hex: '#9b2335' },
  { name: '桃', hex: '#e8749a' },
  { name: '山吹', hex: '#d4a017' },
  { name: '白', hex: '#f5f0e8' },
  { name: '鳥の子', hex: '#e8dcc8' },
  { name: '茶', hex: '#7b3f00' },
];
