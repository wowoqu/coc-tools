<script setup lang="ts">
import ActivityBanner from '@/components/ActivityBanner.vue'
import GroupNavigation from '@/components/GroupNavigation.vue'
import TradeActionBar from '@/components/TradeActionBar.vue'
import TradeCard from '@/components/TradeCard.vue'
import TradeSteps from '@/components/TradeSteps.vue'
import { useTrade } from '@/composables/useTrade'
import { activityConfig } from '@/config/activity'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const keyword = ref('')
const activeGroupId = ref('all')
const selectionSection = ref<HTMLElement | null>(null)

const {
  state,
  offeredCard,
  wantedCards,
  canContinue,
  canPreview,
  selectOfferedCard,
  selectWantedCard,
  goToOfferStep,
  goToWantStep,
  clearWantedCards,
  resetTrade,
} = useTrade()

const selectableGroups = computed(() => {
  if (state.currentStep === 'offer' || !offeredCard.value) return activityConfig.groups
  return activityConfig.groups.filter((group) => group.id === offeredCard.value?.groupId)
})

const filteredGroups = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLocaleLowerCase()

  return selectableGroups.value
    .filter((group) => activeGroupId.value === 'all' || activeGroupId.value === group.id)
    .map((group) => ({
      ...group,
      cards: group.cards.filter((card) => {
        if (state.currentStep === 'want' && card.id === state.offeredCardId) return false
        if (!normalizedKeyword) return true
        return `${card.name} ${card.tags.join(' ')}`.toLocaleLowerCase().includes(normalizedKeyword)
      }),
    }))
    .filter((group) => group.cards.length > 0)
})

const visibleCardCount = computed(() => filteredGroups.value.reduce((total, group) => total + group.cards.length, 0))

const changeStep = (step: 'offer' | 'want') => {
  if (step === 'offer') {
    goToOfferStep()
    activeGroupId.value = 'all'
  } else {
    goToWantStep()
    activeGroupId.value = offeredCard.value?.groupId ?? 'all'
  }
}

const selectCard = (cardId: string) => {
  if (state.currentStep === 'offer') selectOfferedCard(cardId)
  else selectWantedCard(cardId)
}

const handleNext = async () => {
  if (state.currentStep === 'offer') {
    goToWantStep()
    activeGroupId.value = offeredCard.value?.groupId ?? 'all'
    await nextTick()
    selectionSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  if (canPreview.value) await router.push({ name: 'preview' })
}

const handleReset = async () => {
  try {
    await ElMessageBox.confirm('将清除当前选择和玩家名称，是否继续？', '重新开始', {
      confirmButtonText: '清除并重新选择',
      cancelButtonText: '保留当前内容',
      type: 'warning',
    })
    resetTrade()
    keyword.value = ''
    activeGroupId.value = 'all'
  } catch {
    // User cancelled the reset.
  }
}
</script>

<template>
  <div class="trade-page">
    <ActivityBanner />
    <TradeSteps :step="state.currentStep" :can-open-want="Boolean(offeredCard)" @change="changeStep" />

    <main ref="selectionSection" class="selection-section">
      <div class="selection-heading">
        <div>
          <p class="selection-heading__kicker">{{ state.currentStep === 'offer' ? 'STEP 01' : 'STEP 02' }}</p>
          <h2>{{ state.currentStep === 'offer' ? '选择你可以提供的卡' : '选齐所有你缺少的卡' }}</h2>
          <p>
            {{
              state.currentStep === 'offer'
                ? '选中你拥有重复的卡片，稍后仍可返回修改。'
                : `只能选择同为「${offeredCard?.category}」的卡，已排除你提供的「${offeredCard?.name}」。`
            }}
          </p>
        </div>
        <span class="selection-heading__count">
          {{ state.currentStep === 'want' ? `已选 ${wantedCards.length} 张 · ` : '' }}{{ visibleCardCount }} 张可选
        </span>
      </div>

      <div v-if="state.currentStep === 'want'" class="multi-select-tip" role="status">
        <div>
          <strong>{{ wantedCards.length ? `已勾选 ${wantedCards.length} 张缺卡` : '还没有勾选缺卡' }}</strong>
          <span>{{ wantedCards.length ? '继续点击可添加或取消，最后会完整显示在换卡图片中。' : '点击所有当前没有的卡，至少选择 1 张。' }}</span>
        </div>
        <button v-if="wantedCards.length" type="button" @click="clearWantedCards">清空缺卡</button>
      </div>

      <div class="selection-tools">
        <el-input
          v-model="keyword"
          clearable
          size="large"
          aria-label="搜索卡片"
          placeholder="搜索卡片名称或标签"
        />
        <GroupNavigation
          :groups="selectableGroups"
          :active-id="activeGroupId"
          @change="activeGroupId = $event"
        />
      </div>

      <div v-if="filteredGroups.length" class="group-list">
        <section v-for="group in filteredGroups" :key="group.id" class="card-group">
          <div class="card-group__heading">
            <span class="card-group__marker" :style="{ background: group.accentColor }"></span>
            <div>
              <h3>{{ group.name }}</h3>
              <p>{{ group.description }}</p>
            </div>
            <span>{{ group.cards.length }} 张</span>
          </div>

          <div class="card-grid">
            <TradeCard
              v-for="card in group.cards"
              :key="card.id"
              :card="card"
              :selected="
                state.currentStep === 'offer' ? state.offeredCardId === card.id : state.wantedCardIds.includes(card.id)
              "
              :disabled="state.currentStep === 'want' && state.offeredCardId === card.id"
              @select="selectCard"
            />
          </div>
        </section>
      </div>

      <el-empty v-else description="没有找到匹配的卡片">
        <el-button @click="keyword = ''; activeGroupId = 'all'">清除筛选</el-button>
      </el-empty>
    </main>

    <footer class="site-footer">
      <p>本内容为非官方玩家工具，未经 Supercell 认可或赞助。</p>
    </footer>

    <TradeActionBar
      :step="state.currentStep"
      :offered-card="offeredCard"
      :wanted-cards="wantedCards"
      :can-continue="state.currentStep === 'offer' ? canContinue : canPreview"
      @next="handleNext"
      @reset="handleReset"
    />
  </div>
</template>

<style scoped lang="scss">
.trade-page {
  min-height: 100svh;
  background:
    radial-gradient(circle at 90% 44%, rgb(51 116 175 / 8%), transparent 24%),
    var(--surface-soft);
}

.selection-section {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 84px 0 40px;
  scroll-margin-top: 18px;
}

.selection-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;

  h2 {
    margin: 4px 0 8px;
    color: var(--text-primary);
    font-size: clamp(30px, 4.5vw, 46px);
    line-height: 1.15;
    letter-spacing: -0.045em;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.7;
  }
}

