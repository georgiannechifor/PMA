import {useRef} from 'react';
import {XIcon} from '@heroicons/react/outline';
import classname from 'classnames';
import moment from 'moment';
import {func, object} from 'prop-types';
import map from 'lodash/map';

import {useOnClickOutside} from 'utils/useOnClickOutside';

const CALENDAR_MIDDLE_DAY = 3;

const OtherEvents = ({
  selectedDay,
  eventDetails,
  setEventDetails
}) => {
  const wrapperRef = useRef();

  useOnClickOutside(wrapperRef, () => setEventDetails({
    ...eventDetails,
    visible : !eventDetails.visible
  }));

  return (
    <div
      className={classname(
        'absolute w-90 z-10 rounded shadow-2xl bg-white flex flex-col pb-4 md:min-h-full md:-top-10 md:w-200',
        {'right-0 left-auto md:right-full' : Number(moment(selectedDay).format('e')) >= CALENDAR_MIDDLE_DAY || Number(moment(selectedDay).format('e')) === 0},
        {'left-0 right-auto md:left-full' : Number(moment(selectedDay).format('e')) < CALENDAR_MIDDLE_DAY && Number(moment(selectedDay).format('e')) > 0}
      )}
      ref={wrapperRef}
    >
      <div className="w-full flex items-end justify-end px-2 py-1">
        <div
          className="hover:bg-gray-100 cursor-pointer rounded-full p-2"
          onClick={() => setEventDetails({
            ...eventDetails,
            visible : false
          })}
        >
          <XIcon className="w-5 h-5 text-gray-500 " />
        </div>
      </div>
      <div className="px-5 flex flex-col gap-y-5 max-h-56 overflow-y-auto" id="scroll-style">
        {
          map(eventDetails.details, item => (
            <div className="flex gap-x-5">
              <span className={`${item.backgroundColor || 'gray'} w-4 h-4 rounded`} />
              <div className="flex flex-col text-sm text-gray-500">
                <h1 className="-mt-2 text-xl font-medium text-gray-600 truncate"> {item.title}</h1>
                { moment(selectedDay)
                  .format('ddd DDD, MMMM YYYY')}
              </div>
            </div>
          ))
        }
      </div>
    </div>

  );
};

OtherEvents.propTypes = {
  selectedDay     : object.isRequired,
  eventDetails    : object.isRequired,
  setEventDetails : func.isRequired
};
OtherEvents.displayName = 'OtherEvents';
export default OtherEvents;
