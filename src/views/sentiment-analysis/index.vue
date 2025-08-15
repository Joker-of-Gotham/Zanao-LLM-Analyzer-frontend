<template>
  <div class="page-container">
    <!-- 1. 左侧：情绪检测 -->
    <section class="sentiment-section">
      <h2 class="section-title">情绪检测</h2>
      <div class="content-wrapper">
        <div class="posts-grid">
          <div v-for="slot in positivePostSlots" :key="slot.id" class="post-slot">
            <PostCard v-if="!slot.isEmpty" :post="slot.post!" type="positive" />
            <PlaceholderCard v-else text="暂无最积极帖子" />
          </div>
          <div v-for="slot in negativePostSlots" :key="slot.id" class="post-slot">
            <PostCard v-if="!slot.isEmpty" :post="slot.post!" type="negative" />
            <PlaceholderCard v-else text="暂无最消极帖子" />
          </div>
        </div>
        <div class="charts-grid-sentiment">
          <div class="chart-container">
            <h3>全局饼状情绪二分图</h3>
            <BaseChart v-if="sentimentData" :option="sentimentPieOption" />
            <n-skeleton v-else text height="100%" />
          </div>
          <div class="chart-container">
            <h3>全局曲线情绪波动二分图</h3>
            <BaseChart v-if="sentimentData" :option="sentimentTimelineOption" />
            <n-skeleton v-else text height="100%" />
          </div>
        </div>
      </div>
    </section>

    <!-- 2. 右侧 -->
    <div class="right-column">
      <!-- 新晋话题 -->
      <section class="emerging-topics-section">
        <h2 class="section-title">新晋话题</h2>
        <div class="topics-content-wrapper">
          <n-scrollbar style="max-height: 100%;">
            <div v-if="emergingTopics.length > 0">
              <div v-for="topic in emergingTopics" :key="topic.id" class="topic-item">
                <h3 class="topic-name">{{ topic.topicName }}</h3>
                <p class="topic-post-title">{{ topic.relatedPost.title }}</p>
                <p class="topic-post-content">{{ topic.relatedPost.content }}</p>
              </div>
            </div>
            <div v-else class="placeholder-text">暂无新晋话题</div>
          </n-scrollbar>
        </div>
      </section>
      
      <!-- 活跃用户 -->
      <section class="active-users-section">
        <div class="section-header">
          <h2 class="section-title">活跃用户</h2>
          <n-popover trigger="click" placement="bottom-end" :show-arrow="false" content-style="padding: 12px; background-color: #3e3e42; border-radius: 8px;">
            <template #trigger>
              <button class="filter-button" :class="{ active: activeUserFilter.theme }">
                <n-icon :component="FilterListFilled" /> 筛选主题
              </button>
            </template>
            <n-select
              v-model:value="activeUserFilter.theme"
              placeholder="选择主题"
              :options="themeOptions"
              clearable
              style="width: 220px"
            />
          </n-popover>
        </div>
        <div class="controls-wrapper">
          <button v-for="type in userTypes" :key="type.key"
                  :class="{ active: activeUserFilter.type === type.key }"
                  @click="activeUserFilter.type = type.key">
            {{ type.label }}
          </button>
        </div>
        <div class="user-list-container">
          <n-scrollbar style="max-height: 100%;">
            <div v-for="user in activeUsers" :key="user.userId" class="user-item">
              <div class="user-meta">
                <span>{{ user.activeTheme }}</span>
                <span>{{ user.lastActiveTime }}</span>
              </div>
              <div class="user-info-wrapper">
                <div class="user-info">
                  <div class="username">{{ user.username }}</div>
                  <div class="userid">ID: {{ user.userId }}</div>
                </div>
              </div>
            </div>
          </n-scrollbar>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed } from 'vue';
import { getSentimentAnalysis, getEmergingTopics, getActiveUsers } from '@/api';
import { realThemes } from '../../../mock/analysis';
import type { SentimentAnalysisData, EmergingTopic, ActiveUser, Post } from '@/types/api';
import { NSelect, NScrollbar, NSkeleton, NIcon, NPopover } from 'naive-ui';
import type { SelectGroupOption } from 'naive-ui';
import { FilterListFilled } from '@vicons/material';
import BaseChart from '@/components/charts/BaseChart.vue';
import PostCard from '@/components/common/PostCard.vue';
import PlaceholderCard from '@/components/common/PlaceholderCard.vue';
import type { EChartsOption } from 'echarts';

const sentimentData = ref<SentimentAnalysisData | null>(null);
const emergingTopics = ref<EmergingTopic[]>([]);
const activeUsers = ref<ActiveUser[]>([]);

const userTypes: { key: 'posts' | 'comments' | 'replies'; label: string }[] = [
  { key: 'posts', label: '发帖最多' },
  { key: 'comments', label: '评论最多' },
  { key: 'replies', label: '收到回复最多' },
];
const activeUserFilter = reactive({
  type: 'posts' as 'posts' | 'comments' | 'replies',
  theme: null as string | null,
});

onMounted(() => {
  getSentimentAnalysis().then(res => sentimentData.value = res);
  getEmergingTopics().then(res => emergingTopics.value = res);
  fetchActiveUsers();
});

function fetchActiveUsers() {
  const params = {
    type: activeUserFilter.type,
    theme: activeUserFilter.theme || undefined,
  };
  getActiveUsers(params).then(res => activeUsers.value = res);
}
watch(activeUserFilter, fetchActiveUsers, { deep: true });

