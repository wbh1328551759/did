import axios from 'axios';

// 环境变量配置
const getBaseURL = () => {
  const env = import.meta.env.VITE_ENV || 'development';
  
  if (env === 'production') {
    return 'https://did-api.geb.network';
  } else if (env === 'staging') {
    return 'https://did-api-pre.geb.network';
  } else {
    return 'https://did-api-pre.geb.network';
  }
};

// 创建axios实例
const httpRequest = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
httpRequest.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    console.log('Request sent:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
httpRequest.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log('Response received:', response.status, response.config.url);
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    console.error('Response error:', error);
    
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      console.error(`API Error ${status}:`, data);
      
    //   switch (status) {
    //     case 400:
    //       throw new Error(data?.message || '请求参数错误');
    //     case 401:
    //       throw new Error('未授权，请重新登录');
    //     case 403:
    //       throw new Error('禁止访问');
    //     case 404:
    //       throw new Error('请求的资源不存在');
    //     case 500:
    //       throw new Error('服务器内部错误');
    //     default:
    //       throw new Error(data?.message || `请求失败 (${status})`);
    //   }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      throw new Error('network error, please try again later');
    } else {
      // 其他错误
      throw new Error(error.message || 'unknown error');
    }
  }
);

export default httpRequest; 