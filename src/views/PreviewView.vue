<script setup lang="ts">
import TradePoster from '@/components/TradePoster.vue'
import { useTrade } from '@/composables/useTrade'
import { exportPoster } from '@/utils/exportPoster'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

interface TradePosterExpose {
  element: HTMLElement | null
}

const router = useRouter()
const { state, offeredCard, wantedCards, setPlayerName, setClanName, setClanId } = useTrade()
const posterComponent = ref<TradePosterExpose | null>(null)
const previewShell = ref<HTMLElement | null>(null)
const previewScale = ref(1)
const exporting = ref(false)

const cleanText = (value: string) => value.trim().replace(/\s+/g, ' ')
const cleanedPlayerName = computed(() => cleanText(state.playerName))
const cleanedClanName = computed(() => cleanText(state.clanName))
const cleanedClanId = computed(() => cleanText(state.clanId))
const playerNameModel = computed({
  get: () => state.playerName,
  set: setPlayerName,
})
const clanNameModel = computed({
  get: () => state.clanName,
  set: setClanName,
})
const clanIdModel = computed({
  get: () => state.clanId,
  set: setClanId,
})

const formatEnglishList = (items: string[]) => {
  const quotedItems = items.map((item) => `"${item}"`)
  if (quotedItems.length <= 1) return quotedItems[0] ?? ''
  if (quotedItems.length === 2) return quotedItems.join(' or ')
  return `${quotedItems.slice(0, -1).join(', ')}, or ${quotedItems.at(-1)}`
}

const englishCategoryByGroupId: Record<string, string> = {
  elixir: 'Elixir card',
  'dark-elixir': 'Dark Elixir card',
  'builder-base': 'Builder Base card',
  'super-troops': 'Super Troop card',
}

const tradeMessage = computed(() => {
  if (!offeredCard.value || !wantedCards.value.length) return ''

  const chineseCardNames = wantedCards.value.map((card) => `「${card.name}」`).join('、')
  const englishCardNames = formatEnglishList(wantedCards.value.map((card) => card.englishName))
  const englishCategory = englishCategoryByGroupId[offeredCard.value.groupId] ?? 'Clash of Clans card'
  const englishArticle = /^[aeiou]/i.test(englishCategory) ? 'an' : 'a'
  const hasSingleWantedCard = wantedCards.value.length === 1
  const chineseLines = [
    `我有一张${offeredCard.value.category}：「${offeredCard.value.name}」，想换一张其他${offeredCard.value.category}。`,
    hasSingleWantedCard
      ? `我需要这张卡片：${chineseCardNames}。`
      : `我需要以下任意一张卡片：${chineseCardNames}。`,
  ]
  const englishLines = [
    `I have ${englishArticle} ${englishCategory}: "${offeredCard.value.englishName}", and I'd like to trade it for another ${englishCategory}.`,
    hasSingleWantedCard
      ? `I need the following card: ${englishCardNames}.`
      : `I need any one of the following cards: ${englishCardNames}.`,
  ]

  if (cleanedPlayerName.value) {
    chineseLines.push(`我的游戏名称是「${cleanedPlayerName.value}」。`)
    englishLines.push(`My in-game name is "${cleanedPlayerName.value}".`)
  }

  if (cleanedClanName.value && cleanedClanId.value) {
    chineseLines.push(
      `如果你想换卡，请加入部落「${cleanedClanName.value}」（部落 ID：${cleanedClanId.value}），并在部落聊天中发送换卡消息联系我。`,
    )
    englishLines.push(
      `If you'd like to trade, please join clan "${cleanedClanName.value}" (Clan ID: ${cleanedClanId.value}) and send me a card trade message in clan chat.`,
    )
  } else if (cleanedClanName.value) {
    chineseLines.push(`如果你想换卡，请加入部落「${cleanedClanName.value}」，并在部落聊天中发送换卡消息联系我。`)
    englishLines.push(
      `If you'd like to trade, please join clan "${cleanedClanName.value}" and send me a card trade message in clan chat.`,
    )
  } else if (cleanedClanId.value) {
    chineseLines.push(`如果你想换卡，请加入部落 ID 为 ${cleanedClanId.value} 的部落，并在部落聊天中发送换卡消息联系我。`)
    englishLines.push(
      `If you'd like to trade, please join the clan with ID ${cleanedClanId.value} and send me a card trade message in clan chat.`,
    )
  } else {
    chineseLines.push('如果你想换卡，请在游戏内发送换卡消息联系我。')
    englishLines.push("If you'd like to trade, please send me a card trade message in-game.")
  }

  return ['【换卡信息 / Card Trade】', '', ...chineseLines, '', ...englishLines].join('\n')
})

