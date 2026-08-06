<script setup lang="ts">
import CardArtwork from '@/components/CardArtwork.vue'
import type { TradeCard } from '@/types/activity'

const props = defineProps<{
  card: TradeCard
  selected: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const handleClick = () => {
  if (!props.disabled && !props.card.disabled) emit('select', props.card.id)
}
</script>

<template>
  <button
    type="button"
    class="trade-card"
    :class="{ 'is-selected': selected, 'is-disabled': disabled || card.disabled }"
    :aria-pressed="selected"
    :aria-label="`${selected ? '取消选择' : '选择'}${card.name}`"
    :disabled="disabled || card.disabled"
    @click="handleClick"
  >
    <div class="trade-card__media">
      <CardArtwork :card="card" />
      <span v-if="selected" class="trade-card__check" aria-hidden="true">✓</span>
      <span class="trade-card__rarity">{{ card.rarity }}</span>
    </div>
    <div class="trade-card__body">
      <strong>{{ card.name }}</strong>
      <span>{{ card.tags.join(' · ') }}</span>
    </div>
  </button>
</template>

<style scoped lang="scss">
.trade-card {
  min-width: 0;
  overflow: hidden;
  padding: 0;
  text-align: left;
  border: 1px solid var(--border);
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 5px 18px rgb(30 57 90 / 5%);
  cursor: pointer;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;

  &:hover:not(:disabled) {
    border-color: #b6c6d8;
    box-shadow: 0 13px 30px rgb(30 57 90 / 12%);
    transform: translateY(-3px);
  }

  &:focus-visible {
    outline: 4px solid rgb(37 103 168 / 22%);
    outline-offset: 3px;
  }

  &.is-selected {
    border-color: #d79f2b;
    box-shadow:
      0 0 0 3px rgb(245 201 90 / 42%),
      0 14px 34px rgb(92 65 10 / 16%);
    transform: translateY(-3px);
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.38;
    filter: grayscale(0.45);
  }
}

.trade-card__media {
  position: relative;
  overflow: hidden;
  border-radius: 16px 16px 12px 12px;
}

.trade-card__check {
  position: absolute;
  top: 10px;
  right: 10px;
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #2f260d;
  background: var(--gold-500);
  box-shadow: 0 4px 12px rgb(0 0 0 / 25%);
  font-size: 15px;
  font-weight: 900;
}

.trade-card__rarity {
  position: absolute;
  bottom: 9px;
  left: 9px;
  padding: 5px 8px;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 999px;
  color: #fff;
  background: rgb(4 12 25 / 66%);
  font-size: 10px;
  backdrop-filter: blur(7px);
}

.trade-card__body {
  display: grid;
  gap: 4px;
  padding: 13px 14px 15px;

  strong {
    overflow: hidden;
    color: var(--text-primary);
    font-size: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    overflow: hidden;
    color: var(--text-secondary);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@media (max-width: 520px) {
  .trade-card {
    border-radius: 15px;
  }

  .trade-card__body {
    padding: 11px 11px 13px;

    strong {
      font-size: 14px;
    }
  }
}
</style>
