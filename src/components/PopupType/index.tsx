import { Popup } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { forwardRef, useEffect, useState } from 'react';
import style from './style.module.less';
import cx from 'classnames';
import request from '@/utils/request';

export interface typeListProps {
  id: number;
  name?: string;
  type?: string;
  user_id?: number;
}

const PopupType = forwardRef(({ onSelect }: { onSelect: any }, ref: any) => {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(0);
  const [expense, setExpense] = useState<typeListProps[]>([]);
  const [income, setIncome] = useState<typeListProps[]>([]);

  useEffect(() => {
    (async function fn() {
      const {
        data: { list },
      } = await request.get('/type/list');
      setExpense(list.filter((i: { type: number }) => i.type == 1));
      setIncome(list.filter((i: { type: number }) => i.type == 2));
    })();
  }, []);

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }

  const chooseType = (item: typeListProps) => {
    setShow(false);
    setActive(item.id);
    onSelect(item);
  };

  return (
    <Popup visible={show} onMaskClick={() => setShow(false)}>
      <div className={style.popupType}>
        <div className={style.header}>
          Please select type
          <CloseOutline
            type="wrong"
            className={style.cross}
            onClick={() => setShow(false)}
          />
        </div>
        <div className={style.content}>
          <div
            onClick={() => chooseType({ id: 0 })}
            className={cx({
              [style.all]: true,
              [style.active]: active === 0,
            })}
          >
            All Types
          </div>
          <div className={style.title}>Expense</div>
          <div className={style.expenseWrap}>
            {expense.map((item, index) => (
              <p
                key={index}
                onClick={() => chooseType(item)}
                className={cx({ [style.active]: active === item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
          <div className={style.title}>Income</div>
          <div className={style.incomeWrap}>
            {income.map((item, index) => (
              <p
                key={index}
                onClick={() => chooseType(item)}
                className={cx({ [style.active]: active === item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  );
});

export default PopupType;
