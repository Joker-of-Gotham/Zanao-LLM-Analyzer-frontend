<template>
  <div class="timeline-container" ref="containerRef">
    <!-- ✅ FIX: 使用 props.events 替代 events -->
    <div
      v-for="(event, index) in props.events" 
      :key="event.id"
      class="timeline-node"
      :class="{ active: activeIndex === index }"
      @click="handleNodeClick(index)"
    >
      <div class="line-segment"></div>
      <div class="dot"></div>
      <div class="time-label">{{ formatTimestamp(event.timestamp) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ActivityEvent } from '@/types/api';

const props = defineProps<{
  events: ActivityEvent[];
}>();

const emit = defineEmits<{
  (e: 'select', index: number): void;
}>();

const activeIndex = ref(0);

const handleNodeClick = (index: number) => {
  activeIndex.value = index;
  emit('select', index);
};

// 简单的日期格式化函数
const formatTimestamp = (ts: string) => {
  const date = new Date(ts);
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.timeline-container {
  display: flex;
  overflow-x: auto;
  padding: 20px 0;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #555 #333; /* Firefox */
}
.timeline-container::-webkit-scrollbar {
  height: 6px;
}
.timeline-container::-webkit-scrollbar-track {
  background: #333;
}
.timeline-container::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 6px;
}

.timeline-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 40px;
  cursor: pointer;
}

.line-segment {
  position: absolute;
  top: 9px;
  left: -50%;
  width: 200%;
  height: 2px;
  background-color: #4a4a52;
  z-index: 1;
}
.timeline-node:first-child .line-segment {
  left: 50%;
  width: 50%;
}
.timeline-node:last-child .line-segment {
  left: 0;
  width: 50%;
}

.dot {
  width: 20px;
  height: 20px;
  background-color: #4a4a52;
  border: 3px solid #343541;
  border-radius: 50%;
  z-index: 2;
  transition: background-color 0.3s ease;
}

.time-label {
  margin-top: 12px;
  font-size: 12px;
  color: #a0a0ab;
  white-space: nowrap;
}

.timeline-node.active .dot {
  background-color: #18a058; /* 高亮颜色 */
}
.timeline-node.active .time-label {
  color: #e2e2e5;
  font-weight: bold;
}
</style>