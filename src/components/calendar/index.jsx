import {useState} from 'react';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/outline';
import moment from 'moment';
import * as cx from 'classnames';
import {object, func} from 'prop-types';

const Calendar = ({
  events,
  selectedDate,
  setSelectedDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const HEADER_DATE_FORMAT = 'MMMM YYYY';
  const DAYS_DATE_FORMAT = 'ddd';

  const onDateClick = day => setSelectedDate(day);

  const nextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, 'M'));
  };

  const prevMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, 'M'));
  };

  const getDaysClass = (day, monthStart) => ({
    'text-white bg-gray-300'          : moment(day).isSame(new Date(), 'days') && !moment(day).isSame(selectedDate, 'days'),
    'text-white bg-primary-green-100' : moment(day).isSame(selectedDate, 'days'),
    'text-gray-400'                   : !moment(day).isSame(monthStart, 'month')
  });

  const renderHeaderSection = () => (
    <div className="flex items-center justify-between w-full">
      <div
        className="bg-gray-500 p-1 rounded-md cursor-pointer"
        onClick={() => prevMonth()}
      >
        <ChevronLeftIcon
          className="self-start mx-2 text-white w-6 h-6"
        />
      </div>
      <span
        className="select-none text-xl font-medium text-gray-600"
        key={moment(currentMonth).format(HEADER_DATE_FORMAT)}
      >
        { moment(currentMonth).format(HEADER_DATE_FORMAT) }</span>
      <div
        className="bg-gray-500 p-1 rounded-md cursor-pointer"
        onClick={() => nextMonth()}
      >
        <ChevronRightIcon
          className="self-end mx-2 text-white w-6 h-6"
        />
      </div>
    </div>
  );

  const renderDaysSection = () => {
    let startDate = moment(currentMonth).startOf('week');
    const days = [];

    for (let index = 1; index <=7; index++) { // eslint-disable-line
      const temp = moment(startDate)
        .add(index, 'days')
        .format(DAYS_DATE_FORMAT);

      days.push(
        <div className="uppercase select-none text-sm text-center font-medium py-4 w-10 h-4 text-gray-500 select-none" key={`${temp}-${index}`}>
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
          getDaysClass(day, monthStart),
          `relative
          select-none
          w-8 h-9 m-0.5 flex flex-col
          items-center justify-center
          cursor-pointer
          rounded
          text-center`
        )}
      key={moment(day).format('DD/MM/YYYY')}
      onClick={() => {
        setCurrentMonth(day);
        onDateClick(day);
      }}
    >
      <span className="user-select-none mb-auto">{moment(day).format('D')}</span>

      {
        events[moment(day).format('DD/MM/YYYY')] && (
          <span className={cx('h-2px w-1/2 mb-1', {
            'bg-white'   : moment(day).isSame(selectedDate, 'days'),
            'bg-red-500' : !moment(day).isSame(selectedDate, 'days')
          })}
          />
        )
      }

    </div>
  );


  const renderCellsForDays = () => { //eslint-disable-line
    const monthStart = moment(currentMonth).isoWeekday(1)
      .startOf('month');
    const monthEnd = moment(monthStart).endOf('month');
    const startDate = moment(monthStart).startOf('week');
    const endDate = moment(monthEnd).endOf('week');
    const rows = [];

    let days = [];

    let day = startDate;

    while (day <= endDate) {
      for (let i = 1; i <= 7; i++) { // eslint-disable-line
        days.push(getDayContainer(day, monthStart));
        day = moment(day).add(1, 'days');
      }
      rows.push(
        <div className="w-full flex items-center justify-between text-center" key={`${moment(day).format('DD/MM/YYYY')}-${currentMonth}`}>
          {days}
        </div>
      );
      days = [];
    }
    if (rows.length === 6) { // eslint-disable-line no-magic-numbers
      return rows;
    }


    rows.push(
      <div className="w-full flex items-center justify-between text-center" key="supplementary-row">
        <div className="relative
          w-8 h-9 m-0.5 flex flex-col
          items-center justify-center
          cursor-pointer
          rounded
          select-none
          text-center"
        > &nbsp;
        </div>
      </div>
    );

    return rows;
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="w-full pb-3">
        { renderHeaderSection() }
      </div>

      <div className="flex items-center justify-between w-full mb-3 text-center">
        {renderDaysSection()}
      </div>

      <div className="w-full flex flex-col items-center justify-between" key="dada">
        { renderCellsForDays() }
      </div>
    </div>
  );
};

Calendar.propTypes = {
  events          : object.isRequired,
  selectedDate    : object.isRequired,
  setSelectedDate : func.isRequired
};

Calendar.displayName = 'Calendar';
export default Calendar;
