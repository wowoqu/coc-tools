import type { ActivityConfig, CardCategory, CardGroup, TradeCard } from '@/types/activity'

type CardSeed = [id: string, name: string, englishName: string, symbol: string, imageId?: string]

const makeCards = (
  groupId: string,
  category: CardCategory,
  accent: string,
  seeds: CardSeed[],
): TradeCard[] =>
  seeds.map(([id, name, englishName, symbol, imageId]) => ({
    id,
    name,
    englishName,
    groupId,
    image: `/images/cards/${imageId ?? id}.webp`,
    symbol,
    accent,
    category,
    tags: [category.replace('卡牌', ''), englishName],
  }))

const elixirCards: CardSeed[] = [
  ['barbarian', '野蛮人', 'Barbarian', '蛮'],
  ['archer', '弓箭手', 'Archer', '弓'],
  ['giant', '巨人', 'Giant', '巨'],
  ['goblin', '哥布林', 'Goblin', '哥'],
  ['wall-breaker', '炸弹人', 'Wall Breaker', '炸'],
  ['balloon', '气球兵', 'Balloon', '球'],
  ['wizard', '法师', 'Wizard', '法'],
  ['healer', '天使', 'Healer', '愈'],
  ['dragon', '飞龙', 'Dragon', '龙'],
  ['pekka', '皮卡超人', 'P.E.K.K.A', '皮'],
  ['baby-dragon', '飞龙宝宝', 'Baby Dragon', '幼'],
  ['miner', '掘地矿工', 'Miner', '矿'],
  ['electro-dragon', '雷电飞龙', 'Electro Dragon', '雷'],
  ['yeti', '雪怪', 'Yeti', '雪'],
  ['dragon-rider', '龙骑士', 'Dragon Rider', '骑'],
  ['electro-titan', '雷电泰坦', 'Electro Titan', '泰'],
  ['root-rider', '根蔓骑士', 'Root Rider', '根'],
  ['thrower', '投掷手', 'Thrower', '投'],
  ['meteor-golem', '陨石魔像', 'Meteor Golem', '陨'],
]

const darkElixirCards: CardSeed[] = [
  ['minion', '亡灵', 'Minion', '亡'],
  ['hog-rider', '野猪骑士', 'Hog Rider', '猪'],
  ['valkyrie', '瓦基丽武神', 'Valkyrie', '武'],
  ['golem', '戈仑石人', 'Golem', '石'],
  ['witch', '女巫', 'Witch', '巫'],
  ['lava-hound', '熔岩猎犬', 'Lava Hound', '熔'],
  ['bowler', '巨石投手', 'Bowler', '投'],
  ['ice-golem', '冰人', 'Ice Golem', '冰'],
  ['headhunter', '英雄猎手', 'Headhunter', '猎'],
  ['apprentice-warden', '学徒守护者', 'Apprentice Warden', '徒'],
  ['druid', '德鲁伊', 'Druid', '德'],
  ['furnace', '熔炉', 'Furnace', '炉'],
  ['ruin-witch', '废墟女巫', 'Ruin Witch', '墟'],
]

const builderBaseCards: CardSeed[] = [
  ['raged-barbarian', '狂暴野蛮人', 'Raged Barbarian', '暴'],
  ['sneaky-archer', '隐秘弓箭手', 'Sneaky Archer', '隐'],
  ['boxer-giant', '拳击巨人', 'Boxer Giant', '拳'],
  ['beta-minion', '异变亡灵', 'Beta Minion', '变'],
  ['bomber', '炸弹兵', 'Bomber', '弹'],
  ['builder-baby-dragon', '飞龙宝宝', 'Baby Dragon', '幼'],
  ['cannon-cart', '加农炮战车', 'Cannon Cart', '炮'],
  ['night-witch', '暗夜女巫', 'Night Witch', '夜'],
  ['drop-ship', '骷髅气球', 'Drop Ship', '骷'],
  ['power-pekka', '超级皮卡', 'Power P.E.K.K.A', '超'],
  ['builder-hog-rider', '野猪骑士', 'Hog Rider', '猪', 'hog-rider'],
]

