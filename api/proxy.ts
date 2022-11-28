import { createProxyMiddleware } from 'http-proxy-middleware';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default (req: VercelRequest, res: VercelResponse) => {
  let target = '';
  if (req.url?.startsWith('/api')) {
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
