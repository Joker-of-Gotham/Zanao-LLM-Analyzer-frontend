<template>
  <div class="chat-container">
    <div class="chat-window">
      <!-- 消息展示区 -->
      <div ref="messagesContainerRef" class="messages-area">
        <!-- 欢迎界面 -->
        <div v-if="!session || session.messages.length === 0" class="welcome-screen">
          <div class="welcome-logo">Z</div>
          <h1 class="welcome-title">{{ title }}</h1>
        </div>
        <!-- 消息列表 -->
        <div v-else class="message-list">
          <div v-for="message in session.messages" :key="message.id" class="message-wrapper" :class="`role-${message.role}`">
            <n-avatar round :style="{ backgroundColor: message.role === 'user' ? '#3b82f6' : '#10b981', flexShrink: 0 }">
              {{ message.role === 'user' ? '我' : 'AI' }}
            </n-avatar>
            <div class="message-content" v-html="renderMarkdown(message.content)"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 输入框区域 -->
    <div class="input-area-wrapper">
      <div class="input-box-container">
        <n-input
          v-model:value="userInput"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 5 }"
          placeholder="请输入您的问题..."
          @keydown.enter.prevent="handleSend"
          class="chat-input"
        />
        <n-button @click="handleSend" :disabled="isReplying" circle type="primary" class="send-button">
          <template #icon><n-icon :component="ArrowUp" /></template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { NAvatar, NInput, NButton, NIcon } from 'naive-ui';
import { ArrowUp } from '@vicons/ionicons5';
import { marked } from 'marked';
import type { ChatSession } from '@/types/api';

// ✅ NEW: 定义一个接口来描述暴露给父组件的方法
export interface ChatInterfaceExposed {
  startReplying: () => void;
  finishReplying: () => void;
}

const props = defineProps<{
  title: string;
  session: ChatSession | null;
}>();

const emit = defineEmits<{
  (e: 'send', prompt: string): void;
}>();

const userInput = ref('');
const isReplying = ref(false);
const messagesContainerRef = ref<HTMLDivElement | null>(null);

// Markdown 渲染函数配置
marked.setOptions({
  gfm: true, // 启用 GitHub Flavored Markdown
  breaks: true, // 将换行符渲染为 <br>
});
const renderMarkdown = (text: string) => {
  // 如果内容为空，返回一个闪烁的光标效果
  if (text === '') {
    return '<span class="blinking-cursor">▍</span>';
  }
  return marked.parse(text);
};

// 滚动到底部函数
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainerRef.value) {
      messagesContainerRef.value.scrollTo({ 
        top: messagesContainerRef.value.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  });
};

// 监听会话消息的变化，自动滚动
watch(
  () => props.session?.messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

// 发送消息
const handleSend = async () => {
  if (!userInput.value.trim() || isReplying.value) return;
  
  const prompt = userInput.value;
  userInput.value = ''; // 立即清空输入框
  isReplying.value = true;
  
  emit('send', prompt);
};

// ✅ CHANGED: 使用我们定义的接口来明确暴露的类型
defineExpose<ChatInterfaceExposed>({
  startReplying: () => { isReplying.value = true; },
  finishReplying: () => { isReplying.value = false; },
});
</script>

<style scoped>
/* 全面对标 ChatGPT 风格 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  position: relative;
  background-color: #343541;
}

.chat-window {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  overflow: hidden; /* 隐藏滚动条，由内部 messages-area 控制 */
}

.messages-area {
  width: 100%;
  max-width: 800px;
  overflow-y: auto;
  padding: 20px 10px;
}

/* 欢迎界面 */
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-bottom: 20vh;
}

.welcome-logo {
  width: 50px;
  height: 50px;
  background-color: #202123;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 24px;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #c7c7d1;
}

/* 消息列表 */
.message-list {
  padding-bottom: 150px; /* 为输入框区域留出足够的空间 */
}

.message-wrapper {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  width: 100%;
}

.message-content {
  padding-top: 2px;
  line-height: 1.7;
  color: #d1d5db;
  width: calc(100% - 56px); /* 减去头像和gap的宽度 */
}
.message-content:deep(p:last-child) {
  margin-bottom: 0;
}

/* 闪烁光标 */
.blinking-cursor {
  font-weight: bold;
  animation: blink 1s step-start 0s infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}

/* 输入框区域 */
.input-area-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 10px;
  background: linear-gradient(to top, #343541 30%, transparent);
  display: flex;
  justify-content: center;
}

.input-box-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: flex-end;
}

.chat-input {
  background-color: #40414f !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px !important;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
}

:deep(.n-input .n-input__textarea-el) {
  padding: 10px 50px 10px 16px; /* 为按钮留出空间 */
  line-height: 1.5;
  color: #ececf1;
}

.send-button {
  position: absolute;
  right: 10px;
  bottom: 8px;
}
</style>