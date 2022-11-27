import Header from '@/components/Header';
import request from '@/utils/request';
import {
  Button,
  ImageUploader,
  ImageUploadItem,
  Input,
  Toast,
} from 'antd-mobile';
import { useState } from 'react';
import style from './style.module.less';

const UserInfo = () => {
  const token = localStorage.getItem('token');
  const [avatar, setAvatar] = useState('');

  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

  const upload = async (file: File): Promise<ImageUploadItem> => {
    console.log(file);

    if (file && file.size > 200 * 1024) {
      Toast.show({
        content: '1',
        icon: 'fail',
      });
      return { url: '' };
    }
    let formData = new FormData();
    formData.append('file', file);
    request({
      method: 'post',
      url: '/upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
    }).then((res) => {
      console.log(res);
    });
    //console.log(URL.createObjectURL(file));
    return {
      url: URL.createObjectURL(file),
    };
  };

  return (
    <>
      <Header title="Userinfo" />
      <div className={style.userinfo}>
        <h1>User Info</h1>
        <div className={style.item}>
          <div className={style.title}>Avatar</div>
          <div className={style.avatar}>
            <img src={avatar} alt="" className={style.avatarUrl} />
            <div className={style.desc}>
              <span>Support .jpg, .png and .jpeg within 200KB</span>
              <ImageUploader
                className={style.filePicker}
                upload={upload}
                onChange={setFileList}
              >
                <Button className={style.upload} color="primary">
                  Upload
                </Button>
              </ImageUploader>
            </div>
          </div>
        </div>
        <div className={style.item}>
          <div className={style.title}>Signature</div>
          <div className={style.signature}>
            <Input placeholder="please input signature" />
          </div>
        </div>
        <Button color="primary" block>
          Save
        </Button>
      </div>
    </>
  );
};

export default UserInfo;
