import http from '@/utils/http';
import type { SentimentAnalysisData, EmergingTopic, ActiveUser } from '@/types/api';
import { mockSentimentData, mockEmergingTopics, mockActiveUsers } from '../../../mock/analysis';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const getSentimentAnalysis = (): Promise<SentimentAnalysisData> => {
  if (USE_MOCK) return Promise.resolve(mockSentimentData);
  return http.get('/sentiment/analysis');
};

export const getEmergingTopics = (): Promise<EmergingTopic[]> => {
  if (USE_MOCK) return Promise.resolve(mockEmergingTopics);
  return http.get('/sentiment/emerging-topics');
};

export const getActiveUsers = (params: { type: string, theme?: string }): Promise<ActiveUser[]> => {
  if (USE_MOCK) {
    // 模拟筛选和排序
    console.log('获取活跃用户，参数:', params);
    return Promise.resolve(mockActiveUsers);
  }
  return http.get('/sentiment/active-users', { params });
};