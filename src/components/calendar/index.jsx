import {useState} from 'react';
import {ChevronLeftIcon, ChevronRightIcon, XIcon} from '@heroicons/react/outline';
import moment from 'moment';
import map from 'lodash/map';
import * as cx from 'classnames';
import {object, func} from 'prop-types';

const Calendar = ({
  events
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventDetails, setEventDetails] = useState({
    visible : false
  });

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

  // eslint-disable-next-line complexity
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
      <span
        className="text-gray-500 user-select-none"
      >
        {moment(day).format('D')}
      </span>

      <div className="flex h-4/6 flex-col items-center w-full">
        {
          events[moment(day).format('DD/MM/YYYY')] &&
            map(events[moment(day).format('DD/MM/YYYY')].slice(0, 2), item => (
              <span
                className="bg-red-200 px-1 text-sm text-gray-400 w-full my-1 rounded cursor-pointer hover:text-gray-600 transition"
                key={item._id} // eslint-disable-line no-underscore-dangle
              >
                { item.title }
              </span>
            ))
        }
        {
          events[moment(day).format('DD/MM/YYYY')]?.length > 2 && (
            <span
              className="px-1 text-sm text-gray-500 font-medium w-full my-1 hover:bg-gray-100 transition cursor-pointer"
              onClick={() => setEventDetails({
                visible : true,
                item    : day.format('DD/MM/YYYY'),
                details : events[moment(day).format('DD/MM/YYYY')][0]
              })}
            >
              Other { events[moment(day).format('DD/MM/YYYY')]?.length - 2 }
            </span>
          )
        }

        {
          eventDetails &&
          eventDetails.visible &&
          eventDetails.item === day.format('DD/MM/YYYY') && (
            <div
              className={cx(
                'absolute z-50 -top-10 rounded shadow-2xl bg-white flex flex-col min-h-full pb-8',
                {'right-full' : Number(moment(day).format('e')) < 3},
                {'left-full' : Number(moment(day).format('e')) >= 3}
              )} style={{width : '200%'}}
            >
              <div className="w-full flex items-end justify-end px-2 py-1">
                <div
                  className="hover:bg-gray-100 cursor-pointer rounded-full p-2"
                  onClick={() => setEventDetails({
                    visible : false
                  })}
                >
                  <XIcon className="w-5 h-5 text-gray-500 " />
                </div>
              </div>
              <div className="px-5">
                <div className="flex gap-x-5">
                  <span className="bg-green-500 w-4 h-4 rounded" />
                  <div className="flex flex-col text-sm text-gray-500">
                    <h1 className="-mt-2 text-xl font-medium text-gray-600"> {eventDetails.details.title}</h1>
                    { moment(day)
                      .format('ddd DDD, MMMM YYYY')}
                  </div>
                </div>

                <div className="flex flex-col mt-5">
                  <div className="flex items-center ">
                    <p className="text-sm font-weight w-20 text-gray-400"> Author </p>
                    <p className="text-sm text-gray-500">
                      { `${eventDetails.details.author.firstName} - ${eventDetails.details.author.email}` }
                    </p>
                  </div>

                  <div className="flex items-center ">
                    <p className="text-sm font-weight w-20 text-gray-400 "> Assignee </p>
                    <p className="text-sm text-gray-500">
                      { `${eventDetails.details.assignee.firstName} - ${eventDetails.details.assignee.email}` }
                    </p>
                  </div>

                  {
                    eventDetails.details.teamAssigned.length > 0 && (
                      <div className="flex items-center ">
                        <p className="text-sm font-weight w-20 text-gray-400 "> Team </p>
                        <p className="text-sm text-gray-500">
                          { `${eventDetails.details.teamAssigned[0]}` }
                        </p>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          )
        }

      </div>

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
