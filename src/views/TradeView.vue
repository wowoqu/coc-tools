<template>
  <main class="stage-placeholder">
    <span>阶段 2 / 5</span>
    <h1>选卡流程已就绪</h1>
    <p>下一阶段将接入完整 Banner、分组卡片和操作反馈。</p>
  </main>
</template>

<style scoped lang="scss">
.stage-placeholder {
  min-height: 100svh;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 12px;
  padding: 24px;
  text-align: center;
  background: linear-gradient(145deg, #07101d, #102849);
  color: rgb(255 255 255 / 72%);

  span {
    color: var(--gold-500);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.16em;
  }

  h1 {
    margin: 0;
    color: #fff;
    font-size: clamp(36px, 7vw, 60px);
  }

  p {
    margin: 0;
  }
}
</style>
