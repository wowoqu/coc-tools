<script setup lang="ts">
import TradePoster from '@/components/TradePoster.vue'
import { useTrade } from '@/composables/useTrade'
import { exportPoster } from '@/utils/exportPoster'
import { ElMessage, ElMessageBox } from 'element-plus'

interface TradePosterExpose {
  element: HTMLElement | null
}

const router = useRouter()
const { state, offeredCard, wantedCard, setPlayerName, resetTrade } = useTrade()
const posterComponent = ref<TradePosterExpose | null>(null)
const previewShell = ref<HTMLElement | null>(null)
const previewScale = ref(1)
const exporting = ref(false)

const cleanedPlayerName = computed(() => state.playerName.trim().replace(/\s+/g, ' '))
const playerNameModel = computed({
  get: () => state.playerName,
  set: setPlayerName,
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
  if (!node || !offeredCard.value || !wantedCard.value) return

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

const handleRestart = async () => {
  try {
    await ElMessageBox.confirm('将清除卡片和玩家名称，重新开始吗？', '重新开始', {
      confirmButtonText: '重新开始',
      cancelButtonText: '取消',
      type: 'warning',
    })
    resetTrade()
    await router.replace({ name: 'trade' })
  } catch {
    // User cancelled the reset.
  }
}
</script>

<template>
  <div v-if="offeredCard && wantedCard" class="preview-page">
    <header class="preview-header">
      <button type="button" class="back-button" @click="router.push({ name: 'trade' })">← 修改选择</button>
      <div class="preview-header__brand">
        <span>C</span>
        <strong>部落换卡助手</strong>
      </div>
      <span class="preview-header__step">第 3 步 / 共 3 步</span>
    </header>

    <main class="preview-layout">
      <section class="preview-controls">
        <p class="preview-controls__kicker">READY TO SHARE</p>
        <h1>确认并生成<br />换卡图片</h1>
        <p class="preview-controls__lead">最后检查一次卡片，你也可以在图片顶部显示游戏内名称。</p>

        <div class="player-name-field">
          <div class="player-name-field__heading">
            <label for="player-name">玩家名称</label>
            <span>选填</span>
          </div>
          <el-input
            id="player-name"
            v-model="playerNameModel"
            maxlength="20"
            show-word-limit
            clearable
            size="large"
            placeholder="例如：首领 Eric"
          />
          <p>留空时，导出图片不会显示玩家名称。内容仅保存在当前浏览器。</p>
        </div>

        <div class="selection-review">
          <div>
            <span>我可以提供</span>
            <strong>{{ offeredCard.name }}</strong>
          </div>
          <span aria-hidden="true">→</span>
          <div>
            <span>我想要</span>
            <strong>{{ wantedCard.name }}</strong>
          </div>
        </div>

        <el-button type="primary" size="large" :loading="exporting" @click="handleExport">
          {{ exporting ? '正在生成高清图片' : '下载 1080 × 1350 PNG' }}
        </el-button>
        <button type="button" class="restart-button" @click="handleRestart">清除并重新开始</button>
      </section>

      <section class="preview-canvas" aria-label="换卡图片实时预览">
        <div class="preview-canvas__heading">
          <div>
            <strong>图片预览</strong>
            <span>输入名称后会实时更新</span>
          </div>
          <span>1080 × 1350</span>
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
                :wanted-card="wantedCard"
                :player-name="cleanedPlayerName"
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
    radial-gradient(circle at 82% 18%, rgb(46 108 172 / 25%), transparent 28%),
    linear-gradient(145deg, #07101d, #0d1d33 58%, #091323);
}

.preview-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: min(1260px, calc(100% - 48px));
  height: 78px;
  margin: 0 auto;
  border-bottom: 1px solid rgb(255 255 255 / 8%);
}

.back-button,
.restart-button {
  width: max-content;
  padding: 0;
  border: 0;
  color: rgb(255 255 255 / 58%);
  background: transparent;
  cursor: pointer;
}

.preview-header__brand {
  display: flex;
  align-items: center;
  gap: 9px;

  span {
    display: grid;
    width: 30px;
    height: 30px;
    place-items: center;
    border-radius: 9px;
    color: #1d2635;
    background: var(--gold-500);
    font-family: Georgia, serif;
    font-weight: 900;
  }

  strong {
    font-size: 14px;
  }
}

.preview-header__step {
  justify-self: end;
  color: rgb(255 255 255 / 42%);
  font-size: 11px;
}

.preview-layout {
  display: grid;
  grid-template-columns: minmax(340px, 0.75fr) minmax(560px, 1.25fr);
  gap: clamp(44px, 7vw, 100px);
  align-items: center;
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 54px 0 72px;
}

.preview-controls__kicker {
  margin: 0 0 12px;
  color: var(--gold-500);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.17em;
}

.preview-controls h1 {
  margin: 0;
  font-size: clamp(42px, 5.5vw, 68px);
  line-height: 1.05;
  letter-spacing: -0.055em;
}

.preview-controls__lead {
  max-width: 430px;
  margin: 18px 0 0;
  color: rgb(255 255 255 / 55%);
  line-height: 1.7;
}

.player-name-field {
  margin-top: 34px;
  padding: 20px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 18px;
  background: rgb(255 255 255 / 5%);
}

.player-name-field__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  label {
    font-size: 13px;
    font-weight: 700;
  }

  span {
    padding: 4px 7px;
    border-radius: 999px;
    color: rgb(255 255 255 / 48%);
    background: rgb(255 255 255 / 7%);
    font-size: 9px;
  }
}