.selection-heading__kicker {
  color: var(--brand-600) !important;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.selection-heading__count {
  flex: 0 0 auto;
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--brand-600);
  background: rgb(37 103 168 / 8%);
  font-size: 12px;
  font-weight: 700;
}

.selection-tools {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 20px;
  align-items: center;
  margin-bottom: 36px;
  padding: 17px;
  border: 1px solid var(--border);
  border-radius: 19px;
  background: rgb(255 255 255 / 86%);
  box-shadow: 0 10px 30px rgb(30 57 90 / 5%);
}

.multi-select-tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: -18px 0 34px;
  padding: 13px 15px;
  border: 1px solid rgb(37 103 168 / 12%);
  border-radius: 14px;
  background: rgb(37 103 168 / 5%);

  > div {
    display: grid;
    gap: 3px;
  }

  strong {
    color: var(--text-primary);
    font-size: 13px;
  }

  span {
    color: var(--text-secondary);
    font-size: 11px;
  }

  button {
    flex: 0 0 auto;
    padding: 7px 10px;
    border: 0;
    border-radius: 9px;
    color: var(--brand-600);
    background: rgb(37 103 168 / 9%);
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }
}

:deep(.el-input__wrapper) {
  min-height: 45px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px var(--border) inset;
}

.group-list {
  display: grid;
  gap: 54px;
}

.card-group__heading {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;

  h3 {
    margin: 0 0 3px;
    font-size: 21px;
    letter-spacing: -0.025em;
  }

  p,
  > span:last-child {
    margin: 0;
    color: var(--text-secondary);
    font-size: 12px;
  }
}

.card-group__marker {
  width: 5px;
  height: 38px;
  border-radius: 999px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px;
}

.site-footer {
  padding: 26px 24px 20px;
  text-align: center;
  color: #98a2b3;
  font-size: 12px;
}

@media (max-width: 1050px) {
  .card-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .selection-section {
    width: calc(100% - 32px);
    padding-top: 64px;
  }

  .selection-heading {
    align-items: flex-start;
  }

  .selection-tools {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .multi-select-tip {
    align-items: flex-start;
    margin-top: -4px;
  }

  .card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
}

@media (max-width: 520px) {
  .selection-section {
    width: calc(100% - 28px);
    padding-top: 54px;
  }

  .selection-heading {
    display: block;

    h2 {
      font-size: 33px;
    }
  }

  .selection-heading__count {
    display: inline-block;
    margin-top: 14px;
  }

  .selection-tools {
    margin-inline: -2px;
    padding: 12px;
  }

  .group-list {
    gap: 42px;
  }

  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .card-group__heading > span:last-child {
    display: none;
  }
}
</style>
