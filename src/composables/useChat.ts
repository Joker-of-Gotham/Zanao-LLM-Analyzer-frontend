import { ref, computed } from 'vue';
import type { ChatSession, ChatMessage } from '@/types/api';

// 这是一个工厂函数，每次调用都会创建一套新的、独立的状态
export function useChat() {
  // --- State ---
  const sessions = ref<ChatSession[]>([]);
  const activeSessionId = ref<string | null>(null);

  // --- Getters ---
  const activeSession = computed(() => {
    // ✅ CHANGED: 如果找不到，返回 null 而不是 undefined
    return sessions.value.find(s => s.id === activeSessionId.value) || null;
  });
  
  // --- Actions ---
  function createNewSession() {
    const newSession: ChatSession = {
      // 仿照 ChatGPT 的 ID 格式
      id: `c/${crypto.randomUUID()}`, 
      title: '新的对话',
      messages: [],
      lastUpdateTime: Date.now(),
    };
    sessions.value.unshift(newSession);
    activeSessionId.value = newSession.id;
    return newSession.id;
  }
  
  function setActiveSession(sessionId: string) {
    if (sessions.value.some(s => s.id === sessionId)) {
      activeSessionId.value = sessionId;
    }
  }

  function addMessageToActiveSession(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    if (!activeSession.value) {
      console.error("无法添加到不存在的会话中");
      return;
    }
    const newMessage: ChatMessage = {
      ...message,
      id: `${message.role}-${Date.now()}`,
      timestamp: Date.now(),
    };
    activeSession.value.messages.push(newMessage);
  }

  function updateStreamingMessage(contentChunk: string) {
    if (!activeSession.value) return;
    const lastMessage = activeSession.value.messages[activeSession.value.messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      lastMessage.content += contentChunk;
    }
  }
  
  function generateTitleForActiveSession() {
    if (!activeSession.value || activeSession.value.messages.length < 2) return;
    if (activeSession.value.title === '新的对话') {
      const firstUserMessage = activeSession.value.messages.find(m => m.role === 'user');
      if (firstUserMessage) {
        activeSession.value.title = firstUserMessage.content.substring(0, 25);
      }
    }
  }

  // 返回所有状态和方法，供页面使用
  return {
    sessions,
    activeSessionId,
    activeSession,
    createNewSession,
    setActiveSession,
    addMessageToActiveSession,
    updateStreamingMessage,
    generateTitleForActiveSession,
  };
}