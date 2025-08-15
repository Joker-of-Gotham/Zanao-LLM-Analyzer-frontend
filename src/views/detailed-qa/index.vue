<template>
  <div class="page-wrapper">
    <ChatInterface
      ref="chatInterfaceRef"
      title="您想咨询哪些细节？"
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

// 为“细节问答”页面创建一套独立的对话状态管理器
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

// ✅ 最终修复：API 函数的签名与 StreamedChatApi 类型一致
const handleDetailedQAApi: StreamedChatApi = async ({ prompt, stopSignal }, onStream) => {
  return mockStreamedChatApi({ prompt, stopSignal }, onStream);
};

// ✅ 最终修复：handleSend 的参数解构正确
const handleSend = async ({ prompt, stopSignal }: { prompt: string, stopSignal: AbortSignal }) => {
  if (!activeSession.value) createNewSession();
  addMessageToActiveSession({ role: 'user', content: prompt });
  addMessageToActiveSession({ role: 'assistant', content: '' });

  try {
    // ✅ 最终修复：调用 API 时传递正确的参数
    await handleDetailedQAApi({ prompt, stopSignal }, (chunk) => {
      updateStreamingMessage(chunk);
    });
    generateTitleForActiveSession();
  } catch(error) {
    if ((error as Error).name !== 'AbortError') {
      console.error("API出错:", error);
      updateStreamingMessage("\n\n抱歉，回复出错了。");
    }
  } finally {
    chatInterfaceRef.value?.finishReplying();
  }
};

const handleNewChat = () => {
  createNewSession();
};

const handleSwitchChat = (sessionId: string) => {
  setActiveSession(sessionId);
};

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