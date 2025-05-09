import axios from '../axios';

/**
 * 用户登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise<{token: string, username: string, role: string}>} 登录成功的用户信息
 */
export const login = async (username, password) => {
  try {
    console.log('发送登录请求:', { username, password });
    const response = await axios.post('/api/auth/login', { username, password });
    console.log('登录原始响应：', response);
    
    // 分析响应结构
    const responseData = response.data || response;
    console.log('处理后的响应数据:', responseData);
    
    if (response.success === true) {
      // 从响应中提取用户数据
      const userData = responseData;
      console.log('提取的用户数据:', userData);
      
      if (!userData) {
        throw new Error('服务器返回的用户数据为空');
      }
      
      // 创建token（实际项目中应该由后端提供）
      const token = `user_token_${userData.username}_${Date.now()}`;
      
      return {
        token: token,
        username: userData.username,
        role: userData.role || 'user'
      };
    } else {
      // 响应成功但业务失败
      throw new Error(responseData.message || '登录失败，请检查用户名和密码');
    }
  } catch (error) {
    console.error('登录错误详情：', error);
    
    // 详细日志以帮助调试
    if (error.response) {
      console.error('错误响应状态:', error.response.status);
      console.error('错误响应数据:', error.response.data);
      throw new Error(error.response.data?.message || '登录失败，请检查用户名和密码');
    } else if (error.request) {
      console.error('请求发送但无响应');
      throw new Error('无法连接到服务器，请检查网络连接');
    } else {
      console.error('请求配置错误或其他错误');
      throw new Error(error.message || '登录请求出错，请稍后重试');
    }
  }
};

/**
 * 用户注册
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {string} email 邮箱
 * @returns {Promise<{message: string}>} 注册结果
 */
export const register = async (username, password, email) => {
  try {
    const response = await axios.post('/api/auth/register', {
      username,
      password,
      email
    });
    
    console.log('注册响应：', response);
    const responseData = response.data || response;
    
    if (response.success === true) {
      return {
        message: responseData.message || '注册成功',
        data: responseData.data
      };
    } else {
      console.log("抛出异常")
      throw new Error(responseData.message || '注册失败');
    }
  } catch (error) {
    console.error('注册错误：', error);
    if (error.response) {
      throw new Error(error.response.data?.message || '注册失败');
    } else if (error.request) {
      throw new Error('无法连接到服务器，请检查网络连接');
    } else {
      throw new Error(error || '注册请求出错，请稍后重试');
    }
  }
};

/**
 * 获取当前用户信息
 * @returns {Promise<{username: string, role: string}>} 用户信息
 */
export const getCurrentUser = async () => {
  // 从localStorage获取用户信息
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  
  if (username && role) {
    return { username, role };
  }
  
  throw new Error('未登录');
}; 