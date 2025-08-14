<template>
  <div class="sentiment-analysis-page">
    <h1>情绪检测</h1>
    
    <div class="dashboard-grid">
      
      <!-- 所有模块现在都是 grid 的直接子项 -->
      
      <!-- 帖子区域 -->
      <div class="grid-item post-positive-1">
        <PostCard v-if="positivePostSlots[0] && !positivePostSlots[0].isEmpty" :post="positivePostSlots[0].post!" type="positive" />
        <PlaceholderCard v-else text="暂无更多最积极帖子" />
      </div>
      <div class="grid-item post-positive-2">
        <PostCard v-if="positivePostSlots[1] && !positivePostSlots[1].isEmpty" :post="positivePostSlots[1].post!" type="positive" />
        <PlaceholderCard v-else text="暂无更多最积极帖子" />
      </div>
      <div class="grid-item post-negative-1">
        <PostCard v-if="negativePostSlots[0] && !negativePostSlots[0].isEmpty" :post="negativePostSlots[0].post!" type="negative" />
        <PlaceholderCard v-else text="暂无更多最消极帖子" />
      </div>
      <div class="grid-item post-negative-2">
        <PostCard v-if="negativePostSlots[1] && !negativePostSlots[1].isEmpty" :post="negativePostSlots[1].post!" type="negative" />
        <PlaceholderCard v-else text="暂无更多最消极帖子" />
      </div>
      
      <!-- 图表区域 -->
      <n-card title="全局饼状情绪二分图" :bordered="false" class="grid-item chart-pie">
        <BaseChart :option="sentimentPieOption" />
      </n-card>
      <n-card title="全局曲线情绪波动二分图" :bordered="false" class="grid-item chart-line">
        <BaseChart :option="sentimentTimelineOption" />
      </n-card>
      
      <!-- 右侧区域 -->
      <div class="grid-item right-column">
        <n-card class="section-card" title="新晋话题" style="flex: 2; min-height: 0;">
          <n-scrollbar style="max-height: 100%;">
            <n-thing v-for="topic in emergingTopics" :key="topic.id" class="topic-item">
              <template #header>{{ topic.topicName }}</template>
              <template #description>{{ topic.relatedPost.title }}</template>
              {{ topic.relatedPost.content }}
            </n-thing>
          </n-scrollbar>
        </n-card>
        
        <n-card class="section-card" title="活跃用户" style="flex: 3; min-height: 0;">
          <template #header-extra>
            <n-select v-model:value="activeUserFilter.theme" placeholder="筛选主题" :options="themeOptions" clearable size="small" style="width: 140px" />
          </template>
          <n-tabs type="line" animated v-model:value="activeUserFilter.type" size="small">
            <n-tab-pane name="posts" tab="发帖最多" />
            <n-tab-pane name="comments" tab="评论最多" />
            <n-tab-pane name="replies" tab="收到回复最多" />
          </n-tabs>
          <div class="user-list-container">
            <n-scrollbar style="max-height: 100%;">
              <n-list hoverable clickable :show-divider="false" style="padding: 0 4px;">
                <n-list-item v-for="user in activeUsers" :key="user.userId">
                  <n-thing :title="user.username">
                    <template #description>ID: {{ user.userId }}</template>
                    活跃主题: {{ user.activeTheme }} <br/>
                    最晚出现: {{ user.lastActiveTime }}
                  </n-thing>
                </n-list-item>
              </n-list>
            </n-scrollbar>
          </div>
        </n-card>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
// --- 所有的 JavaScript 逻辑都与您之前的代码完全一致，无需修改 ---
import { ref, onMounted, reactive, watch, computed } from 'vue';
import { getSentimentAnalysis, getEmergingTopics, getActiveUsers } from '@/api';
import { realThemes } from '../../../mock/analysis';
import type { SentimentAnalysisData, EmergingTopic, ActiveUser, Post } from '@/types/api';
import { NCard, NTabs, NTabPane, NThing, NList, NListItem, NSelect, NScrollbar } from 'naive-ui';
import type { SelectGroupOption } from 'naive-ui';
import BaseChart from '@/components/charts/BaseChart.vue';
import PostCard from '@/components/common/PostCard.vue';
import PlaceholderCard from '@/components/common/PlaceholderCard.vue';
import type { EChartsOption } from 'echarts';

const sentimentData = ref<SentimentAnalysisData | null>(null);
const emergingTopics = ref<EmergingTopic[]>([]);
const activeUsers = ref<ActiveUser[]>([]);

