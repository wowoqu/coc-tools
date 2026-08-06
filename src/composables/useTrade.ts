import { cardById } from '@/config/activity'
import type { TradeCard } from '@/types/activity'

type TradeStep = 'offer' | 'want'

interface PersistedTradeState {
  currentStep: TradeStep
  offeredCardId: string | null
  wantedCardIds: string[]
  playerName: string
}

const STORAGE_KEY = 'coc-trade-state-v2'

const defaultState: PersistedTradeState = {
  currentStep: 'offer',
  offeredCardId: null,
  wantedCardIds: [],
  playerName: '',
}

const readPersistedState = (): PersistedTradeState => {
  if (typeof window === 'undefined') return { ...defaultState }

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<PersistedTradeState>
    const offeredCardId = saved.offeredCardId && cardById.has(saved.offeredCardId) ? saved.offeredCardId : null
    const wantedCardIds = Array.isArray(saved.wantedCardIds)
      ? [...new Set(saved.wantedCardIds)].filter((id) => id !== offeredCardId && cardById.has(id))
      : []

    return {
      currentStep: saved.currentStep === 'want' && offeredCardId ? 'want' : 'offer',
      offeredCardId,
      wantedCardIds,
      playerName: typeof saved.playerName === 'string' ? saved.playerName.slice(0, 20) : '',
    }
  } catch {
    return { ...defaultState }
  }
}

const state = reactive(readPersistedState())

watch(
  state,
  (value) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

export const useTrade = () => {
  const offeredCard = computed<TradeCard | null>(() => cardById.get(state.offeredCardId ?? '') ?? null)
  const wantedCards = computed<TradeCard[]>(() =>
    state.wantedCardIds.flatMap((id) => {
      const card = cardById.get(id)
      return card ? [card] : []
    }),
  )
  const wantedCard = computed<TradeCard | null>(() => wantedCards.value[0] ?? null)
  const canContinue = computed(() => Boolean(offeredCard.value))
  const canPreview = computed(() => Boolean(offeredCard.value && wantedCards.value.length))

  const selectOfferedCard = (cardId: string) => {
    state.offeredCardId = state.offeredCardId === cardId ? null : cardId
    state.wantedCardIds = state.wantedCardIds.filter((id) => id !== state.offeredCardId)
  }

  const selectWantedCard = (cardId: string) => {
    if (cardId === state.offeredCardId) return
    state.wantedCardIds = state.wantedCardIds.includes(cardId)
      ? state.wantedCardIds.filter((id) => id !== cardId)
      : [...state.wantedCardIds, cardId]
  }

  const goToWantStep = () => {
    if (canContinue.value) state.currentStep = 'want'
  }

  const goToOfferStep = () => {
    state.currentStep = 'offer'
  }

  const setPlayerName = (value: string) => {
    state.playerName = Array.from(value.replace(/[\r\n\t]+/g, ' ')).slice(0, 20).join('')
  }

  const resetTrade = () => Object.assign(state, defaultState)

  return {
    state: readonly(state),
    offeredCard,
    wantedCard,
    wantedCards,
    canContinue,
    canPreview,
    selectOfferedCard,
    selectWantedCard,
    goToWantStep,
    goToOfferStep,
    setPlayerName,
    resetTrade,
  }
}
