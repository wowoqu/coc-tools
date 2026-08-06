<script setup lang="ts">
import { activityConfig } from '@/config/activity'
</script>

<template>
  <header class="hero-banner">
    <picture class="hero-banner__media" aria-hidden="true">
      <source media="(max-width: 640px)" :srcset="activityConfig.banner.mobile" />
      <img :src="activityConfig.banner.desktop" :alt="activityConfig.banner.alt" />
    </picture>
    <div class="hero-banner__overlay"></div>
    <div class="hero-banner__content">
      <p class="hero-banner__eyebrow">{{ activityConfig.eyebrow }}</p>
      <h1>{{ activityConfig.title }}</h1>
      <p class="hero-banner__subtitle">{{ activityConfig.subtitle }}</p>
      <div class="hero-banner__trust">
        <span>无需登录</span>
        <span>本地保存</span>
        <span>一键出图</span>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.hero-banner {
  position: relative;
  min-height: 430px;
  overflow: hidden;
  color: #fff;
  background: var(--brand-900);
}

.hero-banner__media,
.hero-banner__media img,
.hero-banner__overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-banner__media img {
  object-fit: cover;
  object-position: center;
  animation: reveal 800ms ease-out both;
}

.hero-banner__overlay {
  background:
    linear-gradient(90deg, rgb(4 12 25 / 96%) 0%, rgb(5 16 32 / 82%) 32%, rgb(5 16 32 / 14%) 68%),
    linear-gradient(0deg, rgb(7 16 29 / 66%), transparent 55%);
}

.hero-banner__content {
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding-top: 102px;
}

.hero-banner__eyebrow {
  margin: 0 0 14px;
  color: var(--gold-500);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.18em;
}

h1 {
  max-width: 620px;
  margin: 0;
  font-size: clamp(48px, 6.4vw, 82px);
  line-height: 1.04;
  letter-spacing: -0.055em;
  text-wrap: balance;
}

.hero-banner__subtitle {
  max-width: 520px;
  margin: 22px 0 0;
  color: rgb(255 255 255 / 76%);
  font-size: clamp(17px, 2vw, 21px);
  line-height: 1.7;
}

.hero-banner__trust {
  display: flex;
  gap: 10px;
  margin-top: 28px;

  span {
    padding: 8px 12px;
    border: 1px solid rgb(255 255 255 / 14%);
    border-radius: 999px;
    color: rgb(255 255 255 / 82%);
    background: rgb(6 18 35 / 44%);
    font-size: 12px;
    backdrop-filter: blur(8px);
  }
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: scale(1.03);
  }
}

@media (max-width: 640px) {
  .hero-banner {
    min-height: 390px;
  }

  .hero-banner__media img {
    object-position: 66% center;
  }

  .hero-banner__overlay {
    background:
      linear-gradient(90deg, rgb(4 12 25 / 93%), rgb(5 16 32 / 38%)),
      linear-gradient(0deg, rgb(7 16 29 / 88%) 0%, transparent 72%);
  }

  .hero-banner__content {
    width: calc(100% - 36px);
    padding-top: 78px;
  }

  h1 {
    max-width: 280px;
    font-size: 46px;
  }

  .hero-banner__subtitle {
    max-width: 300px;
    margin-top: 16px;
    font-size: 16px;
  }

  .hero-banner__trust {
    gap: 6px;
    margin-top: 22px;

    span {
      padding: 7px 9px;
      font-size: 11px;
    }
  }
}
</style>
