import {useState} from 'react';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/outline';
import moment from 'moment';
import map from 'lodash/map';
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
    'bg-blue-50 font-medium'   : moment(day).isSame(new Date(), 'days') && !moment(day).isSame(selectedDate, 'days'),
    'bg-green-100 font-medium' : moment(day).isSame(selectedDate, 'days'),
    'bg-gray-50 text-gray-400' : !moment(day).isSame(monthStart, 'month')
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
        <div className="uppercase text-center text-sm text-black font-medium select-none w-full " key={`${temp}-${index}`}>
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
          border
          border-1
          border-gray-100
          flex-col
          p-1`
        )}
      key={moment(day).format('DD/MM/YYYY')}
    >
      <span className="flex-1 text-gray-500 user-select-none mb-auto text-left">{moment(day).format('D')}</span>

      <div className="flex h-4/6 flex-col items-center w-full">
        {
          events[moment(day).format('DD/MM/YYYY')] &&
            map(events[moment(day).format('DD/MM/YYYY')].slice(0, 2), item => (
              <span
                className="bg-red-200 px-1 text-sm text-gray-400 w-full my-1 rounded cursor-pointer hover:text-gray-600 transition"
              >
                { item.title }
              </span>
            ))
        }
        {
          events[moment(day).format('DD/MM/YYYY')]?.length > 2 && (
            <span
              className="px-1 text-sm text-gray-500 font-medium w-full my-1 hover:bg-gray-100 transition cursor-pointer"
            >
              Other { events[moment(day).format('DD/MM/YYYY')]?.length - 2 }
            </span>
          )
        }

      </div>

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
      rows.push(days);
      days = [];
    }
    if (rows.length === 6) { // eslint-disable-line no-magic-numbers
      return rows;
    }


    rows.push(
      <div
        className="w-full "
        key="supplementary-row"
      >
        <div className="relative
          select-none
          border-1
          border-gray-100
          flex-col
          text-gray-500
          p-1
          cursor-pointer"
        > &nbsp;
        </div>
      </div>
    );

    return rows;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full pb-2">
        { renderHeaderSection() }
      </div>

      <div className="grid grid-cols-7 w-full py-1 bg-gray-100">
        {renderDaysSection()}
      </div>

      <div className="w-full h-full grid grid-cols-7 grid-rows-6 " key="dada">
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