const activeUserFilter = reactive({
  type: 'posts',
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
      id: post ? post.id : `placeholder-${i}`,
      post: post || null,
      isEmpty: !post,
    });
  }
  return slots;
};

const positivePostSlots = computed(() => createPostSlots(sentimentData.value?.mostPositivePosts, 2));
const negativePostSlots = computed(() => createPostSlots(sentimentData.value?.mostNegativePosts, 2));

const themeOptions = computed((): SelectGroupOption[] => {
  return Object.entries(realThemes).map(([groupName, options]) => ({
    type: 'group',
    label: groupName,
    key: groupName,
    children: options.map(option => ({
      label: option,
      value: option,
    })),
  }));
});

const sentimentPieOption = computed((): EChartsOption => ({
  tooltip: { trigger: 'item' },
  legend: { top: '5%', left: 'center', textStyle: { color: '#ccc' } },
  series: [{
    name: '情绪分布',
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['50%', '60%'],
    avoidLabelOverlap: false,
    label: { show: false, position: 'center' },
    emphasis: { label: { show: true, fontSize: '20', fontWeight: 'bold' } },
    data: sentimentData.value?.sentimentPie || [],
  }]
}));

const sentimentTimelineOption = computed((): EChartsOption => {
  const timelineData = sentimentData.value?.sentimentTimeline || [];
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['积极率', '消极率'], textStyle: { color: '#ccc' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timelineData.map(item => item.date),
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value}' }
    },
    series: [
      {
        name: '积极率',
        type: 'line',
        smooth: true,
        data: timelineData.map(item => item.positiveRate),
        itemStyle: { color: '#18a058' }
      },
      {
        name: '消极率',
        type: 'line',
        smooth: true,
        data: timelineData.map(item => item.negativeRate),
        itemStyle: { color: '#d03050' }
      }
    ]
  };
});
</script>

<style scoped>
.sentiment-analysis-page {
  padding: 24px;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

h1 {
  margin-bottom: 24px;
  flex-shrink: 0;
}

.dashboard-grid {
  flex-grow: 1;
  min-height: 0;
  display: grid;
  gap: 24px;

  /* 1. 定义列：总共11列 */
  grid-template-columns: repeat(11, 1fr);

  /* 2. 定义行：两个固定内容行 + 一个弹性行 */
  grid-template-rows: auto auto 1fr; 
}

/* 3. “画地图”：精确定义每个模块的位置和跨度 */
.post-positive-1 { grid-area: 1 / 1 / 2 / 4; } /* 第1行, 第1-3列 */
.post-positive-2 { grid-area: 1 / 4 / 2 / 7; } /* 第1行, 第4-6列 */
.post-negative-1 { grid-area: 2 / 1 / 3 / 4; } /* 第2行, 第1-3列 */
.post-negative-2 { grid-area: 2 / 4 / 3 / 7; } /* 第2行, 第4-6列 */

/* ✅✅✅ 核心修正：让两个图表在第3行内左右并排 ✅✅✅ */
.chart-pie      { grid-area: 3 / 1 / 4 / 4; } /* 第3行, 第1-3列 */
.chart-line     { grid-area: 3 / 4 / 4 / 7; } /* 第3行, 第4-6列 */

.right-column   { grid-area: 1 / 7 / 4 / 12; } /* 关键：让右侧列从第1行跨到最后一行(第4行前) */


/* 4. 确保所有网格项和其内容都能撑满单元格 */
.grid-item,
.post-positive-1, .post-positive-2, .post-negative-1, .post-negative-2 {
  display: flex;
  flex-direction: column;
  background-color: #2a2a2e;
  border-radius: 8px;
  min-height: 0; /* 允许 flex item 收缩 */
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: transparent; /* 右侧列本身是透明的 */
}

/* 5. 确保 n-card 内部能正确撑满 */
:deep(.n-card__content) {
  flex-grow: 1; 
  overflow: hidden; 
  padding: 16px !important;
  display: flex;
  flex-direction: column;
}
:deep(.n-card__header) {
  padding: 16px !important;
  flex-shrink: 0;
}
:deep(.n-tabs) {
  flex-shrink: 0;
}
.user-list-container {
  flex-grow: 1;
  overflow: hidden;
  margin-top: 12px;
}
.topic-item:not(:last-child) {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #3e3e42;
}

/* 6. 响应式布局 */
@media (max-width: 1200px) {
  .dashboard-grid {
    display: flex;
    flex-direction: column;
  }
}
</style>