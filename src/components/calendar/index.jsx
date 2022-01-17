import {useState} from 'react';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/outline';
import moment from 'moment';
import * as cx from 'classnames';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const HEADER_DATE_FORMAT = 'MMMM YYYY';
  const DAYS_DATE_FORMAT = 'dddd';
  const CELL_DATE_FORMAT = 'D';

  const onDateClick = day => {
    setSelectedDate(day);
  };

  const nextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, 'M'));
  };

  const prevMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, 'M'));
  };

  const renderHeaderSection = () => (
    <>
      <div className="flex items-center justify-between w-full">
        <ChevronLeftIcon
          className="self-start cursor-pointer text-gray-600 w-8 h-8 "
          onClick={() => prevMonth()}
        />
        <span className="text-lg font-medium text-gray-600"> { moment(currentMonth).format(HEADER_DATE_FORMAT) }</span>
        <ChevronRightIcon
          className="self-end cursor-pointer text-gray-600 w-8 h-8"
          onClick={() => nextMonth()}
        />
      </div>
    </>
  );

  const renderDaysSection = () => {
    let startDate = moment(currentMonth).startOf('week');
    const days = [];

    for (let index = 0; index < 7; index++) { // eslint-disable-line
      days.push(
        <div className="flex-1" key={`${currentMonth}-${index}`}>
          { moment(startDate)
            .add(index, 'days')
            .format(DAYS_DATE_FORMAT)
          }
        </div>
      );
    }

    return days;
  };

  const renderCellsForDays = () => {
    const monthStart = moment(currentMonth).startOf('month');
    const monthEnd = moment(monthStart).endOf('month');
    const startDate = moment(monthStart).startOf('week');
    const endDate = moment(monthEnd).endOf('week');
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let index = 0; index < 7; index++) { // eslint-disable-line
        formattedDate = moment(day).format(CELL_DATE_FORMAT);
        const cloneDay = moment(day);

        console.log(day, selectedDate, moment(day).isSame(selectedDate, 'day'));

        days.push(
          <div
            className={cx(
              'font-medium cursor-pointer flex-1 border h-24 flex items-start justify-end',
              {'text-red-500 font-medium text-xl' : moment(day).isSame(selectedDate, 'day')},
              {'text-gray-300' : !moment(day).isSame(monthStart, 'month')}
            )}
            key={day}
            onClick={() => onDateClick(moment(cloneDay))}
          >
            <span> { formattedDate }</span>
          </div>
        );

        day = moment(day).add(1, 'days');
      }

      rows.push(
        <div className="w-full flex items-center justify-between text-center">
          {days}
        </div>
      );
      days = [];
    }

    return rows;
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="w-full">
        { renderHeaderSection() }
      </div>

      <div className="flex items-center justify-between w-full text-center">
        {renderDaysSection()}
      </div>

      <div className="w-full flex flex-col items-center justify-between">
        { renderCellsForDays() }
      </div>
    </div>
  );
};

Calendar.propTypes = {

};
Calendar.displayName = 'Calendar';
export default Calendar;
