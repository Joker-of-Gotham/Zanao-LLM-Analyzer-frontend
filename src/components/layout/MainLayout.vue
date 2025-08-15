<template>
  <div class="main-layout">
    <aside class="sidebar" :class="{ 'is-collapsed': isCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <template v-if="!isCollapsed">
            Z<span class="logo-text">anao LLM Analyzer</span>
          </template>
        </div>
        <n-button text class="collapse-button" @click="isCollapsed = !isCollapsed">
          <template #icon>
            <n-icon :component="isCollapsed ? KeyboardDoubleArrowRightRound : KeyboardDoubleArrowLeftRound" />
          </template>
        </n-button>
      </div>
      
      <n-config-provider :theme-overrides="menuThemeOverrides">
        <!-- ✅✅✅ 最终修复：使用 @update:value 事件进行路由跳转 ✅✅✅ -->
        <n-menu
          :options="mainMenuOptions"
          :value="$route.name?.toString()"
          :collapsed="isCollapsed"
          :collapsed-width="80"
          :collapsed-icon-size="24"
          @update:value="handleMenuSelect"
        />
      </n-config-provider>
    </aside>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { h, ref, Component } from 'vue';
import { useRouter } from 'vue-router'; // ✅ NEW: 导入 useRouter
import { NMenu, NConfigProvider, NButton, NIcon } from 'naive-ui';
import type { MenuOption, GlobalThemeOverrides } from 'naive-ui';
import { KeyboardDoubleArrowLeftRound, KeyboardDoubleArrowRightRound } from '@vicons/material';
import { HomeOutlined, LocalFireDepartmentOutlined, QuestionAnswerOutlined, FindInPageOutlined, GppGoodOutlined, PersonSearchOutlined, InfoOutlined } from '@vicons/material';

const isCollapsed = ref(false);
const router = useRouter(); // ✅ NEW: 获取 router 实例

const menuThemeOverrides: GlobalThemeOverrides = {
  Menu: {
    itemHeight: '52px',
    itemColorActive: 'rgba(255, 248, 220, 0.1)',
    itemTextColorActive: '#FFFFFF',
    itemIconColorActive: '#FFFFFF',
    itemColorActiveCollapsed: 'rgba(255, 248, 220, 0.1)',
    borderRadius: '12px',
  }
};

// ✅✅✅ 最终修复：恢复编程式导航函数 ✅✅✅
const handleMenuSelect = (key: string) => {
  router.push({ name: key });
};

const renderIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) });

// ✅ mainMenuOptions 不再需要 RouterLink，只负责展示
const mainMenuOptions: MenuOption[] = [
  { label: '首页', key: 'Home', icon: renderIcon(HomeOutlined) },
  { label: '热度追踪', key: 'HotspotTracking', icon: renderIcon(LocalFireDepartmentOutlined) },
  { label: '细节问答', key: 'DetailedQA', icon: renderIcon(QuestionAnswerOutlined) },
  { label: '资源检索', key: 'ResourceRetrieval', icon: renderIcon(FindInPageOutlined) },
  { label: '舆情检测', key: 'SentimentAnalysis', icon: renderIcon(GppGoodOutlined) },
  { label: '用户分析', key: 'UserAnalysis', icon: renderIcon(PersonSearchOutlined) },
  { label: '关于产品', key: 'About', icon: renderIcon(InfoOutlined) },
];

</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  position: relative; /* 为遮罩层提供定位锚点 */
  width: 260px;
  background-color: #18181c;
  border-right: 1px solid #2d2d30;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.is-collapsed {
  width: 90px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 60px;
  flex-shrink: 0;
}
.sidebar.is-collapsed .sidebar-header {
  justify-content: center;
}


.logo {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  /* ✅ NEW: 为 Logo 添加过渡，使其消失更平滑 */
  transition: opacity 0.3s;
}

/* ✅ FIX: 使用 v-if 控制 logo-text，无需 opacity */
/* .sidebar.is-collapsed .logo-text { opacity: 0; } */

.collapse-button {
  font-size: 20px;
}

/* ✅✅✅ 核心修复：精细调整 n-menu 和其内部项的样式 ✅✅✅ */
:deep(.n-menu) {
  flex-grow: 1;
  padding-top: 16px;
}
:deep(.n-menu:not(.n-menu--collapsed) .n-menu-item-content) {
  padding: 0 20px !important;
}


/* ✅✅✅ 核心修复：收缩状态下的绝对定位布局 ✅✅✅ */

/* 1. 将每个菜单项设置为定位锚点和 Flexbox 容器 */
:deep(.n-menu--collapsed .n-menu-item) {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

/* 2. 隐藏原始的背景和内容容器，我们只用它来触发 Tooltip */
/* 2. 我们不再隐藏原始背景，而是直接修改它 */
:deep(.n-menu--collapsed .n-menu-item-content) {
  /* 尺寸控制 */
  width: 64px !important;
  height: 48px !important;
  margin: 0 auto; /* 居中 */
  
  /* 内容居中 */
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* 3. 图标绝对定位，强制居中 */
:deep(.n-menu--collapsed .n-menu-item-content__icon) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2; /* 确保图标在背景之上 */
}

/* 4. 用伪元素重新创建并绝对定位我们的高亮背景 */
:deep(.n-menu--collapsed .n-menu-item:hover .n-menu-item-content::before),
:deep(.n-menu--collapsed .n-menu-item.n-menu-item--selected .n-menu-item-content::before) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  /* ✅✅✅ 核心修改：减小尺寸 ✅✅✅ */
  width: 48px;  /* 从 56px 减小到 48px */
  height: 48px; /* 从 56px 减小到 48px */
  
  background-color: rgba(255, 248, 220, 0.1);
  border-radius: 12px; /* 圆角也可以微调，例如从 12px 减小到 10px */
  z-index: 1;
  transition: background-color 0.3s;
}

.content {
  flex-grow: 1;
  overflow-y: auto;
  background-color: #242323;
  position: relative;
}
</style>