<template>
  <div class="main-layout">
    <!-- 主功能侧边栏 (保持不变) -->
    <aside class="sidebar">
      <div class="logo">Zanao LLM Analyzer</div>
      <n-menu
        :options="mainMenuOptions"
        :value="$route.name?.toString()"
      />
    </aside>

    <!-- ✅ CHANGED: 将原有的 main.content 包裹在一个新的 div 中，以容纳 header -->
    <div class="content-wrapper">
      <!-- ✅ NEW: 添加了全局 Header -->
      <header class="main-header">
        <a href="https://github.com/Joker-of-Gotham/Zanao-LLM-Analyzer" target="_blank" rel="noopener noreferrer">
          <n-button quaternary>
            <template #icon><n-icon :component="LogoGithub" /></template>
            Github Page
          </n-button>
        </a>
      </header>
      
      <!-- 主内容区 (原有的 main.content) -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { RouterLink } from 'vue-router';
// ✅ CHANGED: 导入了 NButton, NIcon, 和 LogoGithub
import { NMenu, NButton, NIcon } from 'naive-ui';
import { LogoGithub } from '@vicons/ionicons5';
import type { MenuOption } from 'naive-ui';

// 主功能菜单 (保持不变)
const mainMenuOptions: MenuOption[] = [
  { label: () => h(RouterLink, { to: { name: 'Home' } }, { default: () => '首页' }), key: 'Home' },
  { label: () => h(RouterLink, { to: { name: 'HotspotTracking' } }, { default: () => '热度追踪' }), key: 'HotspotTracking' },
  { label: () => h(RouterLink, { to: { name: 'DetailedQA' } }, { default: () => '细节问答' }), key: 'DetailedQA' },
  { label: () => h(RouterLink, { to: { name: 'ResourceRetrieval' } }, { default: () => '资源检索' }), key: 'ResourceRetrieval' },
  { label: () => h(RouterLink, { to: { name: 'SentimentAnalysis' } }, { default: () => '舆情检测' }), key: 'SentimentAnalysis' },
  { label: () => h(RouterLink, { to: { name: 'UserAnalysis' } }, { default: () => '用户分析' }), key: 'UserAnalysis' },
  { label: () => h(RouterLink, { to: { name: 'About' } }, { default: () => '关于产品' }), key: 'About' },
];
</script>

<style scoped>
/* 原始样式 (保持不变) */
.main-layout {
  display: flex;
  height: 100vh;
  /* ✅ CHANGED: 将背景色移至 content-wrapper，避免影响 sidebar */
}

.sidebar {
  width: 200px;
  background-color: #18181c;
  border-right: 1px solid #2d2d30;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  padding: 20px;
  text-align: center;
  color: #fff;
}

/* ✅ NEW: content-wrapper 用于 flex 布局 */
.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* 防止内部滚动条影响布局 */
  background-color: #101014; /* ✅ NEW: 将背景色移到这里 */
}

/* ✅ NEW: 全局 Header 样式 */
.main-header {
  height: 60px;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end; /* 右对齐 */
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #2d2d30;
}

/* ✅ CHANGED: 修改 content 样式以适应新的布局 */
.content {
  flex-grow: 1;
  overflow-y: auto; 
  padding: 24px; /* ✅ 统一为所有页面添加内边距 */
  /* height 不再需要，由 flex-grow 自动计算 */
}
</style>