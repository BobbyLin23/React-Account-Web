import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = (req: any, res: any) => {
  let target = '';
  if (req.url.startWith('/api')) {
    target = 'https://react-account-server-production.up.railway.app/';
  }
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/api/': '/',
    },
  });
};
