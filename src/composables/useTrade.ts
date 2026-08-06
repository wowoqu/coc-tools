import { cardById } from '@/config/activity'
import type { TradeCard } from '@/types/activity'

type TradeStep = 'offer' | 'want'

interface PersistedTradeState {
  currentStep: TradeStep
  offeredCardId: string | null
  wantedCardIds: string[]
  playerName: string
}

const STORAGE_KEY = 'coc-trade-state-v3'

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
    const persistedOfferedCard = cardById.get(offeredCardId ?? '')
    const wantedCardIds = Array.isArray(saved.wantedCardIds)
      ? [...new Set(saved.wantedCardIds)].filter((id) => {
          const card = cardById.get(id)
          return id !== offeredCardId && card?.groupId === persistedOfferedCard?.groupId
        })
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
  const canContinue = computed(() => Boolean(offeredCard.value))
  const canPreview = computed(() =>
    Boolean(
      offeredCard.value
      && wantedCards.value.length
      && wantedCards.value.every((card) => card.groupId === offeredCard.value?.groupId),
    ),
  )

  const selectOfferedCard = (cardId: string) => {
    const nextOfferedCardId = state.offeredCardId === cardId ? null : cardId
    const nextOfferedCard = cardById.get(nextOfferedCardId ?? '')
    state.offeredCardId = nextOfferedCardId
    state.wantedCardIds = nextOfferedCard
      ? state.wantedCardIds.filter((id) => {
          const card = cardById.get(id)
          return id !== nextOfferedCardId && card?.groupId === nextOfferedCard.groupId
        })
      : []
  }

  const selectWantedCard = (cardId: string) => {
    const card = cardById.get(cardId)
    if (!offeredCard.value || !card || cardId === state.offeredCardId || card.groupId !== offeredCard.value.groupId) return
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

  const clearWantedCards = () => {
    state.wantedCardIds = []
  }

  const resetSelection = () => {
    state.currentStep = 'offer'
    state.offeredCardId = null
    state.wantedCardIds = []
  }

  return {
    state: readonly(state),
    offeredCard,
    wantedCards,
    canContinue,
    canPreview,
    selectOfferedCard,
    selectWantedCard,
    goToWantStep,
    goToOfferStep,
    setPlayerName,
    clearWantedCards,
    resetSelection,
  }
}
