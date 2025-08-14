import type { UserProfileData, Post, Comment } from '../src/types/api';

// 模拟一些帖子和评论用于数据关联
const mockUserPost1: Post = { id: 'p_user_1', theme: '课程相关', title: '【最高赞帖子】关于XXX课程的深度解析', content: '这门课我给了满分，老师讲得非常好...', postTime: '2025-08-10 10:00', viewCount: 5000, likeCount: 1500, commentCount: 120 };
const mockUserComment1: Comment = { id: 'c_user_1', postId: 'p001', content: '【最高赞评论】说得太对了！我也是这么觉得的！', postTime: '2025-08-12 11:30', likeCount: 250 };
const mockUserPost2: Post = { id: 'p_user_2', theme: '生活服务', title: '【活动轨迹】求一个二手书架', content: '有无毕业学长学姐出二手书架...', postTime: '2025-08-14 18:00', viewCount: 100, likeCount: 5, commentCount: 2 };
const mockUserComment2: Comment = { id: 'c_user_2', postId: 'p002', content: '【活动轨迹】我有我有，私聊你。', postTime: '2025-08-13 09:00', likeCount: 1 };


// 模拟完整的用户分析数据
export const mockUserProfile: UserProfileData = {
  userId: 'user001',
  username: '发帖最多的靓仔',
  topLikedPost: mockUserPost1,
  topLikedComment: mockUserComment1,
  wordCloud: [
    { name: '课程', value: 90 }, { name: '老师', value: 85 }, { name: '资料', value: 70 },
    { name: '二手', value: 65 }, { name: '分享', value: 80 }, { name: '考研', value: 50 },
  ],
  aiAnalysis: `
### 用户画像总结

根据该用户的历史活动数据，我们可以构建以下用户画像：

*   **学业关注者**: 该用户在“课程相关”和“升学规划”领域表现出高度活跃性。词云中的高频词如“课程”、“老师”、“资料”和“考研”也印证了这一点。
*   **乐于分享**: 从其最高赞帖子来看，该用户倾向于分享深度、有价值的内容，并获得了社区的高度认可。
*   **活跃时期**: 主要活跃在下午和晚间，符合大学生的作息规律。

### 潜在需求分析

1.  **高质量内容需求**: 持续关注高质量的学习资源和课程评价。
2.  **升学焦虑**: 可能处于考研或保研的关键时期，对相关信息有较强需求。
3.  **社区影响力**: 有潜力成为校园内的KOL（关键意见领袖）。
  `,
  activityTimeline: [
    { id: 'act_1', type: 'post', timestamp: '2025-08-14 18:00', relatedItem: mockUserPost2 },
    { id: 'act_2', type: 'comment', timestamp: '2025-08-13 09:00', relatedItem: mockUserComment2 },
    { id: 'act_3', type: 'post', timestamp: '2025-08-10 10:00', relatedItem: mockUserPost1 },
    { id: 'act_4', type: 'comment', timestamp: '2025-08-12 11:30', relatedItem: mockUserComment1 },
    // ... 可以添加更多活动项，凑够8个以上
    { id: 'act_5', type: 'post', timestamp: '2025-08-09 12:00', relatedItem: { ...mockUserPost1, id: 'p_user_3', title: '更早的帖子1'} },
    { id: 'act_6', type: 'comment', timestamp: '2025-08-08 14:00', relatedItem: { ...mockUserComment1, id: 'c_user_3', content: '更早的评论1' } },
    { id: 'act_7', type: 'post', timestamp: '2025-08-07 16:00', relatedItem: { ...mockUserPost1, id: 'p_user_4', title: '更早的帖子2'} },
    { id: 'act_8', type: 'comment', timestamp: '2025-08-06 18:00', relatedItem: { ...mockUserComment1, id: 'c_user_4', content: '更早的评论2' } },
  ],
};