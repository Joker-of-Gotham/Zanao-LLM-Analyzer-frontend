import http from '@/utils/http';
import type { Post, ChartDataItem } from '@/types/api';
import { mockHotspotPosts, mockScoreChart, mockWordCloud } from '../../../mock/analysis';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const getHotspotPosts = (): Promise<Post[]> => {
  if (USE_MOCK) {
    return Promise.resolve(mockHotspotPosts);
  }
  return http.get('/hotspot/posts');
};

export const getScoreChartData = (): Promise<ChartDataItem[]> => {
    if (USE_MOCK) {
        return Promise.resolve(mockScoreChart);
    }
    return http.get('/hotspot/score-chart');
}

export const getWordCloudData = (): Promise<ChartDataItem[]> => {
    if (USE_MOCK) {
        return Promise.resolve(mockWordCloud);
    }
    return http.get('/hotspot/word-cloud');
}