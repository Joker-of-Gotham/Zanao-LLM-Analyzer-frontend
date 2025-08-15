<template>
  <div class="page-wrapper">
    <ChatInterface
      ref="chatInterfaceRef"
      title="您想检索哪些资源？"
      :session="activeSession"
      @send="handleSend"
    />
    <ChatHistory
      :sessions="sessions"
      :active-session-id="activeSessionId"
      @new-chat="handleNewChat"
      @switch-chat="handleSwitchChat"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useChat } from '@/composables/useChat';
import ChatInterface, { type ChatInterfaceExposed } from '@/components/chat/ChatInterface.vue'; 
import ChatHistory from '@/components/chat/ChatHistory.vue';
import { mockStreamedChatApi } from '../../../mock/analysis';
import type { StreamedChatApi } from '@/types/api';

// 为“资源检索”页面创建另一套独立的对话状态管理器
const {
  sessions,
  activeSessionId,
  activeSession,
  createNewSession,
  setActiveSession,
  addMessageToActiveSession,
  updateStreamingMessage,
  generateTitleForActiveSession,
} = useChat();

const chatInterfaceRef = ref<ChatInterfaceExposed | null>(null);

// 定义本页面的 API，可以对 prompt 做预处理
// ✅ 最终修复：API 函数的签名与 StreamedChatApi 类型一致
const handleResourceRetrievalApi: StreamedChatApi = async ({ prompt, stopSignal }, onStream) => {
  const processedPrompt = `[资源检索模式] ${prompt}`;
  return mockStreamedChatApi({ prompt: processedPrompt, stopSignal }, onStream);
};

// ✅ 最终修复：handleSend 的参数解构和调用正确
const handleSend = async ({ prompt, stopSignal }: { prompt: string, stopSignal: AbortSignal }) => {
  if (!activeSession.value) createNewSession();
  addMessageToActiveSession({ role: 'user', content: prompt });
  addMessageToActiveSession({ role: 'assistant', content: '' });

  try {
    await handleResourceRetrievalApi({ prompt, stopSignal }, (chunk) => {
      updateStreamingMessage(chunk);
    });
    generateTitleForActiveSession();
  } finally {
    chatInterfaceRef.value?.finishReplying();
  }
};

// 处理来自 ChatHistory 的新建对话事件
const handleNewChat = () => {
  createNewSession();
};

// 处理来自 ChatHistory 的切换对话事件
const handleSwitchChat = (sessionId: string) => {
  setActiveSession(sessionId);
};

// 初始化：确保至少有一个会话存在
onMounted(() => {
  if (sessions.value.length === 0) {
    createNewSession();
  }
});
</script>

<style scoped>
.page-wrapper {
  display: flex; /* ✅ 关键：必须是 flex 布局 */
  height: 100%;
  overflow: hidden;
}

/* 让 ChatInterface 自动填充剩余空间 */
:deep(.chat-container) {
  flex-grow: 1;
  min-width: 0; /* 防止内容溢出时撑破布局 */
}
</style>