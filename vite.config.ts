import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 不再需要 'path'，可以直接使用 'url' 模块
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // 设置路径别名
    alias: {
      // ✅ 使用 import.meta.url 和 new URL() 来获取当前文件路径，这是ESM的标准做法
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // 配置开发服务器
    host: '0.0.0.0', // 允许通过 IP 地址访问
    port: 5173,      // 你可以指定一个端口
    proxy: {
      // 配置 API 请求代理，解决跨域问题
      '/api': {
        target: 'http://127.0.0.1:5060', // 你的本地后端服务地址
        changeOrigin: true, // 必须设置为 true
        rewrite: (path) => path.replace(/^\/api/, ''), // 去除请求前缀
      },
    },
  },
})