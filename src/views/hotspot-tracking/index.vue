<template>
  <div class="hotspot-page">
    <div class="page-header">
      <h2 class="section-title">实时热帖</h2>
      <h2 class="section-title">综合呈现</h2>
    </div>
    
    <div class="main-content">
      <!-- 1. 实时热帖 -->
      <section class="hotspot-section">
        <div class="controls-wrapper">
          <div class="sort-buttons">
            <button v-for="sort in sortOptions" :key="sort.key" 
                    :class="{ active: activeSort === sort.key }" @click="handleSortChange(sort.key)">
              {{ sort.label }}
            </button>
          </div>
          <n-popover trigger="click" placement="bottom-end" :show-arrow="false" content-style="padding: 0; background-color: #3e3e42; border-radius: 8px;">
            <template #trigger>
              <button class="filter-button" :class="{ active: selectedThemes.length > 0 }">
                <n-icon :component="FilterListFilled" /> 筛选
              </button>
            </template>
            <!-- 弹出的筛选面板：直接展示 Checkbox 列表 -->
            <div class="filter-panel">
              <n-scrollbar style="max-height: 400px;">
                <n-checkbox-group v-model:value="selectedThemes">
                  <n-space vertical :size="12">
                    <div v-for="(options, groupName) in realThemes" :key="groupName" class="filter-group">
                      <div class="filter-group-title">{{ groupName }}</div>
                      <n-checkbox v-for="option in options" :key="option" :value="`${groupName} / ${option}`" :label="option" />
                    </div>
                  </n-space>
                </n-checkbox-group>
              </n-scrollbar>
            </div>
          </n-popover>
        </div>
        
        <div v-if="selectedThemes.length > 0" class="selected-filters-wrapper">
          <n-tag 
            v-for="theme in selectedThemes" 
            :key="theme" 
            closable 
            @close="removeTheme(theme)"
            size="small"
            round
          >
            {{ theme.split('/')[1]?.trim() || theme }}
          </n-tag>
        </div>
        
        <div class="posts-list-wrapper">
          <div class="posts-list" v-if="!isInitialLoading">
            <div v-for="post in displayedPosts" :key="post.id" class="post-item">
              <div class="post-meta">
                <span class="theme-main">{{ post.theme.split('/')[0].trim() }}</span>
                <span class="theme-sub">{{ post.theme.split('/')[1]?.trim() }}</span>
                <div class="post-time-group">
                  <span class="post-date">{{ post.postTime.split(' ')[0] }}</span>
                  <span class="post-time">{{ post.postTime.split(' ')[1] }}</span>
                </div>
              </div>
              <div class="post-content">
                <h3 class="post-title">{{ post.title }}</h3>
                <p class="post-details" :class="{ 'is-expanded': expandedPosts[post.id] }">
                  <span class="author">{{ post.username }}</span> - 
                  <span class="content-text">{{ post.content }}</span>
                </p>
                <button class="expand-button" @click="toggleExpand(post.id)">
                  {{ expandedPosts[post.id] ? '收起' : '展开' }}
                </button>
              </div>
              <div class="post-stats">
                <div class="stat-item"><strong>{{ post.score?.toFixed(1) }}</strong><span>综合分</span></div>
                <div class="stat-item"><strong>{{ post.viewCount }}</strong><span>观看</span></div>
                <div class="stat-item"><strong>{{ post.likeCount }}</strong><span>点赞</span></div>
                <div class="stat-item"><strong>{{ post.commentCount }}</strong><span>评论</span></div>
              </div>
            </div>
          </div>
          <div v-else class="posts-list loading">
            <n-skeleton text :repeat="5" height="80px" style="margin-bottom: 16px" />
          </div>
        </div>
        <div class="load-more-container" v-if="!isInitialLoading && hasMorePosts">
           <n-button 
            @click="loadMorePosts" 
            :loading="isMoreLoading" 
            strong secondary round
            class="load-more-button"
          >
            加载更多
          </n-button>
        </div>
      </section>

      <!-- 2. 综合呈现 -->
      <aside class="presentation-section">
        <div class="charts-grid">
          <div class="chart-container">
            <h3>综合评分 TOP 5</h3>
            <BaseChart v-if="!isInitialLoading && scoreData.length > 0" :option="scoreChartOption" />
            <n-skeleton v-else text height="100%" />
          </div>
          <div class="chart-container">
            <h3>全局词云</h3>
            <BaseChart v-if="!isInitialLoading && wordCloudData.length > 0" :option="wordCloudOption" />
            <n-skeleton v-else text height="100%" />
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { getHotspotPosts, getScoreChartData, getWordCloudData } from '@/api';
import { realThemes } from '../../../mock/analysis';
import type { Post, ChartDataItem } from '@/types/api';
import { NIcon, NPopover, NSkeleton, NButton, NTag, NScrollbar, NCheckboxGroup, NCheckbox, NSpace } from 'naive-ui';
import { FilterListFilled } from '@vicons/material';
import BaseChart from '@/components/charts/BaseChart.vue';
import type { EChartsOption, LinearGradientObject } from 'echarts';
import 'echarts-wordcloud';

