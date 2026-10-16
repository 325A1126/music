import merchTeeImg from '../assets/images/rock_tour_merch_1792126878554.jpg';
import guitarDetailImg from '../assets/images/rock_electric_guitar_1792126878877.jpg';
import crowdLiveImg from '../assets/images/rock_livehouse_crowd_1792126879278.jpg';

export interface LyricLine {
  id: number;
  start: number; // in seconds
  end: number;
  text: string;
  subText?: string;
  isChorus?: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string;
  tag: string;
  lyrics: LyricLine[];
}

export interface TourDate {
  id: string;
  date: string;
  city: string;
  venue: string;
  doors: string;
  status: 'available' | 'few' | 'soldout';
  ticketPrice: string;
}

export interface MerchItem {
  id: string;
  name: string;
  category: string;
  price: number;
  tag: string;
  image: string;
  description: string;
  sizes?: string[];
}

export const TRACK_LIST: Track[] = [
  {
    id: 'reclaim-the-day',
    title: '僕らの今日を取り返せ',
    artist: 'TOKYO RIOT',
    bpm: 185,
    key: 'E minor',
    duration: '01:46',
    tag: 'FEATURED SINGLE',
    lyrics: [
      { id: 1, start: 0, end: 8, text: '(GUITAR INTRO // POWER CHORDS IGNITION)', subText: '激しいディストーションとドラムの疾走' },
      { id: 2, start: 8, end: 13, text: '錆びたフェンスを蹴って 始発前の道を行く', subText: 'ポケットの残り小銭鳴らし' },
      { id: 3, start: 13, end: 17, text: 'ポケットの残り小銭鳴らし 昨日の言い訳を捨てた', subText: '冷たい朝の風を切り裂いて' },
      { id: 4, start: 17, end: 26, text: '無理だと笑う声 塞ぐ声を 背中で振り切って！', subText: '嘲笑を加速のエネルギーに変えろ' },
      { id: 5, start: 26, end: 35, text: 'まだ終われない！ここからだ！転んだ傷も連れて行け！', subText: '声を合わせて 壁を越えろ', isChorus: true },
      { id: 6, start: 35, end: 44, text: '声を合わせて 壁を越えろ 僕らの今日を取り返せ！', subText: '今この瞬間を奪い返す', isChorus: true },
      { id: 7, start: 44, end: 53, text: '(INTERLUDE // HIGH VOLTAGE GUITAR SOLO)', subText: '狂乱のリードギター・ソロ' },
      { id: 8, start: 53, end: 58, text: '破れた靴のかかと 雨上がりに泥がつく', subText: '足跡など消えても構わない' },
      { id: 9, start: 58, end: 62, text: '遠回りでもいいさ 選んだ道なら進め', subText: '誰の敷いたレールでもない' },
      { id: 10, start: 62, end: 70, text: '小さな火を守って 風の中を走れ！', subText: '胸の中の火花を絶やすな' },
      { id: 11, start: 70, end: 79, text: 'まだ終われない！ここからだ！転んだ傷も連れて行け！', subText: '声を合わせて 壁を越えろ', isChorus: true },
      { id: 12, start: 79, end: 89, text: '声を合わせて 壁を越えろ 僕らの今日を取り返せ！', subText: '世界を揺るがすシンガロング', isChorus: true },
      { id: 13, start: 89, end: 94, text: '僕らの今日を 取り返せ！', subText: '奪われた自由を掴み取れ！', isChorus: true },
      { id: 14, start: 94, end: 106, text: 'ここからだ！今を取り返せ！！！', subText: 'LAST EXPLOSION // FINAL CRASH', isChorus: true },
    ],
  },
  {
    id: 'shibuya-riot',
    title: '始発前の暴動 (SHIBUYA RIOT)',
    artist: 'TOKYO RIOT',
    bpm: 195,
    key: 'A minor',
    duration: '02:15',
    tag: 'FAST HARDCORE',
    lyrics: [
      { id: 1, start: 0, end: 12, text: '眠らない街の隙間 吐き出されたアスファルト', subText: '195 BPM 爆速スラッシュビート' },
      { id: 2, start: 12, end: 24, text: '赤信号をぶち壊して 駆け出す深夜2時', subText: 'NO MORE RULES' },
      { id: 3, start: 24, end: 40, text: '叫べ！RIOT！俺たちの旗を掲げろ！', subText: '大音量の咆哮', isChorus: true },
    ],
  },
  {
    id: 'over-the-wall',
    title: '壁を越えろ - OVER THE WALL',
    artist: 'TOKYO RIOT',
    bpm: 175,
    key: 'D minor',
    duration: '02:30',
    tag: 'MELODIC ANTHEM',
    lyrics: [
      { id: 1, start: 0, end: 15, text: '立ちはだかる高い壁の前で 立ち止まった昨日', subText: 'ヘヴィ・グルーヴ・イントロ' },
      { id: 2, start: 15, end: 30, text: '拳を握れ 拳を突き上げろ 越えられない壁などない！', subText: 'メロディック・パンク・アンセム', isChorus: true },
    ],
  },
];