let resizeObserver: ResizeObserver | null = null

const updateScale = () => {
  if (!previewShell.value) return
  previewScale.value = Math.min(1, previewShell.value.clientWidth / 540)
}

onMounted(() => {
  updateScale()
  resizeObserver = new ResizeObserver(updateScale)
  if (previewShell.value) resizeObserver.observe(previewShell.value)
})

onUnmounted(() => resizeObserver?.disconnect())

const handleExport = async () => {
  const node = posterComponent.value?.element
  if (!node || !offeredCard.value || !wantedCards.value.length) return

  exporting.value = true
  try {
    await nextTick()
    await exportPoster(node, cleanedPlayerName.value)
    ElMessage.success('高清换卡图片已生成')
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成图片失败，请稍后重试'
    ElMessage.error(message)
  } finally {
    exporting.value = false
  }
}

const copyWithFallback = (text: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.readOnly = true
  textarea.style.position = 'fixed'
  textarea.style.inset = '0 auto auto -9999px'
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)
  const copied = document.execCommand('copy')
  textarea.remove()
  if (!copied) throw new Error('复制失败')
}

const handleCopyTradeMessage = async () => {
  if (!tradeMessage.value) return

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(tradeMessage.value)
    } else {
      copyWithFallback(tradeMessage.value)
    }
    ElMessage.success('中英文换卡信息已复制，可以直接粘贴发送')
  } catch {
    ElMessage.error('复制失败，请检查浏览器的剪贴板权限后重试')
  }
}
</script>

<template>
  <div v-if="offeredCard && wantedCards.length" class="preview-page">
    <header class="preview-header">
      <button type="button" class="back-button" @click="router.push({ name: 'trade' })">← 修改选择</button>
      <strong>预览换卡图片</strong>
      <span>1080 × 1350</span>
    </header>

    <main class="preview-layout">
      <section class="preview-controls">
        <h1>确认并分享</h1>
        <p>下载换卡图片，或复制清晰的中英文换卡信息，直接粘贴到游戏聊天中发送。</p>

        <div class="poster-info-fields">
          <div class="poster-info-fields__heading">
            <strong>海报信息</strong>
            <span>均为选填</span>
          </div>

          <label class="poster-info-field" for="player-name">
            <span>玩家名称</span>
            <el-input
              id="player-name"
              v-model="playerNameModel"
              maxlength="20"
              clearable
              size="large"
              placeholder="例如：首领 Eric"
            />
          </label>

          <label class="poster-info-field" for="clan-name">
            <span>部落名称</span>
            <el-input
              id="clan-name"
              v-model="clanNameModel"
              maxlength="20"
              clearable
              size="large"
              placeholder="例如：野猪骑士之家"
            />
          </label>

          <label class="poster-info-field" for="clan-id">
            <span>部落 ID</span>
            <el-input
              id="clan-id"
              v-model="clanIdModel"
              maxlength="20"
              clearable
              size="large"
              placeholder="例如：#2ABCDEF"
            />
          </label>

          <small>填写的信息会同时用于图片和复制文字；留空的项目将自动省略</small>
        </div>

        <div class="preview-actions">
          <el-button type="primary" size="large" :loading="exporting" @click="handleExport">
            {{ exporting ? '正在生成图片' : '下载高清 PNG' }}
          </el-button>
          <el-button class="copy-message-button" size="large" @click="handleCopyTradeMessage">
            复制中英文换卡信息
          </el-button>
          <small>复制后可直接粘贴到部落聊天或其他聊天应用中</small>
        </div>
      </section>

      <section class="preview-canvas" aria-label="换卡图片实时预览">
        <div class="preview-canvas__heading">
          <strong>图片预览</strong>
          <span>{{ wantedCards.length }} 张缺卡全部显示</span>
        </div>

        <div ref="previewShell" class="poster-shell">
          <div
            class="poster-stage"
            :style="{ width: `${540 * previewScale}px`, height: `${675 * previewScale}px` }"
          >
            <div class="poster-stage__scaled" :style="{ transform: `scale(${previewScale})` }">
              <TradePoster
                ref="posterComponent"
                :offered-card="offeredCard"
                :wanted-cards="wantedCards"
                :player-name="cleanedPlayerName"
                :clan-name="cleanedClanName"
                :clan-id="cleanedClanId"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
