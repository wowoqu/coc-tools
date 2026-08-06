export type CardRarity = '普通' | '稀有' | '史诗' | '传奇'

export interface TradeCard {
  id: string
  name: string
  groupId: string
  image?: string
  symbol: string
  accent: string
  rarity: CardRarity
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
