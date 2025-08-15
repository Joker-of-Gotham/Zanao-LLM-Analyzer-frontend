<template>
  <div class="home-page">
    <!-- ✅ NEW: Github 链接，绝对定位在页面右上角 -->
    <a href="https://github.com/Joker-of-Gotham/Zanao-LLM-Analyzer" target="_blank" class="github-link">
      <n-button quaternary>
        <template #icon><n-icon :component="LogoGithub" /></template>
        Github Page
      </n-button>
    </a>
    
    <!-- Hero 区域 -->
    <div class="hero-section">
      <p2>Zanao LLM Analyzer</p2>
      <h1>热点发掘, 资源汇总, 提升效率</h1>
      <p>本地资源部署, 高效信息爬取; 多角度数据挖掘, 智能化深度分析; 有问即有所答</p>
      <div class="hero-actions">
        <!-- ✅ FIX: 为按钮添加自定义类名 -->
        <n-button
          class="cta-button"
          size="large"
          @click="$router.push({ name: 'HotspotTracking' })"
        >
          立即开始
          <template #icon><n-icon :component="ArrowForward" /></template>
        </n-button>
        <n-button text size="large" @click="$router.push({ name: 'About' })">
          关于产品
        </n-button>
      </div>
    </div>

    <!-- 三行滑动栏 -->
    <div class="carousels-section">
      <!-- ✅ FIX: 正确传递 direction prop -->
      <CardCarousel :items="carouselItems.posts" direction="right" />
      <CardCarousel :items="carouselItems.prompts" direction="left" />
      <CardCarousel :items="carouselItems.comments" direction="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// ✅ NEW: 导入 n-config-provider 和 GlobalThemeOverrides 类型
import { NButton, NIcon} from 'naive-ui';
import { ArrowForward, LogoGithub } from '@vicons/ionicons5';
import CardCarousel from '@/components/common/CardCarousel.vue';

// 模拟滑动栏的数据
const carouselItems = ref({
  posts: Array.from({ length: 10 }, (_, i) => ({ id: `p${i}`, content: `Post Title ${i + 1}` })),
  prompts: Array.from({ length: 10 }, (_, i) => ({ id: `r${i}`, content: `Prompt ${i + 1}` })),
  comments: Array.from({ length: 10 }, (_, i) => ({ id: `c${i}`, content: `Comment ${i + 1}` })),
});
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100%; 
}

.github-link {
  position: absolute;
  top: 20px;  /* 与页面上边距一致 */
  right: 16px; /* 定位到右侧，并与页面右边距一致 */
  z-index: 10;
}

.hero-section {
  /* ✅ CHANGED: 减小了 flex-grow 的值，让它占据更少的空间 */
  flex-grow: 0.7; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2%;
}

.hero-section h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 24px;
}
.hero-section p2 {
  font-size: 1.8rem;
  color: #a0a0ab;
  margin-bottom: 10px;
  white-space: nowrap;
}
.hero-section p {
  font-size: 1.1rem;
  color: #a0a0ab;
  margin-bottom: 30px;
  white-space: nowrap;
}
.hero-actions {
  display: flex;
  gap: 24px;
  align-items: center;
}

/* ✅✅✅ FIX: 使用 CSS 类强制覆盖按钮颜色 ✅✅✅ */
.cta-button {
  --n-color: #C9E41B !important;
  --n-color-hover: #d2f021 !important;
  --n-color-pressed: #b8d111 !important;
  --n-text-color: #1a1a1a !important;
  --n-border-radius: 24px !important;
  --n-border: none !important;
}

.carousels-section {
  flex-shrink: 0;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>