// --- State ---
const allPosts = ref<Post[]>([]);
const scoreData = ref<ChartDataItem[]>([]);
const wordCloudData = ref<ChartDataItem[]>([]);
const isInitialLoading = ref(true);

// --- Controls State ---
type SortKey = 'comprehensive' | 'viewCount' | 'likeCount' | 'commentCount';
const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'comprehensive', label: '综合评价' },
  { key: 'viewCount', label: '观看最多' },
  { key: 'likeCount', label: '点赞最多' },
  { key: 'commentCount', label: '评论最多' },
];
const activeSort = ref<SortKey>('comprehensive');
const selectedThemes = ref<string[]>([]);

const expandedPosts = reactive<Record<string, boolean>>({});
const toggleExpand = (postId: string) => {
  expandedPosts[postId] = !expandedPosts[postId];
};

// --- Pagination State ---
const currentPage = ref(1);
const hasMorePosts = ref(true);
const isMoreLoading = ref(false);

// --- Computed Data ---
const displayedPosts = computed(() => {
  // 1. 先进行纯前端筛选
  let filteredPosts = allPosts.value;
  if (selectedThemes.value.length > 0) {
    filteredPosts = allPosts.value.filter(post => 
      selectedThemes.value.includes(post.theme)
    );
  }

  // 2. 再对筛选结果进行排序
  const postsToSort = [...filteredPosts];
  switch (activeSort.value) {
    case 'viewCount': return postsToSort.sort((a, b) => b.viewCount - a.viewCount);
    case 'likeCount': return postsToSort.sort((a, b) => b.likeCount - a.likeCount);
    case 'commentCount': return postsToSort.sort((a, b) => b.commentCount - a.commentCount);
    case 'comprehensive':
    default: return postsToSort.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }
});

const removeTheme = (themeToRemove: string) => {
  selectedThemes.value = selectedThemes.value.filter(theme => theme !== themeToRemove);
};

// --- API Calls & Logic ---
const fetchChartData = async () => {
  try {
    const [scoreRes, wordCloudRes] = await Promise.all([
      getScoreChartData(),
      getWordCloudData()
    ]);
    scoreData.value = scoreRes;
    wordCloudData.value = wordCloudRes;
  } catch (error) {
    console.error("加载图表数据失败:", error);
  }
};

const fetchPosts = async (page = 1) => {
  if (page === 1) isInitialLoading.value = true;
  else isMoreLoading.value = true;
  
  try {
    const { posts: newPosts, hasMore } = await getHotspotPosts(page, 5);
    if (page === 1) {
      allPosts.value = newPosts;
    } else {
      allPosts.value.push(...newPosts);
    }
    hasMorePosts.value = hasMore;
  } catch (error) {
    console.error("加载帖子失败:", error);
  } finally {
    if (page === 1) isInitialLoading.value = false;
    else isMoreLoading.value = false;
  }
};

const loadMorePosts = () => {
  if (!isMoreLoading.value && hasMorePosts.value) {
    currentPage.value++;
    fetchPosts(currentPage.value);
  }
};

const handleSortChange = (key: SortKey) => {
    activeSort.value = key;
};

onMounted(() => {
  fetchPosts(1);
  fetchChartData();
});

// --- Chart Options ---
const scoreChartOption = computed((): EChartsOption => ({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '10%', top: '15%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', splitLine: { show: false } },
    yAxis: {
      type: 'category',
      data: scoreData.value.map(item => item.name).reverse(),
      axisLabel: { color: '#a0a0ab', fontSize: 10 }
    },
    series: [{
      name: '综合评分', type: 'bar',
      data: scoreData.value.map(item => item.value).reverse(),
      itemStyle: {
        borderRadius: [0, 5, 5, 0],
        color: {
          type: 'linear', x: 1, y: 0, x2: 0, y2: 0,
          colorStops: [
            { offset: 0, color: '#18a058' },
            { offset: 1, color: '#63e2b7' }
          ]
        } as LinearGradientObject
      },
      showBackground: true,
      backgroundStyle: { color: 'rgba(180, 180, 180, 0.1)' }
    }]
}));
const wordCloudOption = computed((): EChartsOption => ({
    tooltip: { trigger: 'item' },
    series: [ {
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: [14, 50],
        rotationRange: [-45, 45],
        textStyle: {
            color: () => `rgb(${[
                Math.round(150 + Math.random() * 105),
                Math.round(150 + Math.random() * 105),
                Math.round(150 + Math.random() * 105)
            ].join(',')})`
        },
        emphasis: { focus: 'self' },
        data: wordCloudData.value,
    } ] as any,
}));
</script>

