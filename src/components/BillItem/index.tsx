import { typeMap } from '@/utils';
import { Card } from 'antd-mobile';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomIcon from '../CustomIcon';
import style from './style.module.less';
import dayjs from 'dayjs';
import { listProps } from '@/pages/Home';

const BillItem = ({ bill }: { bill: listProps }) => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const navigate = useNavigate();

  const goToDetail = (item: any) => {
    navigate(`/detail?id=${item.id}`);
  };

  useEffect(() => {
    const _income = bill.bills
      .filter((i) => i.pay_type == 2)
      .reduce((curr, item) => {
        curr += Number(item.amount);
        return curr;
      }, 0);
    setIncome(_income);
    const _expense = bill.bills
      .filter((i) => i.pay_type == 1)
      .reduce((curr, item) => {
        curr += Number(item.amount);
        return curr;
      }, 0);
    setExpense(_expense);
  }, [bill.bills]);

  return (
    <div className={style.item}>
      <div className={style.headerDate}>
        <div className={style.date}>{bill.date}</div>
        <div className={style.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt="支" />
            <span>¥{expense.toFixed(2)}</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>¥{income.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {bill &&
        bill.bills.map((item, index) => (
          <Card
            bodyStyle={{ marginBottom: '10px' }}
            key={index}
            onClick={() => goToDetail(item)}
            title={
              <>
                <CustomIcon
                  iconName={item.type_id ? typeMap[item.type_id].icon : 'food'}
                />
                <span>{item.type_name}</span>
              </>
            }
          >
            <div className={style.bill}>
              <div>
                {dayjs(Number(item.date)).format('HH:mm')}{' '}
                {item.remark ? `| ${item.remark}` : ''}
              </div>
              <span
                style={{ color: item.pay_type == 2 ? 'red' : '#39be77' }}
              >{`${item.pay_type === 1 ? '-' : '+'}${item.amount}`}</span>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default BillItem;
