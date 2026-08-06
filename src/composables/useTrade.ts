import { cardById } from '@/config/activity'
import type { TradeCard } from '@/types/activity'

type TradeStep = 'offer' | 'want'

interface PersistedTradeState {
  currentStep: TradeStep
  offeredCardId: string | null
  wantedCardId: string | null
  playerName: string
}

const STORAGE_KEY = 'coc-trade-state-v1'

const defaultState: PersistedTradeState = {
  currentStep: 'offer',
  offeredCardId: null,
  wantedCardId: null,
  playerName: '',
}

const readPersistedState = (): PersistedTradeState => {
  if (typeof window === 'undefined') return { ...defaultState }

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<PersistedTradeState>
    return {
      currentStep: saved.currentStep === 'want' ? 'want' : 'offer',
      offeredCardId: saved.offeredCardId && cardById.has(saved.offeredCardId) ? saved.offeredCardId : null,
      wantedCardId: saved.wantedCardId && cardById.has(saved.wantedCardId) ? saved.wantedCardId : null,
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
  const wantedCard = computed<TradeCard | null>(() => cardById.get(state.wantedCardId ?? '') ?? null)
  const canContinue = computed(() => Boolean(offeredCard.value))
  const canPreview = computed(() => Boolean(offeredCard.value && wantedCard.value))

  const selectOfferedCard = (cardId: string) => {
    state.offeredCardId = state.offeredCardId === cardId ? null : cardId
    if (state.wantedCardId === state.offeredCardId) state.wantedCardId = null
  }

  const selectWantedCard = (cardId: string) => {
    if (cardId === state.offeredCardId) return
    state.wantedCardId = state.wantedCardId === cardId ? null : cardId
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
