<script setup lang="ts">
import type { TradeCard } from '@/types/activity'

defineProps<{
  card: TradeCard
}>()
</script>

<template>
  <div class="card-artwork" :style="{ '--card-accent': card.accent }">
    <img v-if="card.image" :src="card.image" :alt="card.name" loading="lazy" />
    <template v-else>
      <div class="card-artwork__halo"></div>
      <span class="card-artwork__symbol">{{ card.symbol }}</span>
      <span class="card-artwork__shine"></span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.card-artwork {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background:
    radial-gradient(circle at 65% 25%, color-mix(in srgb, var(--card-accent) 78%, white), transparent 22%),
    linear-gradient(155deg, color-mix(in srgb, var(--card-accent) 35%, #101c32), #0b1424 72%);
  isolation: isolate;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-artwork__halo {
  position: absolute;
  inset: 14% 12% 6%;
  z-index: -1;
  border: 1px solid rgb(255 255 255 / 16%);
  border-radius: 50% 50% 44% 44%;
  background:
    linear-gradient(140deg, rgb(255 255 255 / 16%), transparent 42%),
    color-mix(in srgb, var(--card-accent) 30%, transparent);
  box-shadow: inset 0 0 44px rgb(255 255 255 / 10%);
  transform: rotate(-8deg);
}

.card-artwork__symbol {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgb(255 255 255 / 92%);
  font-family: "STKaiti", "KaiTi", serif;
  font-size: clamp(44px, 6vw, 76px);
  font-weight: 800;
  text-shadow: 0 8px 18px rgb(0 0 0 / 30%);
  transform: translateY(-2%);
}

.card-artwork__shine {
  position: absolute;
  top: -45%;
  left: -65%;
  width: 55%;
  height: 170%;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 18%), transparent);
  transform: rotate(28deg);
}
</style>
