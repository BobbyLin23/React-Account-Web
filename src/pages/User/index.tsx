import request from '@/utils/request';
import { List } from 'antd-mobile';
import {
  EditSOutline,
  InformationCircleOutline,
  LockOutline,
} from 'antd-mobile-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './style.module.less';

export interface UserInfoProps {
  username: string;
  id: number;
  signature: string;
  avatar: string;
}

function User() {
  const [user, setUser] = useState<UserInfoProps>({
    username: '',
    id: 0,
    signature: '',
    avatar: '',
  });

  const navigate = useNavigate();

  const getUserInfo = async () => {
    const { data } = await request.get('/user/get_userinfo');
    console.log(data.userinfo);
    setUser(data.userinfo);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className={style.user}>
      <div className={style.head}>
        <div className={style.info}>
          <span>Name: {user.username || '--'}</span>
          <span>
            <img
              src="//s.yezgea02.com/1615973630132/geqian.png"
              alt="avatar"
              style={{ width: 30, height: 30, verticalAlign: '-10px' }}
            />
            <b>{user.signature || 'None'}</b>
          </span>
        </div>
        <img
          className={style.avatar}
          style={{ width: 60, height: 60, borderRadius: 8 }}
          src={user.avatar || ''}
          alt=""
        />
      </div>
      <div className={style.content}>
        <List>
          <List.Item
            prefix={<EditSOutline />}
            onClick={() => {
              navigate('/userinfo');
            }}
          >
            Edit Userinfo
          </List.Item>
          <List.Item prefix={<LockOutline />} onClick={() => {}}>
            Reset Password
          </List.Item>
          <List.Item prefix={<InformationCircleOutline />} onClick={() => {}}>
            About Us
          </List.Item>
        </List>
      </div>
    </div>
  );
}

export default User;
