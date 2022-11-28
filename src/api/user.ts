import request from '@/utils/request';

export const login = (username: string, password: string) => {
  return request.post('/user/login', { username, password });
};

export const register = (username: string, password: string) => {
  return request.post('/user/register', { username, password });
};

export const getCaptchaImg = () => {
  return request.get('/user/captcha');
};

export const fetchUserInfo = () => {
  return request.get('/user/get_userinfo');
};
