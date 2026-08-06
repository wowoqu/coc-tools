<script setup lang="ts">
import CardArtwork from '@/components/CardArtwork.vue'
import { activityConfig } from '@/config/activity'
import type { TradeCard } from '@/types/activity'

defineProps<{
  offeredCard: TradeCard
  wantedCard: TradeCard
  playerName: string
}>()

const element = ref<HTMLElement | null>(null)

defineExpose({ element })
</script>

<template>
  <article ref="element" class="trade-poster">
    <div class="trade-poster__glow trade-poster__glow--one"></div>
    <div class="trade-poster__glow trade-poster__glow--two"></div>

    <header class="trade-poster__header">
      <div class="poster-brand">
        <span class="poster-brand__mark">C</span>
        <div>
          <strong>{{ activityConfig.poster.title }}</strong>
          <span>CLAN CARD EXCHANGE</span>
        </div>
      </div>
      <span class="poster-badge">1 换 1</span>
    </header>

    <section v-if="playerName" class="player-strip">
      <span>PLAYER</span>
      <strong>{{ playerName }}</strong>
    </section>

    <div class="trade-poster__message">
      <p>{{ playerName ? '这是我的换卡计划' : '寻找愿意交换的部落伙伴' }}</p>
      <h1>我有这张，想换那张</h1>
    </div>

    <section class="poster-trade" aria-label="换卡内容">
      <div class="poster-card">
        <p>我可以提供</p>
        <div class="poster-card__frame"><CardArtwork :card="offeredCard" /></div>
        <strong>{{ offeredCard.name }}</strong>
        <span>{{ offeredCard.category.replace('卡牌', '') }} · {{ offeredCard.englishName }}</span>
      </div>

      <div class="poster-trade__arrow" aria-hidden="true">
        <span>→</span>
        <small>交换</small>
      </div>

      <div class="poster-card">
        <p>我想要</p>
        <div class="poster-card__frame"><CardArtwork :card="wantedCard" /></div>
        <strong>{{ wantedCard.name }}</strong>
        <span>{{ wantedCard.category.replace('卡牌', '') }} · {{ wantedCard.englishName }}</span>
      </div>
    </section>

    <footer class="trade-poster__footer">
      <span>{{ activityConfig.poster.footer }}</span>
      <strong>COC TRADE</strong>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.trade-poster {
  position: relative;
  width: 540px;
  height: 675px;
  overflow: hidden;
  padding: 32px 36px 26px;
  color: #fff;
  background:
    linear-gradient(160deg, rgb(13 37 70 / 72%), transparent 42%),
    radial-gradient(circle at 50% 62%, #173d68, #091323 64%);
  font-family:
    Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  isolation: isolate;
}

.trade-poster::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgb(255 255 255 / 2%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 2%) 1px, transparent 1px);
  background-size: 36px 36px;
  content: '';
  mask-image: linear-gradient(to bottom, black, transparent 80%);
}

.trade-poster__glow {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  filter: blur(4px);
}

.trade-poster__glow--one {
  top: -140px;
  right: -110px;
  width: 340px;
  height: 340px;
  background: rgb(68 139 211 / 25%);
}

.trade-poster__glow--two {
  bottom: 20px;
  left: -120px;
  width: 300px;
  height: 300px;
  background: rgb(245 201 90 / 10%);
}

.trade-poster__header,
.poster-brand,
.trade-poster__footer {
  display: flex;
  align-items: center;
}

.trade-poster__header {
  justify-content: space-between;
}

.poster-brand {
  gap: 11px;
}

.poster-brand__mark {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 12px;
  color: #1b2432;
  background: var(--gold-500);
  box-shadow: 0 6px 18px rgb(245 201 90 / 16%);
  font-family: Georgia, serif;
  font-size: 23px;
  font-weight: 900;
}

.poster-brand > div {
  display: grid;
  gap: 3px;

  strong {
    font-size: 13px;
  }

  span {
    color: rgb(255 255 255 / 48%);
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.17em;
  }
}

.poster-badge {
  padding: 7px 10px;
  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 999px;
  color: rgb(255 255 255 / 72%);
  background: rgb(255 255 255 / 6%);
  font-size: 9px;
}

.player-strip {
  display: flex;
  align-items: center;
  gap: 9px;
  width: max-content;
  max-width: 100%;
  margin-top: 23px;
  padding: 7px 12px 7px 8px;
  border: 1px solid rgb(245 201 90 / 24%);
  border-radius: 10px;
  background: rgb(245 201 90 / 8%);

  span {
    padding: 4px 6px;
    border-radius: 5px;
    color: #202838;
    background: var(--gold-500);
    font-size: 7px;
    font-weight: 900;
    letter-spacing: 0.12em;
  }

  strong {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.trade-poster__message {
  margin-top: 26px;

  p {
    margin: 0 0 5px;
    color: rgb(255 255 255 / 54%);
    font-size: 10px;
  }

  h1 {
    margin: 0;
    font-size: 28px;
    line-height: 1.18;
    letter-spacing: -0.04em;
  }
}

.poster-trade {
  display: grid;
  grid-template-columns: 1fr 62px 1fr;
  gap: 14px;
  align-items: center;
  margin-top: 27px;
}

.poster-card {
  min-width: 0;
  text-align: center;

  > p {
    margin: 0 0 9px;
    color: var(--gold-500);
    font-size: 10px;
    font-weight: 800;
  }

  > strong {
    display: block;
    overflow: hidden;
    margin-top: 10px;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > span {
    display: block;
    margin-top: 4px;
    color: rgb(255 255 255 / 48%);
    font-size: 8px;
  }
}

.poster-card__frame {
  overflow: hidden;
  border: 2px solid rgb(255 255 255 / 14%);
  border-radius: 18px;
  box-shadow: 0 16px 30px rgb(0 0 0 / 22%);
}

.poster-card__frame :deep(.card-artwork) {
  aspect-ratio: 4 / 5;
}

.poster-trade__arrow {
  display: grid;
  justify-items: center;
  gap: 6px;

  span {
    display: grid;
    width: 44px;
    height: 44px;
    place-items: center;
    border: 1px solid rgb(245 201 90 / 30%);
    border-radius: 50%;
    color: var(--gold-500);
    background: rgb(245 201 90 / 9%);
    font-size: 22px;
  }

  small {
    color: rgb(255 255 255 / 36%);
    font-size: 7px;
    letter-spacing: 0.12em;
  }
}

.trade-poster__footer {
  position: absolute;
  right: 36px;
  bottom: 25px;
  left: 36px;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgb(255 255 255 / 10%);

  span {
    color: rgb(255 255 255 / 36%);
    font-size: 7px;
  }

  strong {
    color: rgb(255 255 255 / 48%);
    font-size: 7px;
    letter-spacing: 0.16em;
  }
}
</style>
