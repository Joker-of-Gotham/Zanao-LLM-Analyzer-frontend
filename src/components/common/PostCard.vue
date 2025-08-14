<template>
  <n-card :bordered="false" class="post-card" :class="`type-${type}`">
    <n-thing>
      <template #header> {{ post.title }} </template>
      <template #header-extra>
        <n-tag :type="type === 'positive' ? 'success' : 'error'" size="small">
          {{ type === 'positive' ? '最积极' : '最消极' }}
        </n-tag>
      </template>
      {{ post.content }}
    </n-thing>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NThing, NTag } from 'naive-ui';
import type { Post } from '@/types/api';

defineProps<{
  post: Post;
  type: 'positive' | 'negative';
}>();
</script>

<style scoped>
.post-card.type-positive {
  border-left: 3px solid #18a058; /* 绿色 */
}
.post-card.type-negative {
  border-left: 3px solid #d03050; /* 红色 */
}
</style>