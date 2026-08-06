<script setup lang="ts">
import CardArtwork from '@/components/CardArtwork.vue'
import { activityConfig } from '@/config/activity'
import type { TradeCard } from '@/types/activity'

const props = defineProps<{
  offeredCard: TradeCard
  wantedCards: TradeCard[]
  playerName: string
}>()

const wantedGroups = computed(() =>
  activityConfig.groups
    .map((group) => ({
      ...group,
      cards: props.wantedCards.filter((card) => card.groupId === group.id),
    }))
    .filter((group) => group.cards.length),
)

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
      <span class="poster-badge">1 对多换卡</span>
    </header>

    <section class="trade-poster__intro">
      <div class="trade-poster__message">
        <p>{{ playerName ? '这是我的换卡计划' : '寻找愿意交换的部落伙伴' }}</p>
        <h1>一张重复卡，换我缺少的卡</h1>
      </div>
      <div v-if="playerName" class="player-chip">
        <span>PLAYER</span>
        <strong>{{ playerName }}</strong>
      </div>
    </section>

    <section class="poster-offer" aria-label="可以提供的卡">
      <div class="poster-offer__art"><CardArtwork :card="offeredCard" eager /></div>
      <div class="poster-offer__copy">
        <p>我可以提供</p>
        <strong>{{ offeredCard.name }}</strong>
        <span>{{ offeredCard.category.replace('卡牌', '') }} · {{ offeredCard.englishName }}</span>
      </div>
      <div class="poster-offer__count">
        <strong>1</strong>
        <span>张重复卡</span>
      </div>
    </section>

    <section class="poster-wanted" aria-label="缺少的卡牌清单">
      <div class="poster-wanted__heading">
        <div>
          <p>我目前缺少</p>
          <strong>以下 {{ wantedCards.length }} 张卡</strong>
        </div>
        <span>按类别整理 · 清单已完整展示</span>
      </div>

      <div class="wanted-groups" :class="{ 'is-compact': wantedCards.length > 42 }">
        <article
          v-for="group in wantedGroups"
          :key="group.id"
          class="wanted-group"
          :style="{ '--group-accent': group.accentColor }"
        >
          <header>
            <span></span>
            <strong>{{ group.name }}</strong>
            <small>{{ group.cards.length }} 张</small>
          </header>
          <ul>
            <li v-for="card in group.cards" :key="card.id" :title="card.englishName">{{ card.name }}</li>
          </ul>
        </article>
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
  padding: 28px 32px 25px;
  color: #fff;
  background:
    linear-gradient(160deg, rgb(13 37 70 / 72%), transparent 42%),
    radial-gradient(circle at 50% 62%, #173d68, #091323 64%);
  font-family: Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  isolation: isolate;
}

.trade-poster::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgb(255 255 255 / 2%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 2%) 1px, transparent 1px);
  background-size: 34px 34px;
  content: '';
  mask-image: linear-gradient(to bottom, black, transparent 84%);
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
.trade-poster__intro,
.poster-offer,
.poster-wanted__heading,
.trade-poster__footer,
.wanted-group header {
  display: flex;
  align-items: center;
}

.trade-poster__header,
.trade-poster__intro,
.poster-wanted__heading,
.trade-poster__footer {
  justify-content: space-between;
}

.poster-brand {
  gap: 10px;
}

.poster-brand__mark {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 11px;
  color: #1b2432;
  background: var(--gold-500);
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: 900;
}

