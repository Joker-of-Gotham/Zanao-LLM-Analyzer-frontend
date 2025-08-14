<template>
  <div class="user-analysis-page">
    <div class="header">
      <!-- ✅ CHANGED: H1现在只显示静态标题 -->
      <h1>用户情况</h1>
      <n-input-group>
        <n-input
          v-model:value="userIdInput"
          placeholder="请输入要分析的用户ID"
          clearable
          @keydown.enter="handleSearch"
        />
        <n-button type="primary" ghost @click="handleSearch" :loading="isLoading">搜索</n-button>
      </n-input-group>
    </div>

    <!-- 数据展示区 -->
    <div v-if="isLoading" class="content-area loading-state">
      <n-spin size="large" />
    </div>
    <!-- ✅ CHANGED: 只有在有数据时，才在profile-grid中显示用户ID -->
    <div v-else-if="userProfileData" class="content-area profile-grid">
      <div class="grid-header">
        <h2>用户ID: <span class="user-id">{{ userProfileData.userId }}</span></h2>
      </div>
      <!-- 左侧区域 -->
      <div class="left-pane">
        <n-card title="活动轨迹" class="activity-card">
          <HorizontalTimeline 
            v-if="userProfileData.activityTimeline.length > 0"
            :events="userProfileData.activityTimeline" 
            @select="handleTimelineSelect" 
          />
          <div class="activity-content-wrapper">
            <n-thing v-if="selectedActivityEvent">
              <template #header>{{ getTimelineTitle(selectedActivityEvent) }}</template>
              <template #description>{{ selectedActivityEvent.timestamp }}</template>
              <p>{{ selectedActivityEvent.relatedItem.content }}</p>
            </n-thing>
             <span v-else>暂无活动记录</span>
          </div>
        </n-card>
        <n-card title="最高获赞发帖" class="top-content-card">
          <n-thing v-if="userProfileData.topLikedPost" :title="userProfileData.topLikedPost.title">
            {{ userProfileData.topLikedPost.content }}
          </n-thing>
           <span v-else>暂无数据</span>
        </n-card>
        <n-card title="最高获赞评论" class="top-content-card">
          <p v-if="userProfileData.topLikedComment">{{ userProfileData.topLikedComment.content }}</p>
          <span v-else>暂无数据</span>
        </n-card>
      </div>

      <!-- 右侧区域 -->
      <div class="right-pane">
        <n-card title="用户词云" class="wordcloud-card">
          <BaseChart :option="wordCloudOption" />
        </n-card>
        <n-card title="智能分析" class="ai-analysis-card">
          <n-scrollbar style="max-height: 100%;">
            <div class="markdown-content" v-html="renderMarkdown(userProfileData.aiAnalysis)"></div>
          </n-scrollbar>
        </n-card>
      </div>
    </div>
    <div v-else class="content-area empty-state">
      <n-icon :component="PersonSearchOutlined" size="64" :depth="2" />
      <p>请输入用户ID以开始分析</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getUserProfile } from '@/api';
import type { UserProfileData, ActivityEvent, Post } from '@/types/api';
import { NInput, NInputGroup, NButton, NCard, NThing, NScrollbar, NSpin, NIcon } from 'naive-ui'; 
import { PersonSearchOutlined } from '@vicons/material';
import BaseChart from '@/components/charts/BaseChart.vue';
import HorizontalTimeline from '@/components/common/HorizontalTimeline.vue';
import type { EChartsOption } from 'echarts';
import { marked } from 'marked';
import 'echarts-wordcloud';

const userIdInput = ref('');
const isLoading = ref(false);
const userProfileData = ref<UserProfileData | null>(null);

const selectedActivityIndex = ref(0);

const selectedActivityEvent = computed((): ActivityEvent | null => {
  if (!userProfileData.value?.activityTimeline) return null;
  return userProfileData.value.activityTimeline[selectedActivityIndex.value] || null;
});

const handleSearch = async () => {
  if (!userIdInput.value.trim()) return;
  isLoading.value = true;
  userProfileData.value = null;
  selectedActivityIndex.value = 0;
  try {
    userProfileData.value = await getUserProfile(userIdInput.value.trim());
  } finally {
    isLoading.value = false;
  }
};

const handleTimelineSelect = (index: number) => {
  selectedActivityIndex.value = index;
};

const getTimelineTitle = (event: ActivityEvent): string => {
  if (event.type === 'post') {
    return (event.relatedItem as Post).title;
  }
  return '发表评论';
};

const renderMarkdown = (text: string) => marked.parse(text);

const wordCloudOption = computed((): EChartsOption => ({
    tooltip: { trigger: 'item' },
    series: [ {
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: [12, 50],
        data: userProfileData.value?.wordCloud || [],
    } ] as any,
}));
</script>

<style scoped>
.user-analysis-page {
  padding: 24px;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  flex-shrink: 0;
}

h1, h2 {
  margin: 0;
  white-space: nowrap;
}

.content-area {
  flex-grow: 1;
  min-height: 0; 
}

/* 关键：让加载和空状态绝对居中 */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 16px;
}
.empty-state p {
  color: #6b6b72;
  font-size: 14px;
}

/* 数据网格布局 */
.profile-grid {
  display: grid;
  /* 定义两列，一个header行，一个弹性内容行 */
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr; 
  gap: 24px;
  height: 100%;
}

.grid-header {
  grid-column: 1 / 3; /* Header 跨越两列 */
}
.user-id {
  color: #18a058; /* 绿色，用于高亮 */
  font-weight: 500;
}

.left-pane {
  grid-column: 1;
  grid-row: 2;
}
.right-pane {
  grid-column: 2;
  grid-row: 2;
}

/* 左右两列的弹性布局 */
.left-pane, .right-pane {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
}

/* --- 高度分配 --- */
.activity-card { flex: 5; }
.top-content-card { flex: 2; }
.wordcloud-card { flex: 3; }
.ai-analysis-card { flex: 4; }

.left-pane .n-card, .right-pane .n-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
:deep(.n-card__content) {
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
:deep(.n-card__header) {
  flex-shrink: 0;
  padding: 16px !important;
}

.activity-content-wrapper {
  margin-top: 12px;
  padding: 16px;
  background-color: #2a2a2e;
  border-radius: 8px;
  flex-grow: 1;
  overflow-y: auto;
}
.activity-content-wrapper p { margin-top: 8px; }
</style>