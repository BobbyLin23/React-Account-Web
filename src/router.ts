import Data from './pages/Data';
import Home from './pages/Home';
import Login from './pages/Login';
import User from './pages/User';
import Detail from './pages/Detail';
import UserInfo from './pages/UserInfo';

const router = [
  {
    path: '/',
    element: Home,
  },
  {
    path: '/login',
    element: Login,
  },
  {
    path: '/data',
    element: Data,
  },
  {
    path: '/user',
    element: User,
  },
  {
    path: '/detail',
    element: Detail,
  },
  {
    path: '/userinfo',
    element: UserInfo,
  },
];

export default router;