const createPostSlots = (posts: Post[] | undefined, count: number) => {
  const slots = [];
  for (let i = 0; i < count; i++) {
    const post = posts?.[i];
    slots.push({
      id: `slot-${Math.random()}-${i}`,
      post: post || null,
      isEmpty: !post,
    });
  }
  return slots;
};
const positivePostSlots = computed(() => createPostSlots(sentimentData.value?.mostPositivePosts, 2));
const negativePostSlots = computed(() => createPostSlots(sentimentData.value?.mostNegativePosts, 2));

const themeOptions = computed((): SelectGroupOption[] => 
  Object.entries(realThemes).map(([groupName, options]) => ({
    type: 'group',
    label: groupName,
    children: options.map(option => ({ label: option, value: `${groupName} / ${option}` })),
  }))
);

const sentimentPieOption = computed((): EChartsOption => ({
  tooltip: { trigger: 'item' },
  legend: { orient: 'horizontal', bottom: '5%', textStyle: { color: '#ccc' }, icon: 'circle', },
  color: ['#3b82f6', '#f59e0b'],
  series: [{
    name: '情绪分布', type: 'pie',
    radius: ['50%', '70%'], center: ['50%', '40%'],
    avoidLabelOverlap: false, label: { show: false },
    emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold', formatter: '{b}\n{d}%', } },
    data: sentimentData.value?.sentimentPie || [],
  }]
}));

const sentimentTimelineOption = computed((): EChartsOption => {
  const timelineData = sentimentData.value?.sentimentTimeline || [];
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['积极率', '消极率'], bottom: '5%', textStyle: { color: '#ccc' } },
    grid: { left: '3%', right: '4%', top: '15%', bottom: '20%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: timelineData.map(item => item.date), axisLine: { lineStyle: { color: '#555' } }, },
    yAxis: { type: 'value', axisLabel: { color: '#a0a0ab' }, splitLine: { lineStyle: { color: '#3e3e42' } } },
    series: [
      {
        name: '积极率', type: 'line', smooth: true, data: timelineData.map(item => item.positiveRate),
        itemStyle: { color: '#10b981' }, lineStyle: { color: '#10b981' },
        areaStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(16, 185, 129, 0.5)' }, { offset: 1, color: 'rgba(16, 185, 129, 0)' }]
          }
        }
      },
      {
        name: '消极率', type: 'line', smooth: true, data: timelineData.map(item => item.negativeRate),
        itemStyle: { color: '#ef4444' }, lineStyle: { color: '#ef4444' },
        areaStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(239, 68, 68, 0.5)' }, { offset: 1, color: 'rgba(239, 68, 68, 0)' }]
          }
        }
      }
    ]
  };
});
</script>

<style scoped>
.page-container {
  padding: 24px;
  box-sizing: border-box;
  height: calc(100vh - 10px);
  display: grid;
  grid-template-columns: 6fr 5fr;
  gap: 42px;
}

.sentiment-section, .right-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-height: 0;
}

.section-title {
  font-size: 2.4rem;
  font-weight: bold;
}

/* --- 情绪检测 (唯一有背景块的) --- */
.content-wrapper {
  flex-grow: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: #2a2a2e;
  border-radius: 12px;
  padding: 24px;
}
.posts-grid, .charts-grid-sentiment {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.charts-grid-sentiment {
  flex-grow: 1;
  min-height: 0;
}
.post-slot {
  display: flex;
}
.chart-container {
  display: flex;
  flex-direction: column;
}
.chart-container h3 {
  font-size: 0.9rem;
  color: #a0a0ab;
  margin-bottom: 8px;
}
.placeholder-text {
  color: #6b6b72;
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
}


/* --- 新晋话题 & 活跃用户 (无背景块) --- */
.emerging-topics-section {
  flex: 2; /* 按 2:3 比例分配高度 */
}
.active-users-section {
  flex: 3; /* 按 2:3 比例分配高度 */
}
.emerging-topics-section, .active-users-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.topics-content-wrapper {
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 8px;
}
.topic-item {
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #3e3e42;
}
.topic-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}
.topic-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #e2e2e5;
  margin-bottom: 8px;
}
.topic-post-title, .topic-post-content {
  font-size: 0.9rem;
  color: #a0a0ab;
  line-height: 1.6;
  margin: 0;
}
.topic-post-title {
  font-weight: 500;
  color: #c7c7d1;
  margin-bottom: 4px;
}

.controls-wrapper {
  display: inline-flex;
  background-color: #2a2a2e;
  padding: 4px;
  border-radius: 24px;
  margin-top: 8px;
  margin-bottom: 16px;
  align-self: flex-start;
}
.controls-wrapper button {
  background-color: transparent;
  border: none;
  color: #a0a0ab;
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}
.controls-wrapper button.active {
  background-color: #555;
  color: white;
}
.filter-button {
  background-color: transparent;
  border: none;
  color: #a0a0ab;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.filter-button:hover, .filter-button.active {
  background-color: #3e3e42;
  color: white;
}

.user-list-container {
  flex-grow: 1;
  min-height: 0;
}
.user-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #3e3e42;
}
.user-item:last-child {
  border-bottom: none;
}
.user-info-wrapper {
  background-color: #2a2a2e;
  border-radius: 12px;
  padding: 16px;
}

.user-meta, .user-info, .username, .userid {
  font-size: 0.8rem;
  color: #a0a0ab;
  display: flex;
  flex-direction: column;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-info {
  gap: 2px;
  min-width: 0;
}
.username {
  font-size: 0.95rem;
  font-weight: 500;
  color: #e2e2e5;
}
.userid {
  font-size: 0.8rem;
}
</style>