<script setup lang="ts">
import CardArtwork from '@/components/CardArtwork.vue'
import type { TradeCard } from '@/types/activity'

defineProps<{
  step: 'offer' | 'want'
  offeredCard: TradeCard | null
  wantedCards: TradeCard[]
  canContinue: boolean
}>()

const emit = defineEmits<{
  next: []
  reset: []
}>()
</script>

<template>
  <div class="action-bar-wrap">
    <div class="action-bar">
      <div class="action-bar__summary">
        <div class="mini-selection" :class="{ 'is-empty': !offeredCard }">
          <div v-if="offeredCard" class="mini-selection__art"><CardArtwork :card="offeredCard" /></div>
          <div v-else class="mini-selection__empty">1</div>
          <div>
            <span>我可以提供</span>
            <strong>{{ offeredCard?.name ?? '尚未选择' }}</strong>
          </div>
        </div>

        <span class="action-bar__arrow" aria-hidden="true">→</span>

        <div class="mini-selection" :class="{ 'is-empty': !wantedCards.length }">
          <div v-if="wantedCards.length" class="mini-stack" aria-hidden="true">
            <div
              v-for="(card, index) in wantedCards.slice(0, 3)"
              :key="card.id"
              class="mini-stack__art"
              :style="{ zIndex: 3 - index }"
            >
              <CardArtwork :card="card" />
            </div>
          </div>
          <div v-else class="mini-selection__empty">2</div>
          <div>
            <span>我缺少</span>
            <strong>{{ wantedCards.length ? `已选 ${wantedCards.length} 张` : '尚未选择' }}</strong>
          </div>
        </div>
      </div>

      <div class="action-bar__actions">
        <button v-if="offeredCard || wantedCards.length" type="button" class="reset-button" @click="emit('reset')">
          重新选择
        </button>
        <el-button type="primary" size="large" :disabled="!canContinue" @click="emit('next')">
          {{ step === 'offer' ? '下一步：选择想要的卡' : '预览换卡图片' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.action-bar-wrap {
  position: sticky;
  z-index: 20;
  bottom: 0;
  padding: 14px 24px calc(14px + env(safe-area-inset-bottom));
  pointer-events: none;
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  width: min(1120px, 100%);
  min-height: 86px;
  margin: 0 auto;
  padding: 12px 14px 12px 20px;
  border: 1px solid rgb(212 220 231 / 82%);
  border-radius: 22px;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 20px 55px rgb(14 37 64 / 22%);
  backdrop-filter: blur(18px);
  pointer-events: auto;
}

.action-bar__summary,
.action-bar__actions,
.mini-selection {
  display: flex;
  align-items: center;
}

.action-bar__summary {
  gap: 14px;
}

.mini-selection {
  min-width: 190px;
  gap: 11px;

  > div:last-child {
    display: grid;
    gap: 3px;
  }

  span {
    color: var(--text-secondary);
    font-size: 11px;
  }

  strong {
    font-size: 14px;
  }

  &.is-empty strong {
    color: #98a2b3;
    font-weight: 600;
  }
}

.mini-stack,
.mini-selection__empty {
  width: 46px;
  height: 54px;
  border-radius: 10px;
}

.mini-selection__art {
  width: 46px;
  height: 54px;
  overflow: hidden;
  border-radius: 10px;
}

.mini-selection__art :deep(.card-artwork),
.mini-stack__art :deep(.card-artwork) {
  height: 100%;
}

.mini-stack {
  position: relative;
  flex: 0 0 64px;
  width: 64px;
}

.mini-stack__art {
  position: absolute;
  top: 0;
  width: 37px;
  height: 54px;
  overflow: hidden;
  border: 2px solid #fff;
  border-radius: 9px;
  box-shadow: 0 3px 8px rgb(14 37 64 / 16%);

  &:nth-child(2) {
    left: 12px;
  }

  &:nth-child(3) {
    left: 24px;
  }
}

.mini-selection__empty {
  display: grid;
  place-items: center;
  border: 1px dashed #cbd5e1;
  color: #98a2b3;
  background: #f5f7fa;
  font-size: 12px;
  font-weight: 700;
}

.action-bar__arrow {
  color: #98a2b3;
  font-size: 20px;
}

.action-bar__actions {
  gap: 8px;
}

.reset-button {
  min-height: 42px;
  padding: 0 12px;
  border: 0;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
}

:deep(.el-button--primary) {
  min-height: 48px;
  padding-inline: 22px;
  border-color: var(--brand-600);
  border-radius: 14px;
  background: var(--brand-600);
  font-weight: 700;
}

@media (max-width: 820px) {
  .action-bar {
    gap: 14px;
  }

  .mini-selection {
    min-width: 0;
  }

  .mini-selection > div:last-child,
  .action-bar__arrow {
    display: none;
  }
}

@media (max-width: 560px) {
  .action-bar-wrap {
    padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
  }

  .action-bar {
    min-height: 72px;
    padding: 9px 9px 9px 12px;
    border-radius: 18px;
  }

  .action-bar__summary {
    gap: 5px;
  }

  .mini-selection__art,
  .mini-stack,
  .mini-selection__empty {
    width: 36px;
    height: 44px;
    border-radius: 8px;
  }

  .mini-stack {
    flex-basis: 50px;
    width: 50px;
  }

  .mini-stack__art {
    width: 30px;
    height: 44px;

    &:nth-child(2) {
      left: 9px;
    }

    &:nth-child(3) {
      left: 18px;
    }
  }

  .reset-button {
    display: none;
  }

  :deep(.el-button--large) {
    min-height: 46px;
    padding-inline: 14px;
    font-size: 13px;
  }
}
</style>
