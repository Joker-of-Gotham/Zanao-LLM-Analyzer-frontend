import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/components/layout/MainLayout.vue';
import SimpleLayout from '@/components/layout/SimpleLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout, // 使用主布局
    redirect: '/home', // 默认重定向到首页
    children: [
      {
        path: 'home', // 使用 /home 作为首页路径
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: 'hotspot-tracking',
        name: 'HotspotTracking',
        component: () => import('@/views/hotspot-tracking/index.vue'),
      },
      {
        path: 'detailed-qa',
        name: 'DetailedQA',
        component: () => import('@/views/detailed-qa/index.vue'),
      },
      {
        path: 'resource-retrieval',
        name: 'ResourceRetrieval',
        component: () => import('@/views/resource-retrieval/index.vue'),
      },
      {
        path: 'sentiment-analysis',
        name: 'SentimentAnalysis',
        component: () => import('@/views/sentiment-analysis/index.vue'),
      },
      {
        path: 'user-analysis',
        name: 'UserAnalysis',
        component: () => import('@/views/user-analysis/index.vue'),
      },
    ],
  },
  {
    path: '/about',
    component: SimpleLayout, // 使用简单布局
    children: [
      {
        path: '',
        name: 'About',
        component: () => import('@/views/about/index.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;