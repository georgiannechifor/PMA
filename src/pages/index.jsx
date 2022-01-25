import {useEffect, useState} from 'react';
import {CalendarIcon} from '@heroicons/react/outline';
import map from 'lodash/map';
import moment from 'moment';
import Router from 'next/router';
import {Calendar, Loader} from 'components';
import { STATUS_UNAUTHORIZED } from 'constants/index';
import {useFetch} from 'utils/useFetch';
import { getPropsFromFetch } from 'utils/getPropsFromFetch';


const Home = ({events}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Loader isLoading={false}>
      <div className="flex flex-col p-5 lg:p-10">
        <div className="flex-1 w-full self-center bg-white grid grid-rows-2 lg:w-1/2">
          <div className="flex-1 w-full p-3 lg:px-8 lg:py-5">
            <div className="w-full lg:max-w-md lg:mx-auto">
              <Calendar
                events={events}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>

          <div
            className="flex flex-col p-10 bg-gray-600 text-white text-lg gap-5 overflow-y-auto max-h-90 box-border"
            id="scroll-style"
          >
            {
              events &&
              events[moment(selectedDate).format('DD/MM/YYYY')] &&
              map(events[moment(selectedDate).format('DD/MM/YYYY')], (event, index) => (
                <div className="cursor-pointer hover:bg-gray-500 p-2 transition rounded flex items-center gap-2 text-md" key={index.toString()} >
                  <CalendarIcon className="w-5 h-5 text-white" />
                  <div className="flex flex-col items-start">
                    <p> { event.title} </p>
                    <span className="text-xs text-gray-400" > { `${event.startTime} - ${event.endTime}`} </span>
                  </div>
                </div>
              )) || <p className="text-md font-medium text-center select-none"> No event for selected date </p>
            }
          </div>
        </div>
      </div>
    </Loader>
  );
};

Home.getInitialProps = async (ctx) => {
  const { data } = await getPropsFromFetch('http://localhost:3000/api/events', ctx);
  return {
    events : data
  }
}

Home.displayName = 'Home';
export default Home;
