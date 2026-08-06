<script setup lang="ts">
defineProps<{
  step: 'offer' | 'want'
  canOpenWant: boolean
}>()

const emit = defineEmits<{
  change: [step: 'offer' | 'want']
}>()
</script>

<template>
  <section class="steps-card" aria-label="换卡步骤">
    <div class="steps-card__intro">
      <p class="steps-card__kicker">简单三步</p>
      <h2>选卡、确认、分享</h2>
      <p>所有内容只保存在你的浏览器中，不会上传玩家信息。</p>
    </div>

    <el-steps :active="step === 'offer' ? 0 : 1" finish-status="success" align-center>
      <el-step>
        <template #title>
          <button type="button" class="step-button" @click="emit('change', 'offer')">我有重复</button>
        </template>
        <template #description>选择可以提供的卡</template>
      </el-step>
      <el-step>
        <template #title>
          <button
            type="button"
            class="step-button"
            :disabled="!canOpenWant"
            @click="emit('change', 'want')"
          >
            我想要
          </button>
        </template>
        <template #description>选择还没有的卡</template>
      </el-step>
      <el-step title="生成图片" description="预览并下载分享图" />
    </el-steps>
  </section>
</template>

<style scoped lang="scss">
.steps-card {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(230px, 0.8fr) minmax(540px, 1.7fr);
  gap: 58px;
  align-items: center;
  width: min(1180px, calc(100% - 48px));
  margin: -52px auto 0;
  padding: 30px 38px;
  border: 1px solid rgb(228 233 241 / 78%);
  border-radius: 24px;
  background: rgb(255 255 255 / 95%);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(14px);
}

.steps-card__kicker {
  margin: 0 0 6px;
  color: var(--brand-600);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

h2 {
  margin: 0;
  font-size: 25px;
  letter-spacing: -0.025em;
}

.steps-card__intro > p:last-child {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.55;
}

.step-button {
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  font-weight: inherit;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-visible {
    border-radius: 4px;
    outline: 2px solid var(--brand-600);
    outline-offset: 3px;
  }
}

@media (max-width: 900px) {
  .steps-card {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

@media (max-width: 640px) {
  .steps-card {
    width: calc(100% - 28px);
    margin-top: -36px;
    padding: 24px 16px;
    border-radius: 20px;
  }

  .steps-card__intro {
    padding-inline: 8px;
  }

  :deep(.el-step__description) {
    display: none;
  }

  :deep(.el-step__title) {
    font-size: 13px;
  }
}
</style>
