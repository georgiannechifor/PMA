import {useState} from 'react';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/outline';
import moment from 'moment';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import classNames from 'classnames';
import {Transition} from '@headlessui/react';
import {object, func, array} from 'prop-types';
import OtherEvents from './OtherEvents';
import EventDetails from './EventDetails';

const Calendar = ({
  events
}) => {
  const groupedEvents = groupBy(map(events, item => ({
    ...item,
    date : moment(item.date).format('DD/MM/YYYY')
  })), event => event.date);

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
        <div className="uppercase text-left text-sm text-black font-medium select-none table-cell" key={`${temp}-${index}`}>
          { temp }
        </div>
      );
    }

    return days;
  };

  const getEventsForDay = day => groupedEvents[moment(day).format('DD/MM/YYYY')] || [];

  // eslint-disable-next-line complexity
  const getDayContainer = (day, monthStart) => (
    <div
      className={
        classNames(
          getDaysClass(day, monthStart),
          'table-cell border-b border-r first:border-l h-1/6 relative'
        )
      }
      key={moment(day).format('DD/MM/YYYY')}
    >
      <span className="text-gray-500 user-select-none">
        {moment(day).format('D')}
      </span>

      {
        getEventsForDay.length > 0 &&
        <div className="w-full flex flex-col px-1">
          {
            map(getEventsForDay(day).slice(0, 2), item => (
              <span
                className={
                  `${item.backgroundColor || 'gray'} transition px-1 py-0.5 my-0.5 rounded
                   w-full bg-opacity-90 hover:bg-opacity-100
                   cursor-pointer text-white text-xs truncate
                   md:text-sm md:bg-opacity-40`}
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

          <Transition
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            show={
              eventDetails?.visible &&
              eventDetails?.item === day.format('DD/MM/YYYY')
            }
          >
            <EventDetails
              eventDetails={eventDetails}
              selectedDay={day}
              setEventDetails={setEventDetails}
            />
          </Transition>

          <Transition
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            show={
              otherEventsDetails?.visible &&
              otherEventsDetails?.item === day.format('DD/MM/YYYY')
            }
          >
            <OtherEvents
              eventDetails={otherEventsDetails}
              selectedDay={day}
              setEventDetails={setOtherEventsDetails}
            />
          </Transition>

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
      const row = (
        <div className="table-row w-full select-none align-top" key={day.format('DD/MM/yyyy')}>
          {days}
        </div>
      );

      rows.push(row);
      days = [];
    }

    if (rows.length === 6) { // eslint-disable-line no-magic-numbers
      return rows;
    }


    for (let i = 0; i < 7; i++) { // eslint-disable-line
      day = moment(day).add(1, 'days');
      days.push(getDayContainer(day, monthStart));
    }
    const row = (
      <div className="table-row w-full select-none align-top">
        {days}
      </div>
    );

    rows.push(row);

    return rows;
  };

  return (
    <div className="h-full flex flex-col items-center justify-start md:justify-center">
      <div className="w-full pb-2">
        { renderHeaderSection() }
      </div>


      <div className="table table-fixed w-full h-full">
        <div className="table-row table-fixed w-full bg-gray-100">
          {renderDaysSection()}
        </div>

        { renderCellsForDays() }

        <div className="table-row table-fixed md:h-full relative" />

      </div>
    </div>
  );
};

Calendar.propTypes = {
  events          : array,
  selectedDate    : object.isRequired,
  setSelectedDate : func.isRequired
};

Calendar.defaultProps = {
  events : []
};
Calendar.displayName = 'Calendar';
export default Calendar;
