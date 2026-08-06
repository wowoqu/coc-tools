<template>
  <main class="preview-placeholder">
    <p>海报预览将在阶段四完成。</p>
    <RouterLink to="/">返回选卡</RouterLink>
  </main>
</template>

<style scoped lang="scss">
.preview-placeholder {
  min-height: 100svh;
  display: grid;
  place-content: center;
  gap: 16px;
  text-align: center;

  a {
    color: var(--brand-600);
  }
}
</style>
