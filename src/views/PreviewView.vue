<script setup lang="ts">
import TradePoster from '@/components/TradePoster.vue'
import { useTrade } from '@/composables/useTrade'
import { exportPoster } from '@/utils/exportPoster'
import { ElMessage } from 'element-plus'

interface TradePosterExpose {
  element: HTMLElement | null
}

const router = useRouter()
const { state, offeredCard, wantedCards, setPlayerName } = useTrade()
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
        <h1>确认后下载</h1>
        <p>图片会完整显示你提供的卡，以及当前选择的 {{ wantedCards.length }} 张缺卡。</p>

        <div class="player-name-field">
          <div>
            <label for="player-name">玩家名称</label>
            <span>选填</span>
          </div>
          <el-input
            id="player-name"
            v-model="playerNameModel"
            maxlength="20"
            clearable
            size="large"
            placeholder="例如：首领 Eric"
          />
          <small>留空时图片不会显示玩家名称</small>
        </div>

        <el-button type="primary" size="large" :loading="exporting" @click="handleExport">
          {{ exporting ? '正在生成图片' : '下载高清 PNG' }}
        </el-button>
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

.player-name-field {
  display: grid;
  gap: 9px;
  margin: 27px 0 16px;
  padding: 16px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 15px;
  background: rgb(255 255 255 / 5%);

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  label {
    font-size: 12px;
    font-weight: 700;
  }

  span,
  small {
    color: rgb(255 255 255 / 40%);
    font-size: 9px;
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

.preview-controls :deep(.el-button--primary) {
  width: 100%;
  min-height: 50px;
  border: 0;
  border-radius: 13px;
  color: #1d2635;
  background: var(--gold-500);
  font-weight: 800;
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
