import http from '@/utils/http';
import type { Post, ChartDataItem } from '@/types/api';
import { getMockHotspotPosts, mockScoreChart, mockWordCloud } from '../../../mock/analysis';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// 导出的函数，它会根据环境变量决定调用哪个数据源
export const getHotspotPosts = (page = 1, limit = 5): Promise<{ posts: Post[], hasMore: boolean }> => {
  if (USE_MOCK) {
    return getMockHotspotPosts(page, limit);
  }
  // 这里的返回值类型需要与 getMockHotspotPosts 保持一致
  return http.get('/hotspot/posts', { params: { page, limit } });
};

export const getScoreChartData = (): Promise<ChartDataItem[]> => {
  if (USE_MOCK) {
    return Promise.resolve(mockScoreChart);
  }
  return http.get('/hotspot/score-chart');
};

export const getWordCloudData = (): Promise<ChartDataItem[]> => {
  if (USE_MOCK) {
    return Promise.resolve(mockWordCloud);
  }
  return http.get('/hotspot/word-cloud');
};