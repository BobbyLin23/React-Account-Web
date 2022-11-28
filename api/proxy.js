import { createProxyMiddleware } from 'http-proxy-middleware';

export default (req, res) => {
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
  })(req, res);
};
