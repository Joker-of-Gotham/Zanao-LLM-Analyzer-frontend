<template>
  <div class="home-page">
    <!-- 1. Hero 区域 (保持不变) -->
    <div class="hero-section">
      <h1>热点发掘, 资源汇总, 提升效率</h1>
      <p>本地资源部署, 高效信息爬取; 多角度数据挖掘, 智能化深度分析; 有问即有所答</p>
      <div class="hero-actions">
        <n-button type="primary" size="large" @click="$router.push({ name: 'HotspotTracking' })">
          立即开始
          <template #icon><n-icon :component="ArrowForward" /></template>
        </n-button>
        <n-button text size="large" @click="$router.push({ name: 'About' })">
          关于产品
        </n-button>
      </div>
    </div>

    <!-- 2. 三行滑动栏 -->
    <div class="carousels-section">
      <!-- ✅ CHANGED: 为滑动栏添加了 direction 属性 -->
      <CardCarousel :items="carouselItems.posts" direction="right" />
      <n-divider />
      <CardCarousel :items="carouselItems.prompts" direction="left" />
      <n-divider />
      <CardCarousel :items="carouselItems.comments" direction="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NIcon, NDivider } from 'naive-ui';
import { ArrowForward } from '@vicons/ionicons5';
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

.hero-section {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px;
  background-color: #2a2a2e;
  border-radius: 12px;
}

.hero-section h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 16px;
}
.hero-section p {
  font-size: 1.1rem;
  color: #a0a0ab;
  max-width: 600px;
  margin-bottom: 32px;
}
.hero-actions {
  display: flex;
  gap: 24px;
  align-items: center;
}

.carousels-section {
  flex-shrink: 0;
  padding-top: 24px;
  background-color: #101014;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.n-divider) {
  margin: 0 !important;
  background-color: #2d2d30;
}
</style>