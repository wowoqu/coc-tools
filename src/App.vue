<template>
  <main class="app-shell" aria-live="polite">
    <div class="setup-card">
      <span class="setup-card__eyebrow">COC CARD EXCHANGE</span>
      <h1>部落换卡助手</h1>
      <p>正在准备轻量、清晰的换卡体验。</p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at 20% 15%, rgb(47 107 191 / 28%), transparent 35%),
    linear-gradient(145deg, #07101d, #102849);
}

.setup-card {
  width: min(560px, 100%);
  padding: 48px;
  text-align: center;
  color: #fff;
  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 28px;
  background: rgb(11 25 45 / 72%);
  box-shadow: 0 24px 80px rgb(0 0 0 / 28%);
  backdrop-filter: blur(18px);

  h1 {
    margin: 12px 0;
    font-size: clamp(34px, 7vw, 56px);
  }

  p {
    margin: 0;
    color: rgb(255 255 255 / 70%);
  }
}

.setup-card__eyebrow {
  color: #f5c95a;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.18em;
}
</style>