<style scoped>
.hotspot-page {
  padding: 24px;
  box-sizing: border-box;
  height: calc(100vh - 20px);
  display: flex;
  flex-direction: column;
}

.page-header {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
  margin-bottom: 16px;
  flex-shrink: 0;
}
.section-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.main-content {
  flex-grow: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
}

.hotspot-section, .presentation-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.controls-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  width: 100%;
  flex-shrink: 0;
}
.sort-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sort-buttons button, .filter-button {
  background-color: transparent;
  border: none;
  color: #a0a0ab;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}
.sort-buttons button:hover, .filter-button:hover {
  color: #e2e2e5;
}
.sort-buttons button.active {
  background-color: #3e3e42;
  color: white;
  font-weight: bold;
}
.filter-button {
  display: flex;
  align-items: center;
  gap: 6px;
}
.filter-button.active {
  color: #63e2b7;
}

.filter-panel {
  width: 350px;
  padding: 16px;
}
.filter-group {
  margin-bottom: 12px;
}
.filter-group-title {
  font-size: 0.8rem;
  font-weight: bold;
  color: #a0a0ab;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #555;
}

.selected-filters-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px;
  background-color: #2a2a2e;
  border-radius: 8px;
}

.posts-list-wrapper {
  flex-grow: 1;
  min-height: 0;
  position: relative;
}
.posts-list-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, #242323, transparent);
  pointer-events: none;
}
.posts-list {
  height: 100%;
  overflow-y: auto;
  padding-right: 16px;
}
.posts-list.loading {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.posts-list::-webkit-scrollbar { width: 4px; }
.posts-list::-webkit-scrollbar-track { background: transparent; }
.posts-list::-webkit-scrollbar-thumb { background-color: #555; border-radius: 4px; }

.post-item {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid #3e3e42;
}
.post-meta {
  flex: 0 0 120px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #a0a0ab;
  align-self: flex-start;
}
.theme-main { font-size: 1rem; font-weight: bold; color: #e2e2e5; }
.theme-sub { font-size: 0.9rem; }
.post-time-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}
.post-date { font-size: 0.8rem; }
.post-time { font-size: 0.8rem; }


.post-content {
  flex: 1 1 auto;
  min-width: 0;
  background-color: #2a2a2e;
  padding: 16px;
  border-radius: 12px;
}
.post-title { font-size: 1.1rem; font-weight: bold; margin: 0 0 8px 0; }
.post-details {
  font-size: 0.9rem;
  color: #a0a0ab;
  margin: 0 0 8px 0;
  line-height: 1.6;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
}
.post-details.is-expanded { -webkit-line-clamp: unset; line-clamp: unset; }
.author { font-style: italic; font-weight: 500; color: #c7c7d1; margin-right: 4px; }
.expand-button {
  background: none;
  border: none;
  color: #63e2b7;
  cursor: pointer;
  padding: 0;
  font-size: 0.8rem;
  font-weight: bold;
}
.expand-button:hover { text-decoration: underline; }

.post-stats {
  flex: 0 0 200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
  text-align: right;
  font-size: 0.9rem;
  color: #a0a0ab;
}
.stat-item { display: flex; flex-direction: column; align-items: flex-end; }
.stat-item strong { font-size: 1.1rem; font-weight: bold; color: #e2e2e5; }

.load-more-container {
  padding-top: 16px;
  text-align: center;
  flex-shrink: 0;
}
:deep(.load-more-button.n-button) {
  --n-color: #3e3e42 !important;
  --n-color-hover: #555 !important;
  --n-color-pressed: #555 !important;
  --n-text-color: #e2e2e5 !important;
  --n-border: 1px solid #555 !important;
  --n-border-hover: 1px solid #777 !important;
  --n-border-pressed: 1px solid #777 !important;
  --n-height: 42px !important;
  --n-padding-left: 24px !important;
  --n-padding-right: 24px !important;
  --n-border-radius: 21px !important;
  --n-font-weight: bold !important;
  transition: all 0.2s ease-in-out !important;
}
:deep(.load-more-button.n-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
:deep(.load-more-button.n-button:active) {
  transform: scale(0.98);
}

.charts-grid {
  flex-grow: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 24px;
}
.chart-container {
  background-color: #2a2a2e;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.chart-container h3 {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 20px 0;
  color: #c7c7d1;
  flex-shrink: 0;
}
</style>