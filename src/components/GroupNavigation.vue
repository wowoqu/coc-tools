<script setup lang="ts">
import type { CardGroup } from '@/types/activity'

defineProps<{
  groups: CardGroup[]
  activeId: string
}>()

const emit = defineEmits<{
  change: [id: string]
}>()
</script>

<template>
  <nav class="group-nav" aria-label="卡片分组">
    <button
      type="button"
      class="group-nav__item"
      :class="{ 'is-active': activeId === 'all' }"
      @click="emit('change', 'all')"
    >
      全部
    </button>
    <button
      v-for="group in groups"
      :key="group.id"
      type="button"
      class="group-nav__item"
      :class="{ 'is-active': activeId === group.id }"
      @click="emit('change', group.id)"
    >
      {{ group.name }}
      <span>{{ group.cards.length }}</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.group-nav {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 2px 8px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.group-nav__item {
  flex: 0 0 auto;
  min-height: 40px;
  padding: 0 15px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-secondary);
  background: #fff;
  cursor: pointer;
  transition: 180ms ease;

  span {
    margin-left: 5px;
    color: #98a2b3;
    font-size: 11px;
  }

  &:hover {
    border-color: #a9bdd5;
    color: var(--brand-600);
  }

  &:focus-visible {
    outline: 3px solid rgb(37 103 168 / 22%);
    outline-offset: 2px;
  }

  &.is-active {
    border-color: var(--brand-800);
    color: #fff;
    background: var(--brand-800);
    box-shadow: 0 8px 18px rgb(16 40 73 / 18%);

    span {
      color: rgb(255 255 255 / 62%);
    }
  }
}
</style>
