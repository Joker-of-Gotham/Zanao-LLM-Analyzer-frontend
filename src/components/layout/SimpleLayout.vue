<template>
  <div class="simple-layout">
    <!-- 简化的侧边栏 -->
    <aside class="sidebar">
      <div class="logo">Zanao LLM Analyzer</div>
      <n-menu
        :options="menuOptions"
        :value="$route.name?.toString()"
      />
    </aside>

    <!-- 主内容区 -->
    <main class="content">
      <router-view /> <!-- “关于产品”页面的内容将在这里显示 -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { RouterLink } from 'vue-router';
import { NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui';

// 简化的菜单项
const menuOptions: MenuOption[] = [
  { 
    label: () => h(RouterLink, { to: { name: 'Home' } }, { default: () => '回到首页' }), 
    key: 'Home' 
  },
  { 
    label: () => h(RouterLink, { to: { name: 'About' } }, { default: () => '关于产品' }), 
    key: 'About' 
  },
];
</script>

<style scoped>
/* 样式与 MainLayout 非常相似，但可以独立定制 */
.simple-layout {
  display: flex;
  height: 100vh;
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
.content {
  flex-grow: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #101014;
}
</style>