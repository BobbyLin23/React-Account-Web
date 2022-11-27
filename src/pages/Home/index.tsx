import style from './style.module.less';
import { AddOutline, DownOutline } from 'antd-mobile-icons';
import { useEffect, useRef, useState } from 'react';
import BillItem from '@/components/BillItem';
import { InfiniteScroll } from 'antd-mobile';
import request from '@/utils/request';
import dayjs from 'dayjs';
import PopupType, { typeListProps } from '@/components/PopupType';
import PopupDate from '@/components/PopupDate';
import PopupAddBill from '@/components/PopupAddBill';

export interface billProps {
  amount: string;
  date: string;
  id: number;
  pay_type: number;
  remark: string;
  type_id: number;
  type_name: string;
}

export interface listProps {
  bills: billProps[];
  date: string;
}

export interface RefProps {
  show: () => void;
  close: () => void;
}

function Home() {
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const [list, setList] = useState<listProps[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'));
  const [currentSelect, setCurrentSelect] = useState<typeListProps>({ id: 0 });

  const typeRef = useRef<RefProps>();
  const monthRef = useRef<RefProps>();
  const addRef = useRef<RefProps>();

  const toggle = () => {
    typeRef.current && typeRef.current.show();
  };

  const toggleMonth = () => {
    monthRef.current && monthRef.current.show();
  };

  const select = (item: typeListProps) => {
    setPage(1);
    setCurrentSelect(item);
  };

  const selectMonth = (item: string) => {
    setPage(1);
    setCurrentTime(item);
    getBillList();
  };

  const getBillList = async () => {
    const { data } = await request.get(
      `/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${
        currentSelect.id || 0
      }`
    );
    if (!data) return;
    if (page === 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalPage(data.totalPage);
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
  };

  const loadMore = async () => {
    if (page !== 1) {
      setPage(1);
    } else {
      getBillList();
    }
  };

  const addBill = () => {
    addRef.current && addRef.current.show();
  };

  useEffect(() => {
    getBillList();
  }, [page, currentSelect, currentTime]);

  return (
    <div className={style.home}>
      <div className={style.header}>
        <div className={style.dataWrap}>
          <span className={style.expense}>
            Expense: <b>{totalExpense}</b>
          </span>
          <span className={style.income}>
            Income: <b>{totalIncome}</b>
          </span>
        </div>
        <div className={style.typeWrap}>
          <div className={style.left} onClick={toggle}>
            <span className={style.title}>
              {currentSelect.name ? currentSelect.name : 'Type'}
              <DownOutline />
            </span>
          </div>
          <div className={style.right}>
            <span className={style.time} onClick={toggleMonth}>
              {currentTime} <DownOutline />
            </span>
          </div>
        </div>
      </div>
      <div className={style.contentWrap}>
        {list.length ? (
          <>
            {list.map((item, index) => (
              <BillItem bill={item} key={index} />
            ))}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
          </>
        ) : null}
      </div>
      <PopupType onSelect={select} ref={typeRef} />
      <PopupDate onSelect={selectMonth} ref={monthRef} mode="month" />
      <PopupAddBill ref={addRef} onReload={loadMore} detail={undefined} />
      <div className={style.add} onClick={addBill}>
        <AddOutline />
      </div>
    </div>
  );
}

export default Home;
