<template>
  <div class="carousel-container">
    <div class="animated-track" :class="`direction-${direction}`">
      <!-- 第一份内容 -->
      <div v-for="item in items" :key="item.id" class="carousel-card">
        {{ item.content }}
      </div>
      <!-- 第二份完全相同的内容，用于实现无缝循环 -->
      <div v-for="item in items" :key="`${item.id}-clone`" class="carousel-card" aria-hidden="true">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: { id: string, content: string }[];
  direction?: 'left' | 'right'; // 接收一个可选的方向属性
}>();
</script>

<style scoped>
.carousel-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
  mask-image: linear-gradient(to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}

.animated-track {
  display: flex;
  /* 默认使用向左滚动的动画 */
  animation: scroll-left 30s linear infinite;
}

/* 当方向为 right 时，使用向右滚动的动画 */
.animated-track.direction-right {
  animation-name: scroll-right;
}

.carousel-container:hover .animated-track {
  animation-play-state: paused;
}

/* 1. 向左滚动 (从 0 到 -50%) */
@keyframes scroll-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* 2. 向右滚动 (从 -50% 到 0) */
@keyframes scroll-right {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}

.carousel-card {
  flex: 0 0 280px;
  height: 120px;
  background-color: #3b82f6;
  color: white;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 16px;
}
</style>