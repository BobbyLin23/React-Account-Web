import PopupDate from '@/components/PopupDate';
import { CalendarOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import style from './style.module.less';
import cx from 'classnames';
import CustomIcon from '@/components/CustomIcon';
import { typeMap } from '@/utils';
import { ProgressBar } from 'antd-mobile';
import { RefProps } from '../Home';
import { getBillByDate } from '@/api/bill';

let proportionChart: any = null;

export interface totalDataProps {
  number: number;
  pay_type: number;
  type_id: number;
  type_name: string;
}

function Data() {
  const [totalType, setTotalType] = useState('expense');
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenseData, setExpenseData] = useState<totalDataProps[]>([]);
  const [incomeData, setIncomeData] = useState<totalDataProps[]>([]);

  const monthRef = useRef<RefProps>();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));

  const [pieType, setPieType] = useState('expense');

  const showMonth = () => {
    monthRef.current && monthRef.current.show();
  };

  const selectMonth = (item: string) => {
    setCurrentMonth(item);
  };

  const changeTotalType = (type: string) => {
    setTotalType(type);
  };

  const getData = async () => {
    const { data } = await getBillByDate(currentMonth);
    setTotalExpense(data.total_expense);
    setTotalIncome(data.total_income);
    const expense_data = (data.total_data as totalDataProps[])
      .filter((item) => Number(item.pay_type) === 1)
      .sort((a, b) => b.number - a.number);

    const income_data = (data.total_data as totalDataProps[])
      .filter((item) => Number(item.pay_type) === 2)
      .sort((a, b) => b.number - a.number);
    setExpenseData(expense_data);
    setIncomeData(income_data);
    setPieChart(pieType === 'expense' ? expense_data : income_data);
  };

  const changePieType = (type: string) => {
    setPieType(type);
    setPieChart(type == 'expense' ? expenseData : incomeData);
  };

  useEffect(() => {
    getData();
    // return () => {
    //   proportionChart.dispose();
    // };
  }, [currentMonth]);

  const setPieChart = (data: totalDataProps[]) => {
    // if (window.echarts) {
    //   proportionChart = echarts.init(document.getElementById('proportion'));
    //   proportionChart.setOption({
    //     tooltip: {
    //       trigger: 'item',
    //       formatter: '{a} <br/>{b} : {c} ({d}%)',
    //     },
    //     // 图例
    //     legend: {
    //       data: data.map((item) => item.type_name),
    //     },
    //     series: [
    //       {
    //         name: '支出',
    //         type: 'pie',
    //         radius: '55%',
    //         data: data.map((item) => {
    //           return {
    //             value: item.number,
    //             name: item.type_name,
    //           };
    //         }),
    //         emphasis: {
    //           itemStyle: {
    //             shadowBlur: 10,
    //             shadowOffsetX: 0,
    //             shadowColor: 'rgba(0, 0, 0, 0.5)',
    //           },
    //         },
    //       },
    //     ],
    //   });
    // }
  };

  return (
    <div className={style.data}>
      <div className={style.total}>
        <div className={style.time} onClick={showMonth}>
          <span>{currentMonth}</span>
          <CalendarOutline className={style.date} />
        </div>
        <div className={style.title}>Total Expense</div>
        <div className={style.expense}>￥{totalExpense}</div>
        <div className={style.income}>Total Income ￥{totalIncome}</div>
      </div>
      <div className={style.structure}>
        <div className={style.head}>
          <span className={style.title}>收支构成</span>
          <div className={style.tab}>
            <span
              onClick={() => changeTotalType('expense')}
              className={cx({
                [style.expense]: true,
                [style.active]: totalType === 'expense',
              })}
            >
              支出
            </span>
            <span
              onClick={() => changeTotalType('income')}
              className={cx({
                [style.income]: true,
                [style.active]: totalType === 'income',
              })}
            >
              收入
            </span>
          </div>
        </div>
        <div className={style.content}>
          {(totalType === 'expense' ? expenseData : incomeData).map((item) => (
            <div key={item.type_id} className={style.item}>
              <div className={style.left}>
                <div className={style.type}>
                  <span
                    className={cx({
                      [style.expense]: totalType === 'expense',
                      [style.income]: totalType === 'income',
                    })}
                  >
                    <CustomIcon
                      type={item.type_id ? typeMap[item.type_id].icon : '1'}
                    />
                  </span>
                  <span className={style.name}>{item.type_name}</span>
                </div>
                <div className={style.progress}>
                  ￥{Number(item.number).toFixed(2) || 0}
                </div>
              </div>
              <div className={style.right}>
                <div className={style.percent}>
                  <ProgressBar
                    percent={Number(
                      Number(
                        (item.number /
                          Number(
                            totalType === 'expense' ? totalExpense : totalIncome
                          )) *
                          100
                      ).toFixed(2)
                    )}
                    text
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={style.proportion}>
          <div className={style.head}>
            <span className={style.title}>收支构成</span>
            <div className={style.tab}>
              <span
                onClick={() => changePieType('expense')}
                className={cx({
                  [style.expense]: true,
                  [style.active]: pieType == 'expense',
                })}
              >
                支出
              </span>
              <span
                onClick={() => changePieType('income')}
                className={cx({
                  [style.income]: true,
                  [style.active]: pieType == 'income',
                })}
              >
                收入
              </span>
            </div>
          </div>
          <div id="proportion"></div>
        </div>
      </div>
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    </div>
  );
}

export default Data;