.player-name-field > p {
  margin: 10px 0 0;
  color: rgb(255 255 255 / 38%);
  font-size: 10px;
  line-height: 1.6;
}

:deep(.el-input__wrapper) {
  min-height: 48px;
  border-radius: 12px;
  background: rgb(255 255 255 / 8%);
  box-shadow: 0 0 0 1px rgb(255 255 255 / 10%) inset;
}

:deep(.el-input__inner) {
  color: #fff;
}

.selection-review {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  margin: 18px 0 22px;
  padding: 16px 18px;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 16px;

  > div {
    display: grid;
    gap: 3px;
  }

  > div:last-child {
    text-align: right;
  }

  span {
    color: rgb(255 255 255 / 38%);
    font-size: 10px;
  }

  strong {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.preview-controls :deep(.el-button--primary) {
  width: 100%;
  min-height: 52px;
  border: 0;
  border-radius: 14px;
  color: #1d2635;
  background: var(--gold-500);
  font-weight: 800;
}

.restart-button {
  display: block;
  margin: 14px auto 0;
  font-size: 11px;
}

.preview-canvas {
  min-width: 0;
  padding: 20px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 26px;
  background: rgb(255 255 255 / 5%);
  box-shadow: 0 30px 90px rgb(0 0 0 / 28%);
}

.preview-canvas__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  > div {
    display: grid;
    gap: 3px;
  }

  strong {
    font-size: 13px;
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
  border-radius: 17px;
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

@media (max-width: 940px) {
  .preview-layout {
    grid-template-columns: 1fr;
    width: min(680px, calc(100% - 32px));
  }

  .preview-controls {
    max-width: 560px;
    margin: 0 auto;
  }
}

@media (max-width: 560px) {
  .preview-header {
    grid-template-columns: 1fr auto;
    width: calc(100% - 32px);
  }

  .preview-header__brand {
    display: none;
  }

  .preview-layout {
    width: calc(100% - 24px);
    gap: 34px;
    padding-top: 38px;
  }

  .preview-controls h1 {
    font-size: 45px;
  }

  .preview-canvas {
    padding: 14px;
    border-radius: 20px;
  }
}
</style>