const superTroopCards: CardSeed[] = [
  ['super-barbarian', '超级野蛮人', 'Super Barbarian', '超'],
  ['super-archer', '超级弓箭手', 'Super Archer', '超'],
  ['super-giant', '超级巨人', 'Super Giant', '超'],
  ['sneaky-goblin', '隐秘哥布林', 'Sneaky Goblin', '隐'],
  ['super-wall-breaker', '超级炸弹人', 'Super Wall Breaker', '超'],
  ['rocket-balloon', '火箭气球兵', 'Rocket Balloon', '箭'],
  ['super-wizard', '超级法师', 'Super Wizard', '超'],
  ['super-dragon', '超级飞龙', 'Super Dragon', '超'],
  ['inferno-dragon', '地狱飞龙', 'Inferno Dragon', '狱'],
  ['super-miner', '超级矿工', 'Super Miner', '超'],
  ['super-yeti', '超级雪怪', 'Super Yeti', '超'],
  ['super-minion', '超级亡灵', 'Super Minion', '超'],
  ['super-hog-rider', '超级野猪骑士', 'Super Hog Rider', '超'],
  ['super-valkyrie', '超级瓦基丽武神', 'Super Valkyrie', '超'],
  ['super-witch', '超级女巫', 'Super Witch', '超'],
  ['ice-hound', '寒冰猎犬', 'Ice Hound', '寒'],
  ['super-bowler', '超级巨石投手', 'Super Bowler', '超'],
]

const groups: CardGroup[] = [
  {
    id: 'elixir',
    name: '圣水卡牌',
    description: '家乡普通训练营兵种，共 19 张',
    order: 1,
    accentColor: '#e74ea7',
    softColor: '#fff0f8',
    cards: makeCards('elixir', '圣水卡牌', '#e74ea7', elixirCards),
  },
  {
    id: 'dark-elixir',
    name: '暗黑重油卡牌',
    description: '家乡暗黑训练营兵种，共 13 张',
    order: 2,
    accentColor: '#7b43bd',
    softColor: '#f4edff',
    cards: makeCards('dark-elixir', '暗黑重油卡牌', '#7b43bd', darkElixirCards),
  },
  {
    id: 'builder-base',
    name: '建筑大师基地卡牌',
    description: '建筑大师基地兵种，共 11 张',
    order: 3,
    accentColor: '#2787d9',
    softColor: '#eaf5ff',
    cards: makeCards('builder-base', '建筑大师基地卡牌', '#2787d9', builderBaseCards),
  },
  {
    id: 'super-troops',
    name: '超级兵种卡牌',
    description: '家乡超级兵种，共 17 张',
    order: 4,
    accentColor: '#ee7b32',
    softColor: '#fff2e8',
    cards: makeCards('super-troops', '超级兵种卡牌', '#ee7b32', superTroopCards),
  },
]

export const activityConfig: ActivityConfig = {
  id: 'clash-of-cards-2026',
  title: '部落换卡助手',
  subtitle: '选一张多余卡，再一次列出所有缺少的卡。',
  eyebrow: 'CLASH OF CARDS · 60 CARD COLLECTION',
  tips: ['选择一张拥有 2 份以上的重复卡', '勾选所有还没有的卡片', '生成图片后发送给部落伙伴'],
  banner: {
    desktop: '/images/banner/clan-war-banner.png',
    mobile: '/images/banner/clan-war-banner.png',
    alt: '暮色中的奇幻部落村庄与换卡篝火',
  },
  selection: {
    offerLimit: 1,
    wantLimit: 18,
    excludeSameCard: true,
  },
  poster: {
    title: 'Clash of Cards 换卡清单',
    footer: '本内容为非官方玩家工具，未经 Supercell 认可或赞助',
    width: 540,
    height: 675,
  },
  groups,
}

export const allCards = groups.flatMap((group) => group.cards)
export const cardById = new Map(allCards.map((card) => [card.id, card]))
