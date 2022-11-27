import style from './style.module.less';
import cx from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Toast } from 'antd-mobile';
import type { ToastHandler } from 'antd-mobile/es/components/toast';
import request from '@/utils/request';

function Login() {
  const handler = useRef<ToastHandler>();
  const [type, setType] = useState('login');
  const [imgUrl, setImgUrl] = useState('');

  const handleClick = async (values: any) => {
    const { username, password, captcha } = values;
    if (!username) {
      Toast.show({
        content: "Username can't be null",
        icon: 'fail',
      });
      return;
    }
    if (!password) {
      Toast.show({
        content: "Password can't be null",
        icon: 'fail',
      });
      return;
    }
    if (type === 'login') {
      const res = await request.post('/user/login', { username, password });
      localStorage.setItem('token', 'Bearer ' + res.data.token);
      window.location.href = '/';
    } else {
      if (!captcha) {
        Toast.show({
          content: "Captcha can't be null",
          icon: 'fail',
        });
        return;
      }
      if (captcha !== localStorage.getItem('res')) {
        Toast.show({
          content: 'Captcha Error',
          icon: 'fail',
        });
        getCaptcha();
        return;
      }
      request
        .post('/user/register', {
          username,
          password,
        })
        .then((res) => {
          setType('login');
          Toast.show({
            content: 'Register Success',
            icon: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        });
    }
  };

  const getCaptcha = () => {
    request
      .get('/user/captcha')
      .then((res) => {
        setImgUrl(res.data.img);
        localStorage.setItem('res', res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    document.title = type === 'login' ? 'Login' : 'Register';
    if (type === 'register') {
      getCaptcha();
    }
  }, [type]);

  return (
    <div className={style.auth}>
      <div className={style.head} />
      <div className={style.tab}>
        <span
          className={cx({ [style.active]: type === 'login' })}
          onClick={() => setType('login')}
        >
          Login
        </span>
        <span
          className={cx({ [style.active]: type === 'register' })}
          onClick={() => setType('register')}
        >
          Register
        </span>
      </div>
      <div className={style.form}>
        <Form
          mode="card"
          layout="horizontal"
          footer={
            <Button block type="submit" color="primary" size="large">
              {type === 'login' ? 'Login' : 'Register'}
            </Button>
          }
          onFinish={handleClick}
        >
          <Form.Item label="Username" name="username">
            <Input placeholder="Please Input Username" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Please Input Password" type="password" />
          </Form.Item>
          {type === 'register' ? (
            <Form.Item label="Captcha" name="captcha">
              <Input placeholder="Please Input Captcha" />
            </Form.Item>
          ) : null}
          {type === 'register' ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={imgUrl} alt="cap" onClick={() => getCaptcha()} />
            </div>
          ) : null}
        </Form>
      </div>
    </div>
  );
}

export default Login;
