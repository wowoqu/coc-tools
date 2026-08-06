export type CardCategory = '圣水卡牌' | '暗黑重油卡牌' | '建筑大师基地卡牌' | '超级兵种卡牌'

export interface TradeCard {
  id: string
  name: string
  groupId: string
  image?: string
  symbol: string
  accent: string
  category: CardCategory
  englishName: string
  tags: string[]
  disabled?: boolean
  disabledReason?: string
}

export interface CardGroup {
  id: string
  name: string
  description: string
  order: number
  accentColor: string
  softColor: string
  cards: TradeCard[]
}

export interface ActivityConfig {
  id: string
  title: string
  subtitle: string
  eyebrow: string
  tips: string[]
  banner: {
    desktop: string
    mobile: string
    alt: string
  }
  selection: {
    offerLimit: number
    wantLimit: number
    excludeSameCard: boolean
  }
  poster: {
    title: string
    footer: string
    width: number
    height: number
  }
  groups: CardGroup[]
}
