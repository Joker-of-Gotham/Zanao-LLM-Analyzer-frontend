import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 引入路由
import pinia from './store';   // 引入 Pinia (下一步创建)
import naive from 'naive-ui';  // 引入 Naive UI

// 引入全局样式
import '@/assets/styles/main.scss';

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(naive);

app.mount('#app');