import Header from '@/components/Header';
import request from '@/utils/request';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import style from './style.module.less';
import qs from 'query-string';
import cx from 'classnames';
import CustomIcon from '@/components/CustomIcon';
import dayjs from 'dayjs';
import { typeMap } from '@/utils';
import PopupAddBill from '@/components/PopupAddBill';
import { RefProps } from '../Home';

export interface detailProps {
  id: number;
  pay_type: number;
  amount: string;
  date: string;
  remark: string;
  type_id: number;
  type_name: string;
  user_id: number;
}

const Detail = () => {
  const location = useLocation();

  const { id } = qs.parse(location.search);

  const [detail, setDetail] = useState<detailProps>({
    id: 0,
    pay_type: 1,
    amount: '',
    date: '',
    remark: '',
    type_id: 1,
    type_name: '餐饮',
    user_id: 0,
  });

  const addRef = useRef<RefProps>();

  const getDetail = async () => {
    const { data } = await request.get(`/bill/detail?id=${id}`);
    setDetail(data.detail[0]);
    console.log(data.detail[0]);
  };

  const deleteDetail = () => {};

  const editDetail = () => {
    addRef.current && addRef.current.show();
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <div className={style.detail}>
      <Header title="Details" />
      <div className={style.card}>
        <div className={style.type}>
          <span
            className={cx({
              [style.expense]: detail.pay_type == 1,
              [style.income]: detail.pay_type == 2,
            })}
          >
            <CustomIcon
              className={style.iconfont}
              type={detail.type_id ? typeMap[detail.type_id].icon : ''}
            />
          </span>
          <span>{detail.type_name || ''}</span>
        </div>
        {detail.pay_type === 1 ? (
          <div className={cx(style.amount, style.expense)}>
            -{detail.amount}
          </div>
        ) : (
          <div className={cx(style.amount, style.income)}>+{detail.amount}</div>
        )}
        <div className={style.info}>
          <div className={style.time}>
            <span>Time</span>
            <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={style.remark}>
            <span>Remark</span>
            <span>{detail.remark || '-'}</span>
          </div>
        </div>
        <div className={style.operation}>
          <div onClick={deleteDetail}>
            <CustomIcon type="icon-delete" />
            Delete
          </div>
          <div onClick={editDetail}>
            <CustomIcon type="icon-add" />
            Edit
          </div>
        </div>
      </div>
      <PopupAddBill ref={addRef} detail={detail} onReload={getDetail} />
    </div>
  );
};

export default Detail;
