import axios from 'axios';
import { Toast } from 'antd-mobile';

const request = axios.create({
  baseURL: '/api',
  timeout: 3000,
});

request.defaults.withCredentials = true;
request.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
request.defaults.headers['Authorization'] = `${
  localStorage.getItem('token') || null
}`;

request.interceptors.response.use((res) => {
  if (typeof res.data !== 'object') {
    return Promise.reject(res);
  }
  if (res.data.code !== 200) {
    if (res.data.msg)
      Toast.show({
        content: res.data.msg,
        icon: 'fail',
      });
    if (res.data.code === 401) {
      window.location.href = '/login';
    }

    return Promise.reject(res.data);
  }
  return res.data;
});

export default request;
