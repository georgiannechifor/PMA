import {useRef} from 'react';
import {XIcon} from '@heroicons/react/outline';
import classname from 'classnames';
import moment from 'moment';
import {func, object} from 'prop-types';
import {useOnClickOutside} from 'utils/useOnClickOutside';

const CALENDAR_MIDDLE_DAY = 4;

// eslint-disable-next-line complexity
const EventDetails = ({
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
        'absolute w-90 z-20 rounded shadow-2xl bg-white flex flex-col md:min-h-full pb-4 md:-top-10 md:w-200',
        {'right-0 left-auto md:right-full' : Number(moment(selectedDay).format('e')) >= CALENDAR_MIDDLE_DAY || Number(moment(selectedDay).format('e')) === 0},
        {'left-0 right-auto md:left-full' : Number(moment(selectedDay).format('e')) < CALENDAR_MIDDLE_DAY && Number(moment(selectedDay).format('e')) > 0}
      )}
      ref={wrapperRef}
    >
      <div
        className="w-full flex items-end justify-end px-2 py-1"
      >
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
      <div className="px-5">
        <div className="flex gap-x-5">
          <span className={`${eventDetails.details.backgroundColor || 'gray'} w-4 h-4 rounded`} />
          <div className="flex flex-col text-gray-500">
            <h1 className="-mt-2 text-xl font-medium text-gray-600"> {eventDetails.details.title}</h1>
            <p className="text-sm"> { moment(selectedDay).format('ddd DD, MMMM YYYY') } </p>
          </div>
        </div>

        <div className="flex flex-col mt-5">
          <div className="flex text-sm items-center ">
            <p className="w-20 text-gray-400"> Author </p>
            <p className="text-gray-500">
              { `${eventDetails.details.author.firstName} - ${eventDetails.details.author.email}` }
            </p>
          </div>

          {
            eventDetails &&
            eventDetails.details.assignee && (
              <div className="flex text-sm items-center ">
                <p className="w-20 text-gray-400 "> Assignee </p>
                <p className="text-gray-500">
                  { `${eventDetails.details.assignee.firstName} - ${eventDetails.details.assignee.email}` }
                </p>
              </div>
            )
          }

          {
            eventDetails?.details?.teamAssigned.length > 0 && (
              <div className="flex items-center ">
                <p className="text-sm font-weight w-20 text-gray-400 "> Teams </p>
                <p className="text-sm text-gray-500 truancate">
                  { `${eventDetails.details.teamAssigned.map(team => team.name + ', ').toString()
                    .slice(0, -2)}` } {/* eslint-disable-line no-magic-numbers */}
                </p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

EventDetails.propTypes = {
  selectedDay     : object.isRequired,
  eventDetails    : object.isRequired,
  setEventDetails : func.isRequired
};
EventDetails.displayName = 'EventDetails';
export default EventDetails;
