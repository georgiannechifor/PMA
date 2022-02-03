import {Fragment} from 'react';
import {Transition} from '@headlessui/react';
import {XIcon} from '@heroicons/react/outline';
import classname from 'classnames';
import moment from 'moment';
import {func, object} from 'prop-types';

const CALENDAR_MIDDLE_DAY = 3;
// eslint-disable-next-line complexity
const EventDetails = ({
  selectedDay,
  eventDetails,
  setEventDetails
}) => (
  <Transition
    as={Fragment}
    enter="transition-opacity duration-150"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="transition-opacity duration-150"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
    show={
      eventDetails &&
        eventDetails.visible &&
        eventDetails.item === selectedDay.format('DD/MM/YYYY')
    }
  >
    <div
      className={classname(
        'absolute w-90 z-10 rounded shadow-2xl bg-white flex flex-col md:min-h-full pb-4 md:-top-10 md:w-200',
        {'right-0 left-auto md:right-full' : Number(moment(selectedDay).format('e')) >= CALENDAR_MIDDLE_DAY || Number(moment(selectedDay).format('e')) === 0},
        {'left-0 right-auto md:left-full' : Number(moment(selectedDay).format('e')) < CALENDAR_MIDDLE_DAY && Number(moment(selectedDay).format('e')) > 0}
      )}
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
      <div className="px-5">
        <div className="flex gap-x-5">
          <span className={`${eventDetails.details.backgroundColor || 'gray'} w-4 h-4 rounded`} />
          <div className="flex flex-col text-gray-500">
            <h1 className="-mt-2 text-xl font-medium text-gray-600"> {eventDetails?.details?.title}</h1>
            <p className="text-sm"> { moment(selectedDay).format('ddd DDD, MMMM YYYY') } </p>
          </div>
        </div>

        <div className="flex flex-col mt-5">
          <div className="flex text-sm items-center ">
            <p className="w-20 text-gray-400"> Author </p>
            <p className="text-gray-500">
              { `${eventDetails?.details?.author?.firstName} - ${eventDetails?.details?.author.email}` }
            </p>
          </div>

          <div className="flex text-sm items-center ">
            <p className="w-20 text-gray-400 "> Assignee </p>
            <p className="text-gray-500">
              { `${eventDetails?.details?.assignee.firstName} - ${eventDetails?.details?.assignee.email}` }
            </p>
          </div>

          {
            eventDetails?.details?.teamAssigned.length > 0 && (
              <div className="flex items-center ">
                <p className="text-sm font-weight w-20 text-gray-400 "> Team </p>
                <p className="text-sm text-gray-500">
                  { `${eventDetails?.details?.teamAssigned[0]}` }
                </p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  </Transition>
);

EventDetails.propTypes = {
  selectedDay     : object.isRequired,
  eventDetails    : object.isRequired,
  setEventDetails : func.isRequired
};
EventDetails.displayName = 'EventDetails';
export default EventDetails;