.poster-brand > div {
  display: grid;
  gap: 3px;

  strong {
    font-size: 12px;
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
  border: 1px solid rgb(245 201 90 / 26%);
  border-radius: 999px;
  color: var(--gold-500);
  background: rgb(245 201 90 / 8%);
  font-size: 9px;
  font-weight: 700;
}

.trade-poster__intro {
  min-height: 50px;
  margin-top: 15px;
  gap: 16px;
}

.trade-poster__message {
  min-width: 0;

  p {
    margin: 0 0 4px;
    color: rgb(255 255 255 / 50%);
    font-size: 8px;
  }

  h1 {
    margin: 0;
    font-size: 22px;
    line-height: 1.15;
    letter-spacing: -0.04em;
  }
}

.player-chip {
  display: grid;
  flex: 0 0 auto;
  max-width: 155px;
  gap: 3px;
  padding: 7px 10px;
  border: 1px solid rgb(245 201 90 / 22%);
  border-radius: 10px;
  background: rgb(245 201 90 / 7%);
  text-align: right;

  span {
    color: var(--gold-500);
    font-size: 6px;
    font-weight: 800;
    letter-spacing: 0.14em;
  }

  strong {
    overflow: hidden;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.poster-offer {
  min-height: 106px;
  margin-top: 13px;
  padding: 10px 13px 10px 10px;
  border: 1px solid rgb(255 255 255 / 11%);
  border-radius: 17px;
  background: rgb(255 255 255 / 6%);
}

.poster-offer__art {
  width: 70px;
  height: 86px;
  overflow: hidden;
  border: 2px solid rgb(255 255 255 / 15%);
  border-radius: 12px;
  box-shadow: 0 10px 22px rgb(0 0 0 / 22%);

  :deep(.card-artwork) {
    height: 100%;
  }
}

.poster-offer__copy {
  display: grid;
  min-width: 0;
  flex: 1;
  gap: 3px;
  margin-left: 14px;

  p {
    margin: 0 0 2px;
    color: var(--gold-500);
    font-size: 8px;
    font-weight: 800;
  }

  strong {
    font-size: 18px;
  }

  span {
    color: rgb(255 255 255 / 44%);
    font-size: 8px;
  }
}

.poster-offer__count {
  display: grid;
  justify-items: center;
  gap: 1px;
  padding-left: 14px;
  border-left: 1px solid rgb(255 255 255 / 10%);

  strong {
    color: var(--gold-500);
    font-size: 26px;
    line-height: 1;
  }

  span {
    color: rgb(255 255 255 / 40%);
    font-size: 7px;
  }
}

.poster-wanted {
  margin-top: 14px;
}

.poster-wanted__heading {
  padding: 0 2px;

  > div {
    display: flex;
    align-items: baseline;
    gap: 7px;
  }

  p {
    margin: 0;
    color: rgb(255 255 255 / 48%);
    font-size: 8px;
  }

  strong {
    font-size: 13px;
  }

  > span {
    color: rgb(255 255 255 / 32%);
    font-size: 7px;
  }
}

.wanted-groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
  margin-top: 8px;
}

.wanted-group {
  min-width: 0;
  padding: 7px 8px 8px;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 10px;
  background: rgb(255 255 255 / 4%);

  header {
    gap: 5px;
    min-width: 0;
    margin-bottom: 5px;

    > span {
      width: 4px;
      height: 11px;
      border-radius: 999px;
      background: var(--group-accent);
    }

    strong {
      overflow: hidden;
      flex: 1;
      font-size: 8px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      color: rgb(255 255 255 / 34%);
      font-size: 6px;
    }
  }

  ul {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2px 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    position: relative;
    overflow: hidden;
    padding-left: 6px;
    color: rgb(255 255 255 / 68%);
    font-size: 7.5px;
    line-height: 1.32;
    text-overflow: ellipsis;
    white-space: nowrap;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background: var(--group-accent);
      content: '';
      transform: translateY(-50%);
    }
  }
}

.wanted-groups.is-compact {
  gap: 6px;

  .wanted-group {
    padding-block: 6px;
  }

  .wanted-group li {
    font-size: 7px;
    line-height: 1.2;
  }
}

.trade-poster__footer {
  position: absolute;
  right: 32px;
  bottom: 22px;
  left: 32px;
  padding-top: 11px;
  border-top: 1px solid rgb(255 255 255 / 9%);

  span {
    color: rgb(255 255 255 / 34%);
    font-size: 6.5px;
  }

  strong {
    color: rgb(255 255 255 / 44%);
    font-size: 6.5px;
    letter-spacing: 0.16em;
  }
}
</style>
