// ============= 基础响应结构 =============
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ============= 数据实体 =============

/** 帖子信息 */
export interface Post {
  id: string;
  theme: string;
  title: string;
  content: string;
  postTime: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  sentiment?: 'positive' | 'negative' | 'neutral'; // 情绪分析可能会用到
}

/** 评论信息 */
export interface Comment {
  id: string;
  postId: string;
  content: string;
  postTime: string;
  likeCount: number;
}

/** 活跃用户信息 */
export interface ActiveUser {
  userId: string;
  username: string;
  lastActiveTime: string;
  activeTheme: string;
  postCount?: number;
  commentCount?: number;
  replyCount?: number;
}

// ============= 图表数据结构 =============

/** 通用图表数据项 (用于柱状图, 饼图, 词云图等) */
export interface ChartDataItem {
  name: string;
  value: number;
}

/** 情绪时序图数据点 */
export interface SentimentTimelinePoint {
  date: string; // e.g., '2025-08-14'
  positiveRate: number; // 0 to 1
  negativeRate: number; // 0 to 1
}

// ============= API 响应数据结构 =============

/** 舆情检测页数据 */
export interface SentimentAnalysisData {
  mostPositivePosts: Post[];
  mostNegativePosts: Post[];
  sentimentPie: ChartDataItem[];
  sentimentTimeline: SentimentTimelinePoint[];
}

/** 用户分析页数据 */
export interface UserAnalysisData {
  activityTimeline: (Post | Comment)[];
  topPost: Post | null;
  topComment: Comment | null;
  wordCloud: ChartDataItem[];
  aiAnalysisText: string;
}

// ============= 对话功能 =============

/** 单条对话消息 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/** 对话会话记录 */
export interface ChatSession {
  id:string;
  title: string;
  messages: ChatMessage[];
  lastUpdateTime: number;
}

/** 定义一个通用的流式API函数类型 */
export type StreamedChatApi = (
  prompt: string, 
  onStream: (chunk: string) => void
) => Promise<void>;


// ============= 舆情分析功能 =============
/** 新晋话题信息 */
export interface EmergingTopic {
  id: string;
  topicName: string;
  relatedPost: Post; // 关联一篇代表性帖子
  emergenceTime: string;
}

// 确保 SentimentAnalysisData 类型完整
export interface SentimentAnalysisData {
  mostPositivePosts: Post[];
  mostNegativePosts: Post[];
  sentimentPie: ChartDataItem[]; // 用于饼图
  sentimentTimeline: SentimentTimelinePoint[]; // 用于曲线图
}

/** 单个活动轨迹项 */
export interface ActivityEvent {
  id: string;
  type: 'post' | 'comment'; // 活动类型
  timestamp: string;
  relatedItem: Post | Comment; // 关联的帖子或评论
}

/** 用户分析页面完整数据 */
export interface UserProfileData {
  userId: string;
  username: string;
  activityTimeline: ActivityEvent[];
  topLikedPost: Post | null;
  topLikedComment: Comment | null;
  wordCloud: ChartDataItem[];
  aiAnalysis: string; // 由 Markdown 格式化的文本
}