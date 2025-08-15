<template>
  <aside class="history-sidebar" :class="{ 'is-collapsed': !isExpanded }">
    <div class="sidebar-header">
      <div class="logo">
        <template v-if="isExpanded">
          <span>对话历史</span>
        </template>
      </div>
      <n-button text class="collapse-button" @click="isExpanded = !isExpanded">
        <template #icon>
          <n-icon :component="isExpanded ? KeyboardDoubleArrowLeftRound : KeyboardDoubleArrowRightRound" />
        </template>
      </n-button>
    </div>
    
    <!-- ✅ 1. 使用 n-menu 来统一管理所有可点击项 -->
    <n-config-provider :theme-overrides="menuThemeOverrides">
      <n-scrollbar style="flex-grow: 1; min-height: 0;">
        <n-menu
          :options="menuOptions"
          :value="activeSessionId"
          :collapsed="!isExpanded"
          :collapsed-width="80"
          :collapsed-icon-size="24"
          @update:value="handleMenuSelect"
        />
      </n-scrollbar>
    </n-config-provider>
  </aside>
</template>

<script setup lang="ts">
import { h, ref, computed, Component } from 'vue';
import { NMenu, NIcon, NScrollbar, NConfigProvider } from 'naive-ui';
import type { MenuOption, GlobalThemeOverrides } from 'naive-ui';
import { KeyboardDoubleArrowLeftRound, KeyboardDoubleArrowRightRound, CreateOutlined, ChatBubbleOutlineRound } from '@vicons/material';
import type { ChatSession } from '@/types/api';

const props = defineProps<{
  sessions: ChatSession[];
  activeSessionId: string | null;
}>();

const emit = defineEmits<{
  (e: 'new-chat'): void;
  (e: 'switch-chat', id: string): void;
}>();

const isExpanded = ref(true);

const menuThemeOverrides: GlobalThemeOverrides = {
  Menu: {
    itemHeight: '48px', // 稍微减小高度
    itemColorActive: 'rgba(255, 255, 255, 0.1)',
    itemTextColorActive: '#FFFFFF',
    itemIconColorActive: '#FFFFFF',
    itemColorActiveCollapsed: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
  }
};

const renderIcon = (icon: Component) => () => h(NIcon, null, { default: () => h(icon) });

// ✅ 2. 核心修复：将“新对话”作为菜单的第一个特殊选项
const menuOptions = computed((): MenuOption[] => {
  // “新的对话”按钮
  const newChatOption: MenuOption = {
    label: '进入新对话',
    key: 'new-chat', // 使用一个特殊的 key
    icon: renderIcon(CreateOutlined),
    title: '进入新对话'
  };

  // 历史记录会话
  const historySessionOptions: MenuOption[] = props.sessions.map(session => ({
    label: session.title,
    key: session.id,
    icon: renderIcon(ChatBubbleOutlineRound),
    title: session.title,
  }));

  return [
    newChatOption,
    ...historySessionOptions,
  ];
});

// ✅ 3. 核心修复：统一的点击处理逻辑
const handleMenuSelect = (key: string) => {
  if (key === 'new-chat') {
    emit('new-chat');
  } else {
    emit('switch-chat', key);
  }
};

</script>

<style scoped>
/* ✅✅✅ 最终的、简洁的样式 ✅✅✅ */
.history-sidebar {
  position: relative;
  flex-shrink: 0;
  width: 260px;
  background-color: #18181c;
  border-left: 1px solid #2d2d30;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.history-sidebar.is-collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 60px;
  flex-shrink: 0;
}

.history-sidebar.is-collapsed .sidebar-header {
  justify-content: center;
}

.logo {
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.2s;
}

.history-sidebar.is-collapsed .logo {
  opacity: 0;
}

.collapse-button {
  font-size: 20px;
}

/* 移除了 .new-chat-section */

:deep(.n-menu) {
  flex-grow: 1;
  padding: 8px 12px;
}

/* 展开状态下 */
:deep(.n-menu:not(.n-menu--collapsed) .n-menu-item-content) {
  padding: 0 16px !important;
}

/* 收缩状态下 */
:deep(.n-menu--collapsed .n-menu-item-content) {
  padding: 0 !important;
  justify-content: center !important;
}
:deep(.n-menu--collapsed .n-menu-item-content__icon) {
  margin: 0 !important;
}
</style>