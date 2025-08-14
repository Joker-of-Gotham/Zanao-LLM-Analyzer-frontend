<template>
  <div class="history-container" :class="{ 'is-expanded': isExpanded }">
    <!-- 折叠时的句柄 -->
    <div class="handle" @click="isExpanded = !isExpanded">
      <!-- ✅ CHANGED: 使用新的图标组件 -->
      <n-icon :component="isExpanded ? ChevronLeftFilled : ChevronRightFilled" />
    </div>

    <!-- 展开后的内容 -->
    <div v-if="isExpanded" class="history-content">
      <div class="header">
        <n-button block strong secondary @click="emit('new-chat')">
          + 新的对话
        </n-button>
      </div>
      <n-scrollbar style="max-height: calc(100% - 60px);">
        <n-menu
          :options="historyOptions"
          :value="activeSessionId"
          @update:value="sessionId => emit('switch-chat', sessionId)"
        />
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NButton, NMenu, NIcon, NScrollbar } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { ChevronLeftFilled, ChevronRightFilled } from '@vicons/material';
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

const historyOptions = computed((): MenuOption[] =>
  props.sessions.map(session => ({
    label: session.title,
    key: session.id,
  }))
);
</script>

<style scoped>
.history-container {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background-color: #2a2a2e;
  border: 1px solid #3e3e42;
  border-right: none;
  border-radius: 12px 0 0 12px;
  transition: all 0.3s ease;
  z-index: 1000;
  height: 70vh;
  max-height: 600px;
  display: flex;
}

.history-container.is-expanded {
  width: 280px;
}

.history-container:not(.is-expanded) {
  width: 32px;
}

.handle {
  width: 32px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #c7c7d1;
}
.handle:hover {
  color: white;
}

.history-content {
  width: 100%;
  padding: 8px;
  overflow: hidden;
}
.header {
  padding-bottom: 8px;
}
</style>