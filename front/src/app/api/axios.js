import axios from 'axios';

// 创建Axios实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 从环境变量获取基础地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 请求日志
    console.log(`发送请求: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config);
    
    // 可以在这里添加认证Token等
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 日志响应数据
    console.log(`收到响应: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    
    // 处理响应数据
    const res = response.data;
    if (res.code && res.code !== 200) {
      // 根据后端约定的错误码进行处理
      console.error(`请求错误 [${res.code}]: ${res.msg || '未知错误'}`);
      return Promise.reject(new Error(res.msg || '请求错误'));
    } else {
      return res;
    }
  },
  (error) => {
    // 处理响应错误
    console.error('请求失败', error);
    if (error.response) {
      console.error(`状态码: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error('请求已发出但没有收到响应', error.request);
    }
    return Promise.reject(error);
  }
);

export default api;