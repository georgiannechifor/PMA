import React, {useEffect, useState} from 'react';
import {Calendar, Loader} from 'components';
import {CalendarIcon} from '@heroicons/react/outline';
import {useFetch} from 'utils/useFetch';
import moment from 'moment';
import map from 'lodash/map';

const Home = () => {
  const {result: {data, loading}, fetchData} = useFetch('/events');
  const [events, setEvents] = useState({});

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setEvents(data.data || {});
    }
  }, [data]);


  return (
    <Loader isLoading={loading}>
      <div className="flex flex-col p-10">
        <div className="flex-1 w-1/2 self-center bg-white grid grid-rows-2">
          <div className="flex-1 w-full p-5">
            <div className="w-4/6 mx-auto">
              <Calendar
                events={events}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>

          <div
            className="flex-1 flex flex-col p-10 bg-gray-600 text-white text-lg gap-5 overflow-y-auto h-80 max-h-80 box-border rounded-tr rounded-br"
            id="scroll-style"
          >
            {
              events &&
              events[moment(selectedDate).format('DD/MM/YYYY')] &&
              map(events[moment(selectedDate).format('DD/MM/YYYY')], event => (
                <div className="cursor-pointer hover:bg-gray-500 p-2 transition rounded flex items-center gap-2 text-md" >
                  <CalendarIcon className="w-5 h-5 text-white" />
                  <div className="flex flex-col items-start">
                    <p> { event.title} </p>
                    <span className="text-xs text-gray-400" > { `${event.startTime} - ${event.endTime}`} </span>
                  </div>
                </div>
              )) || <p className="text-md font-medium text-center"> No event for selected date </p>
            }
          </div>
        </div>
      </div>
    </Loader>
  );
};

Home.displayName = 'Home';
export default Home;
