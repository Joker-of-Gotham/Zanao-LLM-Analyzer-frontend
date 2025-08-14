import axios from 'axios';

// 创建 Axios 实例
const service = axios.create({
  // 关键：baseURL 会自动拼接到请求地址的前面
  // 在开发环境下，它指向 Vite 代理的目标 '/api'
  baseURL: '/api',
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求前做些什么，例如：添加 token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error('Request Error:', error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    // 假设后端返回的数据结构是 { code, msg, data }
    const res = response.data;
    if (res.code !== 200) { // 假设 200 是成功的状态码
      console.error('API Error:', res.message || 'Error');
      // 这里可以做一些全局的错误处理
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  (error) => {
    console.error('Response Error:', error); // for debug
    return Promise.reject(error);
  }
);

export default service;