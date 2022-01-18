import React from 'react';
import Calendar from 'components/calendar';
import {CalendarIcon} from '@heroicons/react/outline';

const Home = () => (
  <div className="flex flex-col p-10">
    <div className="flex-1 w-1/2 self-center bg-white grid grid-rows-2">
      <div className="flex-1 w-full p-5">
        <div className="w-4/6 mx-auto">
          <Calendar />
        </div>
      </div>

      <div
        className="flex-1 flex flex-col p-10 bg-gray-600 text-white text-lg gap-5 overflow-y-auto h-80 max-h-80 box-border rounded-tr rounded-br"
        id="scroll-style"
      >
        <div className="cursor-pointer hover:bg-gray-500 p-2 transition rounded flex items-center gap-2 text-md" >
          <CalendarIcon className="w-5 h-5 text-white" />
          <div className="flex flex-col items-start">
            <p>Slate & Crystal Events</p>
            <span className="text-xs text-gray-400" > 10:00 PM - 11:00 PM </span>
          </div>
        </div>

        <div className="cursor-pointer hover:bg-gray-500 p-2 transition rounded flex items-center gap-2 text-md" >
          <CalendarIcon className="w-5 h-5 text-white" />
          <div className="flex flex-col items-start">
            <p>Buttercup Events</p>
            <span className="text-xs text-gray-400" > 11:30 PM - 13:00 PM </span>
          </div>
        </div>

        <div className="cursor-pointer hover:bg-gray-500 p-2 transition rounded flex items-center gap-2 text-md" >
          <CalendarIcon className="w-5 h-5 text-white" />
          <div className="flex flex-col items-start">
            <p>Done Right Event Designs</p>
            <span className="text-xs text-gray-400" > 15:00 PM - 16:00 PM </span>
          </div>
        </div>

        <div className="cursor-pointer hover:bg-gray-500 p-2 transition rounded flex items-center gap-2 text-md" >
          <CalendarIcon className="w-5 h-5 text-white" />
          <div className="flex flex-col items-start">
            <p>Polished Events</p>
            <span className="text-xs text-gray-400" > 17:00 PM - 18:30 PM </span>
          </div>
        </div>

        <div className="cursor-pointer hover:bg-gray-500 p-2 transition rounded flex items-center gap-2 text-md" >
          <CalendarIcon className="w-5 h-5 text-white" />
          <div className="flex flex-col items-start">
            <p>Posh Peony Events</p>
            <span className="text-xs text-gray-400" > 18:45 PM - 19:00 PM </span>
          </div>
        </div>

      </div>
    </div>
  </div>
);

Home.displayName = 'Home';
export default Home;
