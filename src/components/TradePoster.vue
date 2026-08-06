<script setup lang="ts">
import CardArtwork from '@/components/CardArtwork.vue'
import { activityConfig } from '@/config/activity'
import type { TradeCard } from '@/types/activity'

const props = defineProps<{
  offeredCard: TradeCard
  wantedCards: TradeCard[]
  playerName: string
  clanName: string
  clanId: string
}>()

const hasIdentity = computed(() => Boolean(props.playerName || props.clanName || props.clanId))

const wantedGridClass = computed(() => {
  if (props.wantedCards.length <= 4) return 'is-four-columns'
  if (props.wantedCards.length <= 10) return 'is-five-columns'
  return 'is-six-columns'
})

const element = ref<HTMLElement | null>(null)

defineExpose({ element })
</script>

<template>
  <article ref="element" class="trade-poster">
    <header class="poster-header">
      <strong>{{ activityConfig.poster.title }}</strong>
      <div v-if="hasIdentity" class="poster-identity">
        <span v-if="playerName" class="poster-identity__player">{{ playerName }}</span>
        <div v-if="clanName || clanId" class="poster-identity__clan">
          <b v-if="clanName">{{ clanName }}</b>
          <small v-if="clanId">{{ clanId }}</small>
        </div>
      </div>
    </header>

    <section class="offer-section" aria-label="我可以提供的卡">
      <div class="offer-section__copy">
        <p>我可以提供</p>
        <h1>{{ offeredCard.name }}</h1>
        <span>{{ offeredCard.category }}</span>
      </div>
      <div class="offer-section__art">
        <CardArtwork :card="offeredCard" eager />
      </div>
    </section>

    <section class="wanted-section" aria-label="我目前缺少的卡">
      <header>
        <h2>我目前缺少 <strong>{{ wantedCards.length }}</strong> 张卡</h2>
        <span>{{ offeredCard.category }}</span>
      </header>

      <div class="wanted-grid" :class="wantedGridClass">
        <figure v-for="card in wantedCards" :key="card.id" class="wanted-card">
          <div class="wanted-card__art">
            <CardArtwork :card="card" eager />
          </div>
          <figcaption>{{ card.name }}</figcaption>
        </figure>
      </div>
    </section>

    <footer>{{ activityConfig.poster.footer }}</footer>
  </article>
</template>

<style scoped lang="scss">
.trade-poster {
  position: relative;
  width: 540px;
  height: 675px;
  overflow: hidden;
  padding: 25px 32px 24px;
  color: #fff;
  background:
    radial-gradient(circle at 82% 8%, rgb(55 130 203 / 24%), transparent 28%),
    linear-gradient(150deg, #102844, #091522 70%);
  font-family: Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
}

.poster-header,
.offer-section,
.wanted-section > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.poster-header {
  min-height: 30px;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(255 255 255 / 10%);

  > strong {
    flex: 0 0 auto;
    font-size: 11px;
    letter-spacing: 0.04em;
  }
}

.poster-identity {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;

  &__player {
    overflow: hidden;
    max-width: 130px;
    padding: 5px 9px;
    border-radius: 999px;
    color: #172235;
    background: var(--gold-500);
    font-size: 8px;
    font-weight: 800;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__clan {
    display: grid;
    min-width: 0;
    max-width: 150px;
    justify-items: end;
    line-height: 1.15;

    b,
    small {
      overflow: hidden;
      max-width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    b {
      font-size: 8px;
    }

    small {
      margin-top: 3px;
      color: rgb(255 255 255 / 42%);
      font-size: 6.5px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
  }
}

.offer-section {
  height: 120px;
  margin-top: 14px;
  padding: 12px 14px 12px 18px;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 11%);
  border-radius: 18px;
  background: rgb(255 255 255 / 6%);
}

.offer-section__copy {
  min-width: 0;

  p {
    margin: 0 0 5px;
    color: var(--gold-500);
    font-size: 10px;
    font-weight: 800;
  }

  h1 {
    margin: 0;
    font-size: 27px;
    line-height: 1.12;
    letter-spacing: -0.04em;
  }

  span {
    display: block;
    margin-top: 6px;
    color: rgb(255 255 255 / 46%);
    font-size: 8px;
  }
}

.offer-section__art {
  flex: 0 0 78px;
  width: 78px;
  height: 98px;
  overflow: hidden;
  border: 2px solid rgb(255 255 255 / 14%);
  border-radius: 14px;
  box-shadow: 0 10px 24px rgb(0 0 0 / 24%);

  :deep(.card-artwork) {
    height: 100%;
  }
}

.wanted-section {
  margin-top: 16px;
}

.wanted-section > header {
  min-height: 25px;

  h2 {
    margin: 0;
    font-size: 16px;
    letter-spacing: -0.025em;

    strong {
      color: var(--gold-500);
      font-size: 21px;
    }
  }

  > span {
    color: rgb(255 255 255 / 38%);
    font-size: 8px;
  }
}

.wanted-grid {
  display: grid;
  align-items: start;
  gap: 9px;
  margin-top: 10px;

  &.is-four-columns {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  &.is-five-columns {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  &.is-six-columns {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 8px;
  }
}

.wanted-card {
  min-width: 0;
  margin: 0;
  text-align: center;
}

.wanted-card__art {
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 10px;
  background: rgb(255 255 255 / 5%);
  box-shadow: 0 7px 16px rgb(0 0 0 / 18%);
}

.wanted-card figcaption {
  overflow: hidden;
  margin-top: 4px;
  color: rgb(255 255 255 / 82%);
  font-size: 7.5px;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.is-four-columns .wanted-card figcaption {
  font-size: 9px;
}

.is-five-columns .wanted-card figcaption {
  font-size: 8px;
}

.trade-poster footer {
  position: absolute;
  right: 32px;
  bottom: 17px;
  left: 32px;
  padding-top: 9px;
  border-top: 1px solid rgb(255 255 255 / 8%);
  color: rgb(255 255 255 / 30%);
  font-size: 6.5px;
  text-align: center;
}
</style>
