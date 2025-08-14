<template>
  <div class="placeholder-card">
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<style scoped>
.placeholder-card {
  width: 100%;
  height: 100%;
  min-height: 150px; /* 保持一个最小高度 */
  display: grid;
  place-items: center;
  background-color: #2a2a2e;
  border-radius: 8px;
  color: #6b6b72;
  font-size: 14px;
}
</style>