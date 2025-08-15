import type { Post, ChartDataItem, SentimentAnalysisData, ActiveUser, EmergingTopic, StreamedChatApi } from '../src/types/api';

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


const allMockPosts: Post[] = [
  { id: 'p001', theme: '升学规划 / 考研', username: '学霸A', score: 98.5, title: '【25考研】数学一全程规划与资料分享', content: '内容：本人已上岸，分享一下自己整理的数学一全年复习规划和用过的宝藏资料，内容非常详细，希望能帮助到大家。', postTime: '2025-08-14 10:30', viewCount: 1204, likeCount: 256, commentCount: 32 },
  { id: 'p002', theme: '生活服务 / 二手交易', username: '机智的学长', score: 95.2, title: '出一个九成新显示器，带包装', content: '内容：自用一年，2k 144hz，无任何划痕，箱说全。因换新所以出，价格可小刀，仅限校内自提。', postTime: '2025-08-14 09:15', viewCount: 987, likeCount: 198, commentCount: 45 },
  { id: 'p003', theme: '课程相关 / 选课咨询', username: '迷茫的小白', score: 88.0, title: '求问《人工智能导论》这门课怎么样？', content: '内容：请问有学长学姐上过这门课吗？任务量大吗？给分如何？求真实测评！', postTime: '2025-08-13 22:00', viewCount: 750, likeCount: 50, commentCount: 15 },
  { id: 'p004', theme: '机会类型 / 实习', username: 'HR-Lily', score: 99.1, title: '【招聘】某互联网大厂招聘产品实习生', content: '内容：要求对用户体验有一定理解，每周可实习4天以上，薪资优厚，有转正机会。', postTime: '2025-08-14 11:30', viewCount: 1500, likeCount: 350, commentCount: 55 },
  { id: 'p005', theme: '机会类型 / 实习', username: 'HR-Lilysds', score: 93.1, title: '【招聘】某互联网大厂招聘数据分析实习生', content: '内容：需要熟练掌握SQL和Python，有相关项目经验者优先。', postTime: '2025-08-13 11:31', viewCount: 1501, likeCount: 340, commentCount: 25 },
  { id: 'p006', theme: '资源共享 / 资料下载', username: '资料搬运工', score: 92.5, title: '分享最新版的高数叔复习全书PDF', content: '内容：高清无水印版本，需要的同学自取。', postTime: '2025-08-13 10:00', viewCount: 1100, likeCount: 300, commentCount: 40 },
  { id: 'p007', theme: '生活服务 / 拼车', username: '老司机', score: 91.8, title: '周末找人拼车去机场，差2人', content: '内容：周六早上8点出发，有同行的吗？', postTime: '2025-08-12 20:00', viewCount: 600, likeCount: 20, commentCount: 8 },
  { id: 'p008', theme: '社交互助 / 兴趣社群', username: '羽球达人', score: 90.3, title: '有没有羽毛球搭子，每周约球', content: '内容：水平中等，男女不限，主要是想锻炼身体。', postTime: '2025-08-12 18:00', viewCount: 550, likeCount: 45, commentCount: 18 },
  { id: 'p009', theme: '升学规划 / 保研', username: '上岸的鱼', score: 97.6, title: '保研经验分享：如何准备夏令营', content: '内容：干货满满，从材料准备到面试技巧，全部分享。', postTime: '2025-08-14 08:00', viewCount: 1300, likeCount: 450, commentCount: 65 },
  { id: 'p010', theme: '课程相关 / 学业辅导', username: '物理大神', score: 85.4, title: '免费答疑大学物理，有问题可以留言', content: '内容：看到很多学弟学妹在物理上遇到困难，开个帖子义务答疑。', postTime: '2025-08-11 23:00', viewCount: 800, likeCount: 150, commentCount: 90 },
  { id: 'p011', theme: '生活服务 / 外卖团购', username: '拼单大师', score: 84.1, title: '楼下奶茶店拼单，有无兄弟姐妹', content: '内容：新品买一送一，还差一杯就凑够了，速来！', postTime: '2025-08-11 15:00', viewCount: 300, likeCount: 15, commentCount: 5 },
];

