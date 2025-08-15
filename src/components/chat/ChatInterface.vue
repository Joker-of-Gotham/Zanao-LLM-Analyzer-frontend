<template>
  <div class="chat-container">
    <div ref="messagesContainerRef" class="messages-area">
      <div class="message-list-wrapper">
        <div v-if="!session || session.messages.length === 0" class="welcome-screen">
          <h1 class="welcome-title">{{ title }}</h1>
        </div>
        <div v-else class="message-list">
          <div v-for="message in session.messages" :key="message.id" class="message-row" :class="`role-${message.role}`">
            <!-- ✅✅✅ 核心修复：所有消息都有一个 message-bubble ✅✅✅ -->
            <div class="message-bubble">
              <div class="message-content" v-html="renderMarkdown(message.content)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="input-area-wrapper">
      <div class="input-box-container">
        <n-input
          v-model:value="userInput"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 8 }"
          placeholder="请输入您的问题..."
          @keydown="handleKeyDown"
          class="chat-input"
        />
        <div class="button-container">
          <n-button v-if="!isReplying" @click="handleSend" :disabled="!userInput.trim()" circle strong secondary class="send-button">
            <template #icon><n-icon :component="ArrowUp" /></template>
          </n-button>
          <n-button v-else @click="handleStop" circle strong secondary class="stop-button">
            <template #icon><n-icon :component="Stop" /></template>
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { NInput, NButton, NIcon } from 'naive-ui';
import { ArrowUp, Stop } from '@vicons/ionicons5';
import { marked } from 'marked';
// ✅ 最终修复：回归简单的 katex 导入
import katex from 'katex'; 
import 'katex/dist/katex.min.css';
import type { ChatSession } from '@/types/api';

export interface ChatInterfaceExposed {
  startReplying: () => void;
  finishReplying: () => void;
}

const props = defineProps<{
  title: string;
  session: ChatSession | null;
}>();

const emit = defineEmits<{
  (e: 'send', options: { prompt: string, stopSignal: AbortSignal }): void;
}>();

const userInput = ref('');
const isReplying = ref(false);
const messagesContainerRef = ref<HTMLDivElement | null>(null);

let abortController: AbortController | null = null;

marked.setOptions({
  gfm: true,
  breaks: true,
});

// ✅ 核心修复：为 KaTeX 的 div 添加一个专属类名 'katex-block'
const renderMarkdown = (text: string) => {
  if (text === '') return '<span class="blinking-cursor">▍</span>';
  
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    try { 
      // 在这里添加了 class="katex-block"
      return `<div class="katex-block">${katex.renderToString(formula, { displayMode: true, throwOnError: false })}</div>`; 
    } 
    catch (e) { return match; }
  });
  
  text = text.replace(/\$([^\n$]+?)\$/g, (match, formula) => {
    try { return katex.renderToString(formula, { displayMode: false, throwOnError: false }); } 
    catch (e) { return match; }
  });
  
  return marked.parse(text);
};

// ✅✅✅ 完整的 scrollToBottom 函数 ✅✅✅
const scrollToBottom = (behavior: 'auto' | 'smooth' = 'smooth') => {
  nextTick(() => {
    if (messagesContainerRef.value) {
      messagesContainerRef.value.scrollTo({ 
        top: messagesContainerRef.value.scrollHeight, 
        behavior
      });
    }
  });
};

// ✅✅✅ 完整的 handleAutoScroll 函数 ✅✅✅
const handleAutoScroll = () => {
  const el = messagesContainerRef.value;
  if (el) {
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    if (isAtBottom) {
      scrollToBottom('smooth');
    }
  }
};

watch(() => props.session?.messages, handleAutoScroll, { deep: true });

// ✅✅✅ 完整的 handleSend 函数 ✅✅✅
const handleSend = async () => {
  if (!userInput.value.trim() || isReplying.value) return;
  const prompt = userInput.value;
  userInput.value = '';
  isReplying.value = true;
  abortController = new AbortController();
  emit('send', { prompt, stopSignal: abortController.signal });
};

// ✅✅✅ 完整的 handleStop 函数 ✅✅✅
const handleStop = () => {
  if (abortController) {
    abortController.abort(); // 中止请求
    isReplying.value = false;
  }
};

// ✅✅✅ 完整的 handleKeyDown 函数 ✅✅✅
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
    event.preventDefault();
    handleSend();
  }
};

// ✅✅✅ 完整的 defineExpose 函数 ✅✅✅
defineExpose<ChatInterfaceExposed>({
  startReplying: () => { isReplying.value = true; },
  finishReplying: () => {
    isReplying.value = false;
    abortController = null;
  },
});
</script>

<style scoped>
/* ✅ 最终修复：移除了所有空的 CSS 规则 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #242323;
  overflow: hidden;
}

.messages-area {
  flex-grow: 1;
  overflow-y: auto;
  position: relative;
  padding-bottom: 180px;
}
.messages-area::-webkit-scrollbar { width: 6px; }
.messages-area::-webkit-scrollbar-track { background: transparent; }
.messages-area::-webkit-scrollbar-thumb { background-color: #555; border-radius: 6px; }
.messages-area::-webkit-scrollbar-thumb:hover { background-color: #777; }

.welcome-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-bottom: 180px;
  box-sizing: border-box;
}
.welcome-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #c7c7d1;
}

.message-list-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.message-row { display: flex; margin-bottom: 24px; }
.message-row.role-user { justify-content: flex-end; }
.message-row.role-assistant { justify-content: flex-start; }

/* 核心：消息气泡样式 */
.message-bubble {
  max-width: 80%; /* 限制最大宽度 */
  padding: 12px 18px;
  border-radius: 20px;
  position: relative;
}

/* ✅ 核心修复：分别为 user 和 assistant 定义不同的背景和圆角 */
.message-row.role-user .message-bubble {
  background-color: #2a2a2e;
  border-radius: 20px 20px 4px 20px;
}

.message-content {
  color: #e2e2e5;
  line-height: 1.7;
  font-size: 1rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}
/* KaTeX 公式块的样式 */
:deep(.katex-block) {
  max-width: 100%;
  overflow-x: auto;
  padding: 16px;
  background-color: #242323; /* 稍亮的背景色，与消息气泡一致 */
  border-radius: 8px;
  text-align: center; /* 公式居中 */
}

/* Marked.js 代码块的样式 */
:deep(pre) {
  max-width: 100%;
  overflow-x: auto;
  padding: 16px;
  background-color: #101014; /* 更深的背景色 */
  border-radius: 8px;
  scrollbar-width: thin;
  scrollbar-color: #555 #101014;
}
:deep(pre)::-webkit-scrollbar { height: 6px; }
:deep(pre)::-webkit-scrollbar-thumb { background-color: #555; }


/* 单行代码的样式 */
:deep(code) {
  background-color: #101014;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Consolas', Courier, monospace;
}

.input-area-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 20px;
  background-color: #242323;
  box-shadow: 0 -10px 20px #242323;
}
.input-box-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}
:deep(.n-input) {
  --n-border-radius: 24px !important;
  --n-padding-left: 20px !important;
  --n-padding-right: 60px !important;
}
:deep(.n-input .n-input__textarea-el) {
  padding-top: 10px;
  padding-bottom: 10px;
  line-height: 1.6;
}

.button-container {
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
}
</style>