.preview-page {
  min-height: 100svh;
  color: #fff;
  background:
    radial-gradient(circle at 82% 18%, rgb(46 108 172 / 21%), transparent 28%),
    linear-gradient(145deg, #07101d, #0d1d33 58%, #091323);
}

.preview-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: min(1180px, calc(100% - 48px));
  height: 68px;
  margin: 0 auto;
  border-bottom: 1px solid rgb(255 255 255 / 8%);

  strong {
    font-size: 13px;
  }

  > span {
    justify-self: end;
    color: rgb(255 255 255 / 38%);
    font-size: 10px;
  }
}

.back-button {
  width: max-content;
  padding: 0;
  border: 0;
  color: rgb(255 255 255 / 58%);
  background: transparent;
  cursor: pointer;
}

.preview-layout {
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(560px, 1fr);
  gap: clamp(42px, 7vw, 90px);
  align-items: center;
  width: min(1100px, calc(100% - 48px));
  margin: 0 auto;
  padding: 44px 0 64px;
}

.preview-controls h1 {
  margin: 0;
  font-size: clamp(38px, 4.5vw, 54px);
  line-height: 1.08;
  letter-spacing: -0.05em;
}

.preview-controls > p {
  margin: 14px 0 0;
  color: rgb(255 255 255 / 52%);
  font-size: 13px;
  line-height: 1.7;
}

.poster-info-fields {
  display: grid;
  gap: 12px;
  margin: 27px 0 16px;
  padding: 16px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 15px;
  background: rgb(255 255 255 / 5%);

  &__heading {
    display: flex;
    align-items: center;
    justify-content: space-between;

    strong {
      font-size: 12px;
    }
  }

  &__heading span,
  small {
    color: rgb(255 255 255 / 40%);
    font-size: 9px;
  }
}

.poster-info-field {
  display: grid;
  gap: 6px;

  > span {
    color: rgb(255 255 255 / 72%);
    font-size: 10px;
    font-weight: 700;
  }
}

:deep(.el-input__wrapper) {
  min-height: 46px;
  border-radius: 11px;
  background: rgb(255 255 255 / 8%);
  box-shadow: 0 0 0 1px rgb(255 255 255 / 10%) inset;
}

:deep(.el-input__inner) {
  color: #fff;
}

.preview-actions {
  display: grid;
  gap: 10px;

  > small {
    color: rgb(255 255 255 / 40%);
    font-size: 9px;
    line-height: 1.5;
    text-align: center;
  }
}

.preview-actions :deep(.el-button) {
  width: 100%;
  min-height: 50px;
  margin-left: 0;
  border-radius: 13px;
  font-weight: 800;
}

.preview-actions :deep(.el-button--primary) {
  border: 0;
  color: #1d2635;
  background: var(--gold-500);
}

.preview-actions :deep(.copy-message-button) {
  border-color: rgb(255 255 255 / 18%);
  color: rgb(255 255 255 / 88%);
  background: rgb(255 255 255 / 7%);

  &:hover,
  &:focus-visible {
    border-color: rgb(255 255 255 / 32%);
    color: #fff;
    background: rgb(255 255 255 / 12%);
  }
}

.preview-canvas {
  min-width: 0;
  padding: 17px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 23px;
  background: rgb(255 255 255 / 5%);
  box-shadow: 0 28px 80px rgb(0 0 0 / 26%);
}

.preview-canvas__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 13px;

  strong {
    font-size: 12px;
  }

  span {
    color: rgb(255 255 255 / 38%);
    font-size: 9px;
  }
}

.poster-shell {
  display: grid;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
}

.poster-stage {
  position: relative;
}

.poster-stage__scaled {
  position: absolute;
  top: 0;
  left: 0;
  width: 540px;
  height: 675px;
  transform-origin: top left;
}

@media (max-width: 900px) {
  .preview-layout {
    grid-template-columns: 1fr;
    width: min(680px, calc(100% - 32px));
  }

  .preview-controls {
    width: min(460px, 100%);
    margin: 0 auto;
  }
}

@media (max-width: 560px) {
  .preview-header {
    grid-template-columns: 1fr auto;
    width: calc(100% - 32px);

    strong {
      display: none;
    }
  }

  .preview-layout {
    width: calc(100% - 24px);
    gap: 30px;
    padding-top: 34px;
  }

  .preview-controls h1 {
    font-size: 40px;
  }

  .preview-canvas {
    padding: 12px;
    border-radius: 18px;
  }
}
</style>
