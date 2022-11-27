import { DatePickerView, Popup } from 'antd-mobile';
import dayjs from 'dayjs';
import { forwardRef, useState } from 'react';

const PopupDate = forwardRef(
  ({ onSelect, mode = 'date' }: { onSelect: any; mode: string }, ref: any) => {
    const [show, setShow] = useState(false);
    const [now, setNow] = useState(new Date());

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

    return (
      <Popup visible={show} onMaskClick={() => setShow(false)}>
        <div>
          <DatePickerView
            precision="month"
            defaultValue={now}
            onChange={(val) => {
              setNow(val);
              onSelect(dayjs(val).format('YYYY-MM'));
            }}
          />
        </div>
      </Popup>
    );
  }
);

export default PopupDate;
