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
// ✅ CHANGED: 从组件导入暴露的类型接口
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
const handleResourceRetrievalApi: StreamedChatApi = async (prompt, onStream) => {
  // 模拟对 prompt 的预处理
  const processedPrompt = `[资源检索模式] ${prompt}`;
  return mockStreamedChatApi(processedPrompt, onStream);
};

// 处理来自 ChatInterface 的发送事件
const handleSend = async (prompt: string) => {
  if (!activeSession.value) {
    createNewSession();
  }

  addMessageToActiveSession({ role: 'user', content: prompt });
  addMessageToActiveSession({ role: 'assistant', content: '' });

  try {
    // 调用本页面专属的 API
    await handleResourceRetrievalApi(prompt, (chunk) => {
      updateStreamingMessage(chunk);
    });
    generateTitleForActiveSession();
  } catch(error) {
    console.error("资源检索API出错:", error);
    updateStreamingMessage("\n\n抱歉，回复出错了。");
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
  padding: 0;
  height: 100vh;
  position: relative;
}
</style>