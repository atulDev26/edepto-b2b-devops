import React, { useEffect, useState } from 'react'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import "bootstrap-daterangepicker/daterangepicker.css";

const DateRange = ({ onApplyClick, startDate, endDate, cssClass, onHide }) => {
  const [keys, setKeys] = useState([startDate, endDate]);

  useEffect(() => {
    setKeys([
      startDate,
      endDate
    ])
  }, [startDate, endDate])

  return (
    <>
      <div className="w-fit">
        <DateRangePicker
          initialSettings={{ startDate: startDate, endDate: endDate, parentEl: "#container", opens: 'left' }}
          onApply={(e, p) => { onApplyClick(p) }} key={keys}
          onHide={() => { setKeys([...keys, "extra-key"]) }}
        >
          <input type="text" className="form-control" />
        </DateRangePicker>
      </div>
    </>
  );
}

export default DateRange