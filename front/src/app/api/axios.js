import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000, // 15秒超时
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // 允许携带cookie
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log(`[API请求] ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params);
    
    // 显示请求详细信息，帮助调试
    if (config.method === 'delete') {
      console.log('DELETE请求详情:', {
        url: config.url,
        headers: config.headers,
        params: config.params,
        data: config.data
      });
    }
    
    // 尝试获取用户ID - 始终使用1作为默认值
    const userId = localStorage.getItem('userId') || '1';
    config.headers['User-Id'] = userId;
    
    return config;
  },
  (error) => {
    console.error('[API请求错误]', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log(`[API响应] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    
    // 数据转换
    console.log('API响应状态:', response.status);
    console.log('API响应URL:', response.config.url);
    console.log('API响应数据:', response.data);
    
    // 检查不同的响应格式
    if (response.data && response.data.code === 0) {
      // 标准ApiResponse格式
      console.log('使用标准ApiResponse格式解析数据');
      return { data: response.data.data };
    } else if (response.data && Array.isArray(response.data)) {
      // 直接返回数组
      console.log('直接返回数组数据');
      return { data: response.data };
    } else if (response.data && typeof response.data === 'object') {
      // 可能是直接返回的数据对象
      console.log('直接返回对象数据');
      if (Array.isArray(response.data.content)) {
        // Spring Data 分页格式
        console.log('检测到Spring Data分页格式');
        return { data: response.data.content };
      }
      return response.data;
    } else {
      console.error('无法识别的响应格式:', response.data);
      return Promise.reject(new Error(response.data?.message || '请求失败，响应格式不正确'));
    }
  },
  (error) => {
    console.error('[API响应错误]', error.response?.data || error.message);
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('状态码:', error.response.status);
      console.error('错误数据:', error.response.data);
      
      // 不同状态码的处理
      switch (error.response.status) {
        case 401:
          console.error('未授权，请登录');
          // 可以在这里处理重定向到登录页面
          break;
        case 403:
          console.error('禁止访问');
          break;
        case 404:
          console.error('资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error('请求失败');
      }
      
      return Promise.reject(error.response.data?.message || `服务器错误 (${error.response.status})`);
    } else if (error.request) {
      // 请求发送了但没有收到响应
      console.error('没有收到响应:', error.request);
      return Promise.reject('网络异常，请检查网络连接');
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message);
      return Promise.reject(error.message);
    }
  }
);

export default api;