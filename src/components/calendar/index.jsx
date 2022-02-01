import {useState} from 'react';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/outline';
import moment from 'moment';
import map from 'lodash/map';
import * as cx from 'classnames';
import {object, func} from 'prop-types';

import OtherEvents from './OtherEvents';
import EventDetails from './EventDetails';

const Calendar = ({
  events
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [otherEventsDetails, setOtherEventsDetails] = useState({visible : false});
  const [eventDetails, setEventDetails] = useState({visible : false});

  const HEADER_DATE_FORMAT = 'MMMM YYYY';
  const DAYS_DATE_FORMAT = 'ddd';


  const nextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, 'M'));
  };

  const prevMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, 'M'));
  };

  const getDaysClass = (day, monthStart) => ({
    'bg-blue-50 font-medium'   : moment(day).isSame(new Date(), 'days'),
    'bg-gray-50 text-gray-400' : !moment(day).isSame(monthStart, 'month')
  });

  const renderHeaderSection = () => (
    <div className="flex items-center justify-between w-full">
      <div
        className="bg-gray-500 rounded-md cursor-pointer ml-2 md:p-1"
        onClick={() => prevMonth()}
      >
        <ChevronLeftIcon
          className="self-start mx-2 text-white w-6 h-6"
        />
      </div>
      <span
        className="select-none text-lg font-medium text-gray-600 md:text-xl"
        key={moment(currentMonth).format(HEADER_DATE_FORMAT)}
      >
        { moment(currentMonth).format(HEADER_DATE_FORMAT) }</span>
      <div
        className="bg-gray-500 rounded-md cursor-pointer mr-2 md:p-1"
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

    for (let index = 1; index <= 7; index++) { // eslint-disable-line
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

  const getEventsForDay = day => events[moment(day).format('DD/MM/YYYY')] || [];

  // eslint-disable-next-line complexity
  const getDayContainer = (day, monthStart) => (
    <div
      className={
        cx(
          getDaysClass(day, monthStart),
          `
          select-none
          border
          border-1
          border-gray-100
          flex-col
          p-1
          h-24
          md:h-full
          md:max-h-max
          md:relative
          `
        )}
      key={moment(day).format('DD/MM/YYYY')}
    >
      <span
        className="text-gray-500 user-select-none"
      >
        {moment(day).format('D')}
      </span>

      {
        getEventsForDay.length > 0 &&
        <div className="flex h-4/6 flex-col items-center w-full">
          {
            map(getEventsForDay(day).slice(0, 2), item => (
              <span
                className={
                  `${item?.backgroundColor || 'bg-gray-400'} 
                  px-1 py-0.5 w-full my-0.5 rounded cursor-pointer 
                  text-white bg-opacity-90  hover:bg-opacity-100 transition text-xs truncate md:text-sm md:bg-opacity-40`
                }
                key={item._id} // eslint-disable-line no-underscore-dangle
                onClick={() => {
                  setOtherEventsDetails({...otherEventsDetails,
                    visible : false});
                  setEventDetails({
                    visible : true,
                    item    : day.format('DD/MM/YYYY'),
                    details : item
                  });
                }}
              >
                { item.title }
              </span>
            ))
          }
          {
            getEventsForDay(day).length > 2 && (
              <span
                className="text-tiny text-gray-500 font-medium w-full hover:bg-gray-100 transition cursor-pointer md:py-1 md:px-1 md:text-sm"
                onClick={() => {
                  setEventDetails({...eventDetails,
                    visible : false});
                  setOtherEventsDetails({
                    visible : true,
                    item    : day.format('DD/MM/YYYY'),
                    details : getEventsForDay(day)
                  });
                }}
              >
                Other { getEventsForDay(day).length - 2 }
              </span>
            )
          }

          {
            eventDetails.visible &&
            <EventDetails
              eventDetails={eventDetails}
              selectedDay={day}
              setEventDetails={setEventDetails}
            />
          }

          {
            otherEventsDetails.visible &&
            <OtherEvents
              eventDetails={otherEventsDetails}
              selectedDay={day}
              setEventDetails={setOtherEventsDetails}
            />
          }

        </div>
      }
    </div>
  );

  const renderCellsForDays = () => { //eslint-disable-line
    const monthStart = moment(currentMonth)
      .startOf('month');
    const monthEnd = moment(monthStart).endOf('month');
    const startDate = moment(monthStart).startOf('week');
    const endDate = moment(monthEnd).endOf('week');
    const rows = [];

    let days = [];

    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) { // eslint-disable-line
        day = moment(day).add(1, 'days');
        days.push(getDayContainer(day, monthStart));
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
        <div className="select-none
          border-gray-100
          flex-col
          p-1
          h-24
          md:h-full
          md:max-h-max
          md:relative"
        > &nbsp;
        </div>
      </div>
    );

    return rows;
  };


  return (
    <div className="h-full flex flex-col items-center justify-start md:justify-center">
      <div className="w-full pb-2">
        { renderHeaderSection() }
      </div>


      <div className="grid grid-cols-7 w-full py-1 bg-gray-100">
        {renderDaysSection()}
      </div>

      <div className="w-full h-auto grid grid-cols-7 grid-rows-6 md:h-full relative">
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
