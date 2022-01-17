import {useState} from 'react';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/outline';
import moment from 'moment';
import * as cx from 'classnames';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const HEADER_DATE_FORMAT = 'MMMM YYYY';
  const DAYS_DATE_FORMAT = 'ddd';

  const onDateClick = day => setSelectedDate(day);

  const nextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, 'M'));
  };

  const prevMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, 'M'));
  };

  const renderHeaderSection = () => (
    <div className="flex items-center justify-between w-full">
      <ChevronLeftIcon
        className="self-start cursor-pointer text-gray-500 w-6 h-6"
        onClick={() => prevMonth()}
      />
      <span className="select-none text-lg font-medium text-gray-600"> { moment(currentMonth).format(HEADER_DATE_FORMAT) }</span>
      <ChevronRightIcon
        className="self-end cursor-pointer text-gray-500 w-6 h-6"
        onClick={() => nextMonth()}
      />
    </div>
  );

  const renderDaysSection = () => {
    let startDate = moment(currentMonth).startOf('week');
    const days = [];

    for (let index = 0; index < 7; index++) { // eslint-disable-line
      const temp = moment(startDate)
        .add(index, 'days')
        .format(DAYS_DATE_FORMAT);

      days.push(
        <div className="select-none text-sm text-center font-medium py-4 w-10 h-4 text-gray-500" key={`${temp}-${index}`}>
          { temp }
        </div>
      );
    }

    return days;
  };

  const getDayContainer = (day, monthStart) => (
    <div
      className={
        cx(
          `relative
          w-8 h-8 flex
          items-center justify-center
          cursor-pointer
          rounded-full text-center text-primary-gray-50
          hover:bg-gray-100 hover:text-green-600`,
          {'text-white bg-primary-green-100 hover:bg-primary-green-100 hover:text-white' : moment(day).isSame(selectedDate, 'days')},
          {'text-gray-300' : !moment(day).isSame(monthStart, 'month')}
        )}
      key={day}
      onClick={() => {
        setCurrentMonth(day);
        onDateClick(day);
      }}
    >
      <span>{moment(day).format('D')}</span>
    </div>
  );


  const renderCellsForDays = () => { //eslint-disable-line
    const monthStart = moment(currentMonth).startOf('month');
    const monthEnd = moment(monthStart).endOf('month');
    const startDate = moment(monthStart).startOf('week');
    const endDate = moment(monthEnd).endOf('week');
    const rows = [];

    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) { // eslint-disable-line
        days.push(getDayContainer(day, monthStart));
        day = moment(day).add(1, 'days');
      }
      rows.push(
        <div className="w-full flex items-center justify-between text-center" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    if (rows.length === 6) { // eslint-disable-line no-magic-numbers
      return rows;
    }


    rows.push(
      <div className="w-full flex items-center justify-between text-center">
        <div className="relative
          w-8 h-8 flex
          items-center justify-center p-2
          rounded-full text-center text-primary-gray-50
          hover:bg-primary-gray-3 hover:text-primary-green-100"
        > &nbsp;
        </div>
      </div>
    );

    return rows;
  };

  return (
    <div className="flex flex-col w-1/2 max-w-xl items-center justify-center">
      <div className="w-full pb-3">
        { renderHeaderSection() }
      </div>

      <div className="flex items-center justify-between w-full text-center">
        {renderDaysSection()}
      </div>

      <div className="w-full flex flex-col items-center justify-between" key="dada">
        { renderCellsForDays() }
      </div>
    </div>
  );
};

Calendar.propTypes = {

};
Calendar.displayName = 'Calendar';
export default Calendar;
