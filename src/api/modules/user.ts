import http from '@/utils/http';
import type { UserProfileData } from '@/types/api';
import { mockUserProfile } from '../../../mock/user';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const getUserProfile = (userId: string): Promise<UserProfileData> => {
  console.log('正在获取用户ID为', userId, '的分析数据...');
  if (USE_MOCK) {
    // 模拟API延时
    return new Promise(resolve => setTimeout(() => resolve(mockUserProfile), 1000));
  }
  return http.get(`/user/profile/${userId}`);
};