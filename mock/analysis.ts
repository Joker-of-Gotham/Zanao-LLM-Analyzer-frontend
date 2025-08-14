import type { Post, ChartDataItem, SentimentAnalysisData, ActiveUser, EmergingTopic } from '../src/types/api';

// ✅ NEW: 使用您提供的真实主题分类
export const realThemes = {
  "机会类型": ["兼职 / 实习", "校园活动", "奖助学金", "比赛/竞赛", "调研/志愿"],
  "升学规划": ["保研", "考研", "出国", "留学"],
  "课程相关": ["选课咨询", "学业辅导", "MOOC推荐"],
  "职业发展": ["校园招聘", "社会招聘", "职业技能培训", "简历辅导"],
  "科研项目": ["科研助理（RA）", "项目申报", "论文合作", "实验室招募"],
  "考证与能力提升": ["资格证书", "竞赛培训", "语言考试辅导"],
  "资源共享": ["资料下载", "书籍交换", "软件工具"],
  "生活服务": ["二手物品交易", "拼车/租房", "校园打车", "外卖团购"],
  "社交互助": ["师生问答", "心灵驿站", "兴趣社群"],
};


// ✅ CHANGED: 模拟帖子的主题现在来自真实分类
export const mockHotspotPosts: Post[] = [
  { id: 'p001', theme: '考研', title: '标题：【25考研】数学一全程规划与资料分享', content: '内容：本人已上岸，分享一下自己整理的数学一全年复习规划和用过的宝藏资料...', postTime: '2025-08-14 10:30', viewCount: 1204, likeCount: 256, commentCount: 32, sentiment: 'positive' },
  { id: 'p002', theme: '二手物品交易', title: '标题：出一个九成新显示器，带包装', content: '内容：自用一年，2k 144hz，无任何划痕，箱说全。因换新所以出。', postTime: '2025-08-14 09:15', viewCount: 987, likeCount: 198, commentCount: 45, sentiment: 'neutral' },
  { id: 'p003', theme: '选课咨询', title: '标题：求问《人工智能导论》这门课怎么样？', content: '内容：请问有学长学姐上过这门课吗？任务量大吗？给分如何？', postTime: '2025-08-13 22:00', viewCount: 750, likeCount: 50, commentCount: 15 },
  { id: 'p004', theme: '兼职 / 实习', title: '标题：【招聘】某互联网大厂招聘产品实习生', content: '内容：要求对用户体验有一定理解，每周可实习4天以上，薪资优厚。', postTime: '2025-08-14 11:30', viewCount: 1500, likeCount: 350, commentCount: 55, sentiment: 'positive' },
];

// ... (其余模拟数据保持不变) ...
export const mockScoreChart: ChartDataItem[] = [
  { name: '帖子A', value: 98 }, { name: '帖子B', value: 95 }, { name: '帖子C', value: 88 }, { name: '帖子D', value: 85 }, { name: '帖子E', value: 76 },
];
export const mockWordCloud: ChartDataItem[] = [
  { name: '食堂', value: 120 }, { name: '图书馆', value: 98 }, { name: '自习', value: 85 }, { name: '二手', value: 77 }, { name: '羽毛球', value: 69 }, { name: '考研', value: 110 }, { name: '快递', value: 50 },
];
export const mockSentimentData: SentimentAnalysisData = {
  mostPositivePosts: [mockHotspotPosts[0]],
  mostNegativePosts: [{ id: 'p004', theme: '吐槽', title: '标题：最消极帖子1', content: '内容：这门课也太难了，作业又多，感觉要挂了...', postTime: '2025-08-12 14:00', viewCount: 500, likeCount: 10, commentCount: 88, sentiment: 'negative' }],
  sentimentPie: [{ name: '积极', value: 872 }, { name: '消极', value: 128 }],
  sentimentTimeline: [
    { date: '2025-08-10', positiveRate: 0.8, negativeRate: 0.2 }, { date: '2025-08-11', positiveRate: 0.7, negativeRate: 0.3 }, { date: '2025-08-12', positiveRate: 0.75, negativeRate: 0.25 }, { date: '2025-08-13', positiveRate: 0.85, negativeRate: 0.15 },
  ]
}
export const mockActiveUsers: ActiveUser[] = [
    { userId: 'user001', username: '发帖最多的靓仔', lastActiveTime: '2025-08-14 11:00', activeTheme: 'XX主题', postCount: 50 }, { userId: 'user002', username: '评论最多的用户', lastActiveTime: '2025-08-14 10:55', activeTheme: '另一主题', commentCount: 200 }, { userId: 'user003', username: '收到回复最多', lastActiveTime: '2025-08-13 18:30', activeTheme: 'XX主题', replyCount: 88 },
]

// ============================================ 模拟AI过程 ============================================
/**
 * 模拟流式聊天API
 * @param prompt 用户的输入
 * @param onStream 流式回调函数，用于逐字发送内容
 */
export const mockStreamedChatApi = async (
  prompt: string,
  onStream: (chunk: string) => void
): Promise<void> => {
  const fullResponse = `这是针对您的问题“${prompt}”的模拟回复。这段回复是为了测试逐字生成效果而设计的，它会像打字机一样一个字一个字地出现，从而提供更接近真实大语言模型的交互体验。`;
  
  let index = 0;
  const intervalId = setInterval(() => {
    if (index < fullResponse.length) {
      onStream(fullResponse[index]);
      index++;
    } else {
      clearInterval(intervalId);
    }
  }, 50); // 每 50ms 输出一个字

  // 实际应用中，这里会返回一个 Promise，在流结束后 resolve
  return new Promise(resolve => {
    setTimeout(() => resolve(), fullResponse.length * 50 + 500);
  });
};

// ============================================ 模拟舆情分析部分的数据 ============================================

// ✅ NEW: 模拟新晋话题数据
export const mockEmergingTopics: EmergingTopic[] = [
  {
    id: 'et001',
    topicName: '#宿舍改造计划',
    relatedPost: {
      id: 'p005',
      theme: '生活服务',
      title: '分享一下我的宿舍改造前后对比图！',
      content: '花了一周时间，把乱糟糟的宿舍打造成了电竞小屋，太有成就感了...',
      postTime: '2025-08-14 15:00',
      viewCount: 2000,
      likeCount: 500,
      commentCount: 80,
    },
    emergenceTime: '2025-08-14',
  },
  // ... 可以添加更多新晋话题
];