// ✅✅✅ 核心修复：让模拟 API 支持筛选 ✅✅✅
export const getMockHotspotPosts = (
  page = 1, 
  limit = 5,
  filters: { themes?: string[] } = {} // 接收一个筛选对象
): Promise<{ posts: Post[], hasMore: boolean }> => {

  // 1. 先根据筛选条件过滤整个数据库
  let filteredPosts = allMockPosts;
  if (filters.themes && filters.themes.length > 0) {
    filteredPosts = allMockPosts.filter(post => 
      filters.themes!.includes(post.theme)
    );
  }

  // 2. 再对过滤后的结果进行分页
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedPosts = filteredPosts.slice(start, end);
  const hasMore = end < filteredPosts.length;

  // 模拟网络延迟
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ posts: paginatedPosts, hasMore });
    }, 300); // 减少一点延迟以改善体验
  });
};

export const mockScoreChart: ChartDataItem[] = [
  { name: '帖子D', value: 99.1 },
  { name: '帖子A', value: 98.5 },
  { name: '帖子I', value: 97.6 },
  { name: '帖子B', value: 95.2 },
  { name: '帖子E', value: 93.1 },
];
export const mockWordCloud: ChartDataItem[] = [
  { name: '食堂', value: 120 }, { name: '图书馆', value: 98 }, { name: '自习', value: 85 }, { name: '二手', value: 77 }, { name: '羽毛球', value: 69 }, { name: '考研', value: 110 }, { name: '快递', value: 50 },
];
export const mockSentimentData: SentimentAnalysisData = {
  // ✅ FIX: 直接引用 allMockPosts 中的数据
  mostPositivePosts: [allMockPosts[3]], // 帖子D (产品实习生) 是分数最高的
  mostNegativePosts: [{ id: 'p_neg_1', theme: '吐槽', title: '标题：最消极帖子1', content: '内容：这门课也太难了，作业又多，感觉要挂了...', postTime: '2025-08-12 14:00', viewCount: 500, likeCount: 10, commentCount: 88, sentiment: 'negative' }],
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
export const mockStreamedChatApi: StreamedChatApi = async (
  { prompt, stopSignal },
  onStream
) => {
  const fullResponse = `这是针对您的问题“${prompt}”的模拟回复...`;
  
  let index = 0;
  const intervalId = setInterval(() => {
    if (index < fullResponse.length) {
      onStream(fullResponse[index]);
      index++;
    } else {
      clearInterval(intervalId);
    }
  }, 50);

  // 监听中止信号，清理定时器
  stopSignal.addEventListener('abort', () => {
    clearInterval(intervalId);
    console.log('模拟 API 已被中止');
  });

  return new Promise(resolve => {
    const timeoutId = setTimeout(() => resolve(), fullResponse.length * 50 + 500);
    stopSignal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      resolve(); // 中止时也立即 resolve
    });
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
      content: '好的，jrm！紧急任务收到，这份招新策划案的文字稿为你准备好了。考虑到是校学生会的正式活动，文稿中已为你对标了学校的官方语境和格式要求，并恰当引用了相关的指导精神，以确保策划案的专业性和规范性。请过目：花了一周时间，把乱糟糟的宿舍打造成了电竞小屋，太有成就感了...为深入学习宣传贯彻党的二十大精神，全面落实习近平总书记关于青年工作的重要思想，深化我校学生会组织改革，践行习近平总书记致中山大学建校100周年贺信中的重要精神，即“着力培养更多能够担当民族复兴大任的时代新人”，校学生会始终坚持“全心全意为同学服务”的宗旨，致力于成为学校联系广大同学的桥梁和纽带。为吸纳更多有志于服务同学、锻炼自我的优秀力量，进一步增强学生会组织的凝聚力与战斗力，拟举办本次招新展台活动。',
      postTime: '2025-08-14 15:00',
      viewCount: 2000,
      likeCount: 500,
      commentCount: 80,
    },
    emergenceTime: '2025-08-14',
  },
  // ... 可以添加更多新晋话题
];