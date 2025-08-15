<template>
  <div class="carousel-container">
    <!-- ✅ FIX: 只保留 class 绑定来控制动画，移除了 :style -->
    <div 
      class="animated-track" 
      :class="[props.direction === 'right' ? 'scroll-right' : 'scroll-left']"
      :style="animationDelayStyle"
    >
      <!-- 第一份内容 -->
      <div v-for="item in props.items" :key="item.id" class="carousel-card">
        {{ item.content }}
      </div>
      <!-- 第二份内容 -->
      <div v-for="item in props.items" :key="`${item.id}-clone`" class="carousel-card" aria-hidden="true">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  items: { id: string, content: string }[];
  direction?: 'left' | 'right';
}>(), {
  direction: 'left', // 默认向左
});

// ✅ FIX: animationStyle 现在只负责随机延迟，并且更名为 animationDelayStyle
const animationDelayStyle = computed(() => {
  const delay = -(Math.random() * 20); // 0到-20秒的随机延迟
  return {
    'animation-delay': `${delay}s`,
  };
});
</script>

<style scoped>
.carousel-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.animated-track {
  display: flex;
  /* 基础动画属性，animation-name 将由 class 提供 */
  animation-duration: 40s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}

.carousel-container:hover .animated-track {
  animation-play-state: paused;
}

/* ✅ 核心修复：使用类名来应用动画名称 */
.scroll-left {
  animation-name: scroll-left;
}
.scroll-right {
  animation-name: scroll-right;
}

/* 两个独立的动画 */
@keyframes scroll-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes scroll-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

/* 卡片样式 */
.carousel-card {
  flex: 0 0 280px;
  height: 120px;
  background-color: #303030;
  color: #e2e2e5;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-right: 16px;
  border: 1px solid #3e3e42;
}
</style>