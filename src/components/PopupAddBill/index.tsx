import {
  DatePickerView,
  NumberKeyboard,
  Popup,
  TextArea,
  Toast,
} from 'antd-mobile';
import { forwardRef, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import style from './style.module.less';
import dayjs from 'dayjs';
import { CloseOutline, DownOutline } from 'antd-mobile-icons';
import request from '@/utils/request';
import CustomIcon from '../CustomIcon';
import { typeMap } from '@/utils';
import { typeListProps } from '../PopupType';

const PopupAddBill = forwardRef(
  ({ detail = {}, onReload }: { detail: any; onReload: any }, ref: any) => {
    const [show, setShow] = useState(false);
    const [dateShow, setDateShow] = useState(false);
    const [keyboard, setKeyboard] = useState(false);
    const [payType, setPayType] = useState('expense');
    const [date, setDate] = useState(new Date());

    const [amount, setAmount] = useState('');

    const [currentType, setCurrentType] = useState<typeListProps>({ id: 0 });
    const [expense, setExpense] = useState<typeListProps[]>([]);
    const [income, setIncome] = useState<typeListProps[]>([]);

    const [remark, setRemark] = useState('');
    const [showRemark, setShowRemark] = useState(false);

    const id = detail && detail.id;

    const changeType = (type: string) => {
      setPayType(type);
    };

    if (ref) {
      ref.current = {
        show: () => {
          setShow(true);
          setKeyboard(true);
        },
        close: () => {
          setShow(false);
          setKeyboard(false);
        },
      };
    }

    const addBill = async () => {
      if (!amount) {
        Toast.show({
          content: 'Please Input Amount!',
          icon: 'fail',
        });
        return;
      }
      const params: any = {
        amount: Number(amount).toFixed(2),
        type_id: currentType.id,
        type_name: currentType.name,
        date: dayjs(date).unix() * 1000,
        pay_type: payType == 'expense' ? 1 : 2,
        remark: remark || '',
      };
      if (id) {
        params.id = id;
        const result = await request.post('/bill/update', params);
        Toast.show({
          content: 'Update Success',
          icon: 'success',
        });
      } else {
        const result = await request.post('/bill/add', params);
        console.log(result);
        setAmount('');
        setPayType('expense');
        setCurrentType({ id: 0 });
        setRemark('');
        Toast.show({
          content: 'Add Success',
          icon: 'success',
        });
      }
      setShow(false);
      setKeyboard(false);
      if (onReload) onReload();
    };

    useEffect(() => {
      (async function fn() {
        const {
          data: { list },
        } = await request.get('/type/list');
        const _expense = list.filter((i: any) => i.type == 1);
        const _income = list.filter((i: any) => i.type == 2);
        setExpense(_expense);
        setIncome(_income);
        if (!id) {
          setCurrentType(_expense[0].id);
        }
      })();
    }, []);

    useEffect(() => {
      if (detail.id) {
        setPayType(detail.pay_type == 1 ? 'expense' : 'income');
        setCurrentType({
          id: detail.type_id,
          name: detail.type_name,
        });
        setRemark(detail.remark);
        setAmount(detail.amount);
        setDate(dayjs(Number(detail.date)).toDate());
      }
    }, [detail]);

    return (
      <Popup
        visible={show}
        onMaskClick={() => {
          setShow(false);
          setKeyboard(false);
        }}
        bodyStyle={{ height: '80vh' }}
      >
        <div className={style.addWrap}>
          <header className={style.header}>
            <span className={style.close} onClick={() => setShow(false)}>
              <CloseOutline />
            </span>
          </header>
          <div className={style.filter}>
            <div className={style.type}>
              <span
                onClick={() => changeType('expense')}
                className={cx({
                  [style.expense]: true,
                  [style.active]: payType == 'expense',
                })}
              >
                Expense
              </span>
              <span
                onClick={() => changeType('income')}
                className={cx({
                  [style.income]: true,
                  [style.active]: payType == 'income',
                })}
              >
                Income
              </span>
            </div>
            <div
              className={style.time}
              onClick={() => {
                setDateShow(true);
                setKeyboard(false);
              }}
            >
              {dayjs(date).format('MM-DD')}{' '}
              <DownOutline className={style.arrow} />
            </div>
          </div>
          <div className={style.money}>
            <span className={style.sufix}>￥</span>
            <span className={cx(style.amount, style.animation)}>{amount}</span>
          </div>
          <div className={style.typeWrap}>
            <div className={style.typeBody}>
              {(payType === 'expense' ? expense : income).map((item) => (
                <div
                  onClick={() => setCurrentType(item)}
                  key={item.id}
                  className={style.typeItem}
                >
                  <span
                    className={cx({
                      [style.iconfontWrap]: true,
                      [style.expense]: payType == 'expense',
                      [style.income]: payType == 'income',
                      [style.active]: currentType.id == item.id,
                    })}
                  >
                    <CustomIcon
                      type={typeMap[item.id].icon}
                      className={style.iconfont}
                    />
                  </span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={style.remark}>
            {showRemark ? (
              <TextArea
                rows={3}
                showCount={true}
                autoSize={true}
                maxLength={50}
                placeholder="Please Input Remark"
                onChange={(val) => setRemark(val)}
                onBlur={() => setShowRemark(false)}
              />
            ) : (
              <span onClick={() => setShowRemark(true)}>
                {remark || '添加备注'}
              </span>
            )}
          </div>
          <NumberKeyboard
            visible={keyboard}
            confirmText="Comfirm"
            customKey={'.'}
            showCloseButton={false}
            onInput={(key) => {
              key = String(key);
              if (key === '.' && amount.includes('.')) return;
              if (
                key !== '.' &&
                amount.includes('.') &&
                amount &&
                amount.split('.')[1].length >= 2
              )
                return;
              setAmount(amount + key);
            }}
            onDelete={() => {
              let _amount = amount.slice(0, amount.length - 1);
              setAmount(_amount);
            }}
            onClose={() => setShow(false)}
            onConfirm={() => addBill()}
          />
          <Popup
            visible={dateShow}
            onMaskClick={() => {
              setDateShow(false);
              setKeyboard(true);
            }}
          >
            <DatePickerView
              defaultValue={date}
              onChange={(val) => {
                setDate(val);
              }}
            />
          </Popup>
        </div>
      </Popup>
    );
  }
);

export default PopupAddBill;
