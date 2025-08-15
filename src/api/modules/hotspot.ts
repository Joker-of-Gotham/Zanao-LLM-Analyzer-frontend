import http from '@/utils/http';
import type { Post, ChartDataItem } from '@/types/api';
import { getMockHotspotPosts, mockScoreChart, mockWordCloud } from '../../../mock/analysis';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// 导出的函数，它会根据环境变量决定调用哪个数据源
export const getHotspotPosts = (
  page = 1, 
  limit = 5,
  filters: { themes?: string[] } = {} // 添加可选的 filters 参数
): Promise<{ posts: Post[], hasMore: boolean }> => {
  if (USE_MOCK) {
    return getMockHotspotPosts(page, limit, filters); // 将 filters 传递给模拟函数
  }
  // 真实 API 请求，将 filters 中的 themes 作为查询参数
  return http.get('/hotspot/posts', { params: { page, limit, themes: filters.themes } });
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