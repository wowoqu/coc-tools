import type { ActivityConfig, CardGroup, TradeCard } from '@/types/activity'

const makeCard = (
  groupId: string,
  id: string,
  name: string,
  symbol: string,
  accent: string,
  rarity: TradeCard['rarity'],
  tags: string[],
): TradeCard => ({ id, groupId, name, symbol, accent, rarity, tags })

const groups: CardGroup[] = [
  {
    id: 'heroes',
    name: '英雄典藏',
    description: '村庄中最可靠的英雄伙伴',
    order: 1,
    accentColor: '#efb44b',
    cards: [
      makeCard('heroes', 'barbarian-king', '野蛮人之王', '王', '#f1a64a', '传奇', ['英雄', '近战']),
      makeCard('heroes', 'archer-queen', '弓箭女皇', '后', '#a86bc8', '传奇', ['英雄', '远程']),
      makeCard('heroes', 'grand-warden', '大守护者', '守', '#58a9d8', '传奇', ['英雄', '辅助']),
      makeCard('heroes', 'royal-champion', '飞盾战神', '盾', '#d46e53', '传奇', ['英雄', '突袭']),
    ],
  },
  {
    id: 'troops',
    name: '军队伙伴',
    description: '熟悉的兵种组成最强部落军队',
    order: 2,
    accentColor: '#65aadd',
    cards: [
      makeCard('troops', 'barbarian', '野蛮人', '蛮', '#e3a33e', '普通', ['兵种', '近战']),
      makeCard('troops', 'archer', '弓箭手', '弓', '#c45a9b', '普通', ['兵种', '远程']),
      makeCard('troops', 'wizard', '法师', '法', '#547fd6', '史诗', ['兵种', '远程']),
      makeCard('troops', 'healer', '天使', '愈', '#f3d17b', '稀有', ['兵种', '治疗']),
    ],
  },
  {
    id: 'spells',
    name: '法术秘藏',
    description: '在关键时刻改变战局的法术',
    order: 3,
    accentColor: '#9c76d4',
    cards: [
      makeCard('spells', 'lightning', '雷电法术', '雷', '#639ad8', '稀有', ['法术', '伤害']),
      makeCard('spells', 'healing', '治疗法术', '疗', '#e5b659', '稀有', ['法术', '治疗']),
      makeCard('spells', 'rage', '狂暴法术', '怒', '#be5bb4', '史诗', ['法术', '增益']),
      makeCard('spells', 'freeze', '冰冻法术', '冰', '#64bed7', '史诗', ['法术', '控制']),
    ],
  },
  {
    id: 'defenses',
    name: '村庄守卫',
    description: '陪你守护资源与荣耀的防御建筑',
    order: 4,
    accentColor: '#e17d55',
    cards: [
      makeCard('defenses', 'cannon', '加农炮', '炮', '#b07852', '普通', ['建筑', '地面']),
      makeCard('defenses', 'archer-tower', '箭塔', '塔', '#7f9e63', '普通', ['建筑', '远程']),
      makeCard('defenses', 'air-defense', '防空火箭', '空', '#d8684f', '稀有', ['建筑', '防空']),
      makeCard('defenses', 'inferno-tower', '地狱之塔', '焰', '#d74f3d', '史诗', ['建筑', '持续伤害']),
    ],
  },
]

export const activityConfig: ActivityConfig = {
  id: 'coc-card-exchange-2026',
  title: '部落换卡助手',
  subtitle: '选出你的重复卡，找到你还缺少的那一张。',
  eyebrow: 'CLAN CARD EXCHANGE',
  tips: ['每次选择一张可以提供的卡', '再选择一张想要获得的卡', '生成图片后发送给部落伙伴'],
  banner: {
    desktop: '/images/banner/clan-war-banner.png',
    mobile: '/images/banner/clan-war-banner.png',
    alt: '暮色中的奇幻部落村庄与换卡篝火',
  },
  selection: {
    offerLimit: 1,
    wantLimit: 1,
    excludeSameCard: true,
  },
  poster: {
    title: '我的部落换卡计划',
    footer: '非官方玩家工具 · 请在游戏内确认交换内容',
    width: 540,
    height: 675,
  },
  groups,
}

export const allCards = groups.flatMap((group) => group.cards)

export const cardById = new Map(allCards.map((card) => [card.id, card]))