export const TOUR_DATES: TourDate[] = [
  {
    id: 'tour-1',
    date: '2025.04.18 (FRI)',
    city: 'TOKYO',
    venue: 'SHIBUYA CYCLONE',
    doors: 'OPEN 18:00 / START 19:00',
    status: 'few',
    ticketPrice: '¥4,500 (+1D)',
  },
  {
    id: 'tour-2',
    date: '2025.04.25 (FRI)',
    city: 'OSAKA',
    venue: 'SHINSAIBASHI DROP',
    doors: 'OPEN 18:00 / START 19:00',
    status: 'available',
    ticketPrice: '¥4,500 (+1D)',
  },
  {
    id: 'tour-3',
    date: '2025.05.02 (FRI)',
    city: 'NAGOYA',
    venue: 'NAGOYA CLUB QUATTRO',
    doors: 'OPEN 17:30 / START 18:30',
    status: 'available',
    ticketPrice: '¥4,800 (+1D)',
  },
  {
    id: 'tour-4',
    date: '2025.05.09 (FRI)',
    city: 'FUKUOKA',
    venue: 'LIVE HOUSE CB',
    doors: 'OPEN 18:00 / START 19:00',
    status: 'available',
    ticketPrice: '¥4,200 (+1D)',
  },
  {
    id: 'tour-5',
    date: '2025.05.16 (FRI)',
    city: 'SENDAI',
    venue: 'LIVE HOUSE enn 2nd',
    doors: 'OPEN 18:00 / START 19:00',
    status: 'available',
    ticketPrice: '¥4,200 (+1D)',
  },
  {
    id: 'tour-6',
    date: '2025.06.01 (SUN)',
    city: 'TOKYO FINAL',
    venue: 'NIPPON BUDOKAN ARENA',
    doors: 'OPEN 16:30 / START 17:30',
    status: 'few',
    ticketPrice: '¥8,500 (ARENA STANDING)',
  },
];

export const MERCH_ITEMS: MerchItem[] = [
  {
    id: 'merch-tee',
    name: 'TOKYO RIOT 2024 TOUR TEE',
    category: 'APPAREL',
    price: 4500,
    tag: 'TOUR OFFICIAL',
    image: merchTeeImg,
    description: '特厚7.4ozヘヴィウェイトコットン使用。フロントに「東京暴動」の深紅スクリーンプリント、バックにツアースケジュールを施した限定Tシャツ。',
    sizes: ['M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'merch-vinyl',
    name: '12" VINYL "RECLAIM THE DAY" LIMITED RED WAX',
    category: 'MUSIC & RECORD',
    price: 4200,
    tag: 'LIMITED 500 COPIES',
    image: guitarDetailImg,
    description: '深紅のクリアヴァイナル仕様。未配信のスタジオライヴ・テイクを含む全8曲収録の完全限定アナログ盤。',
  },
  {
    id: 'merch-picks',
    name: 'PRO STAGE GUITAR PICKS (10-PACK)',
    category: 'GEAR',
    price: 1500,
    tag: 'HEAVY 1.14mm',
    image: merchTeeImg,
    description: 'ステージで実際に使われる滑り止めサンドグリップ加工のヘヴィ・ウルテム製ピック。10枚セット。',
  },
  {
    id: 'merch-wristband',
    name: 'RUBBER WRISTBAND - BLACK & BLOOD RED',
    category: 'ACCESSORY',
    price: 900,
    tag: 'RIOT GEAR',
    image: crowdLiveImg,
    description: 'モッシュピットの熱気にも負けない高耐久シリコン製リストバンド。「取り返せ」のメッセージを刻印。',
  },
];

export const BAND_MEMBERS = [
  {
    role: 'VOCAL / SCREAM',
    name: 'REN',
    kanji: '蓮',
    gear: 'SHURE 55SH Series II & Custom Distortion Mic',
    quote: '「声が枯れるまで叫べ。立ち止まる理由などどこにもない。」',
  },
  {
    role: 'GUITAR / CHORUS',
    name: 'RYU',
    kanji: '竜',
    gear: 'Gibson Les Paul Custom & Marshall JCM800',
    quote: '「6本の弦と歪んだアンプがあれば、壁は叩き壊せる。」',
  },
  {
    role: 'BASS / LOW-END',
    name: 'SHIN',
    kanji: '真',
    gear: 'Fender Precision Bass & Ampeg SVT-CL',
    quote: '「心臓に直撃する重低音で、フロア全員の鼓動を支配する。」',
  },
  {
    role: 'DRUMS / BEAT',
    name: 'KOU',
    kanji: '航',
    gear: 'Tama Starclassic & Zildjian A Custom',
    quote: '「一撃一撃に魂を込めろ。休む暇なんて1秒もない。」',
  },
];
