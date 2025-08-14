<template>
  <div class="hotspot-tracking-page">
    <h1>实时热帖</h1>

    <n-grid :x-gap="24" :y-gap="24" :cols="3">
      <!-- 左侧实时热帖列表 (保持不变) -->
      <n-gi :span="2">
        <n-card>
          <template #header>
            <n-tabs type="line" animated v-model:value="activeSort" size="large">
              <n-tab-pane name="comprehensive" tab="综合评价" />
              <n-tab-pane name="viewCount" tab="观看最多" />
              <n-tab-pane name="likeCount" tab="点赞最多" />
            </n-tabs>
          </template>
          <template #header-extra>
            <n-select
              v-model:value="selectedTheme"
              placeholder="按主题筛选"
              :options="themeOptions"
              clearable
              style="width: 220px"
            />
          </template>
          <n-list hoverable clickable>
            <n-list-item v-for="post in displayedPosts" :key="post.id">
              <n-thing :title="post.title" content-style="margin-top: 10px;">
                <template #description>
                  <n-space size="small" style="margin-top: 4px">
                    <n-tag :bordered="false" type="info" size="small">{{ post.theme }}</n-tag>
                    <n-tag :bordered="false" type="default" size="small">{{ post.postTime }}</n-tag>
                  </n-space>
                </template>
                {{ post.content }}
                <template #footer>
                  <n-space>
                    <span>观看: {{ post.viewCount }}</span>
                    <span>点赞: {{ post.likeCount }}</span>
                    <span>评论: {{ post.commentCount }}</span>
                  </n-space>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
        </n-card>
      </n-gi>

      <!-- ✅ CHANGED: 右侧综合呈现部分已全面修改 -->
      <n-gi :span="1">
        <n-space vertical :size="24">
          <n-card title="综合评分柱状图">
            <!-- 如果数据已加载，则显示图表 -->
            <div v-if="!isLoading && scoreData.length > 0" style="height: 300px;">
              <BaseChart :option="scoreChartOption" height="300px" />
            </div>
            <!-- 否则，显示骨架屏加载动画 -->
            <n-skeleton v-else text :repeat="6" style="height: 300px;" />
          </n-card>

          <n-card title="全局词云图">
            <!-- 如果数据已加载，则显示图表 -->
            <div v-if="!isLoading && wordCloudData.length > 0" style="height: 350px;">
              <BaseChart :option="wordCloudOption" height="350px" />
            </div>
            <!-- 否则，显示骨架屏加载动画 -->
            <n-skeleton v-else text :repeat="6" style="height: 350px;" />
          </n-card>
        </n-space>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getHotspotPosts, getScoreChartData, getWordCloudData } from '@/api';
// ✅ CHANGED: 导入 realThemes，因为 themeOptions 依赖它
import { realThemes } from '../../../mock/analysis'; 
import type { Post, ChartDataItem } from '@/types/api';
// ✅ CHANGED: 导入了 n-skeleton 和正确的 SelectOption 类型
import { NGrid, NGi, NCard, NSpace, NList, NListItem, NThing, NTag, NTabs, NTabPane, NSelect, NSkeleton, type SelectOption } from 'naive-ui';
import BaseChart from '@/components/charts/BaseChart.vue';
import type { EChartsOption } from 'echarts';
import 'echarts-wordcloud';

// --- 状态定义 ---
const allPosts = ref<Post[]>([]);
const scoreData = ref<ChartDataItem[]>([]);
const wordCloudData = ref<ChartDataItem[]>([]);
const isLoading = ref(true);

// --- 筛选和排序的状态 ---
const selectedTheme = ref<string | null>(null);
const activeSort = ref<'comprehensive' | 'viewCount' | 'likeCount'>('comprehensive');

// ✅ CHANGED: 修正了 themeOptions 的类型，并正确使用了 realThemes
const themeOptions = computed((): SelectOption[] => {
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

// ✅✅✅ 核心修正：添加了 return 语句 ✅✅✅
const displayedPosts = computed(() => {
  let posts = selectedTheme.value
    ? allPosts.value.filter(p => p.theme === selectedTheme.value)
    : [...allPosts.value];

  switch (activeSort.value) {
    case 'viewCount':
      posts.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case 'likeCount':
      posts.sort((a, b) => b.likeCount - a.likeCount);
      break;
    case 'comprehensive':
    default:
      posts.sort((a, b) => (b.likeCount * 2 + b.commentCount) - (a.likeCount * 2 + a.commentCount));
      break;
  }
  // ✅ 核心修正：返回处理后的数组
  return posts; 
});

// --- 图表配置 ---
const scoreChartOption = computed((): EChartsOption => ({
  xAxis: { type: 'category', data: scoreData.value.map(item => item.name) },
  yAxis: { type: 'value' },
  series: [{ data: scoreData.value.map(item => item.value), type: 'bar' }],
  tooltip: { trigger: 'axis' }
}));

const wordCloudOption = computed((): EChartsOption => ({
    tooltip: { trigger: 'item', formatter: '{b} : {c}' },
    series: [ {
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: [12, 50],
        rotationRange: [-90, 90],
        emphasis: {
          focus: 'self',
          textStyle: { fontWeight: 'bold' }
        },
        textStyle: {
            color: () => `rgb(${[ Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160) ].join(',')})`
        },
        data: wordCloudData.value,
    } ] as any,
}));

// --- 数据获取 ---
onMounted(async () => {
  try {
    isLoading.value = true;
    const [postsRes, scoreRes, wordCloudRes] = await Promise.all([
      getHotspotPosts(),
      getScoreChartData(),
      getWordCloudData()
    ]);
    allPosts.value = postsRes;
    scoreData.value = scoreRes;
    wordCloudData.value = wordCloudRes;
  } catch (error) {
    console.error("加载热度追踪页面数据时出错:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.hotspot-tracking-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>