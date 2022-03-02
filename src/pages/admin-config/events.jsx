import {useState, useEffect, useMemo} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import map from 'lodash/map';
import size from 'lodash/size';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import {array} from 'prop-types';
import {useForm} from 'react-hook-form';
import {useFetch} from 'utils/useFetch';
import * as Yup from 'yup';
import useSWR, {useSWRConfig} from 'swr';
import classnames from 'classnames';
import moment from 'moment';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Modal, Select, Table, Loader, Pagination} from 'components'; // eslint-disable-line no-unused-vars
import {getTimes} from 'utils/dateTimePickerItems';
import {eventsColumns, colors, PAGE_SIZE} from 'constants/index';

// eslint-disable-next-line complexity, max-statements
const AdminEvents = ({initialEvents, users}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedEvent, setSelectedEvent] = useState(null); // eslint-disable-line no-unused-vars
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [startTime, setStartTime] = useState({});
  const [selectedAssignee, setSelectedAssignee] = useState({});
  const [endTime, setEndTime] = useState({});
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [removeEventConfirmationModal, setRemoveEventConfirmationModal] = useState(false);
  const {mutate} = useSWRConfig();
  const formSchema = Yup.object().shape({
    title     : Yup.string().required('Title is required'),
    date      : Yup.string().required('Date is required'),
    startTime : Yup.string().required('Start time is required'),
    endTime   : Yup.string().required('End time is required')
  });
  const validationOptions = {resolver : yupResolver(formSchema)};
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: {errors}
  } = useForm(validationOptions);
  const {
    result: {data},
    fetchData
  } = useFetch('events'); // eslint-disable-line no-unused-vars
  const {data: events} = useSWR('/events', {
    initialData : initialEvents
  });

  const [paginatedEvents, setPaginatedEvents] = useState(initialEvents);

  useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;

    setPaginatedEvents(slice(events, firstPageIndex, lastPageIndex));
  }, [currentPage, events]);

  const onSubmit = formData => {
    if (selectedEvent) {
      delete formData.author;
      fetchData({
        entityId : formData._id, // eslint-disable-line no-underscore-dangle
        method   : 'PUT',
        data     : {
          ...formData,
          assignee  : selectedAssignee.value,
          startTime : startTime.value,
          endTime   : endTime.value
        }
      });
    } else {
      fetchData({
        method : 'POST',
        data   : {
          ...formData,
          backgroundColor : selectedColor
        }
      });
    }
  };

  const removeEvent = () => {
    fetchData({
      entityId : selectedEvent._id, // eslint-disable-line no-underscore-dangle
      method   : 'DELETE'
    });
  };

  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    if (data && data._id || data && data.deletedCount) {
      setEventModalOpen(false);
      setRemoveEventConfirmationModal(false);
      reset({
        title     : '',
        date      : '',
        startTime : '',
        endTime   : ''
      });

      mutate('/events');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div>
      <section className="w-5/6 mx-auto flex items-center justify-between">
        <h1 className="text-xl font-medium py-4"> Company Events </h1>
        <button
          className="px-5 py-2 bg-blue-500 rounded text-white font-medium text-md"
          onClick={() => {
            setSelectedEvent(null);
            setSelectedAssignee({});
            setStartTime({});
            setEndTime({});
            reset({
              title     : '',
              date      : '',
              startTime : '',
              endTime   : '',
              assignee  : null
            });
            setEventModalOpen(true);
          }}
        >
          Create Event
        </button>
      </section>
      <Table
        columns={eventsColumns}
        data={sortBy(paginatedEvents, item => item.date)}
        onRowClick={item => {
          setSelectedColor(item.backgroundColor);
          setSelectedEvent(item);
          setEventModalOpen(true);
          Object.entries(item).forEach(([name, value]) => setValue(name, value));
          setValue('date', moment(item.date, 'YYYY-MM-DD').format('YYYY-MM-DD'));
          setValue('author', item.author.firstName + ' ' + item.author.lastName);
          setSelectedAssignee({
            value: item.assignee._id, // eslint-disable-line
            name  : item.assignee.firstName + ' ' + item.assignee.lastName
          });
          setStartTime({
            name  : item.startTime,
            value : item.startTime
          });
          setEndTime({
            name  : item.endTime,
            value : item.endTime
          });
        }}
      />

      <Modal
        isModalOpen={eventModalOpen}
        modalActions={
          <div className="flex w-full items-center justify-end gap-2">
            <button
              className="pl-2 py-2 font-medium text-sm text-red-400 mr-auto hover:underline transition"
              onClick={() => {
                setEventModalOpen(false);
                setRemoveEventConfirmationModal(true);
              }}
            >
              Delete
            </button>
            <button className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition" onClick={() => setEventModalOpen(false)}>
              Cancel
            </button>
            <button className="px-8 py-2 text-sm text-white font-medium bg-blue-500 rounded-lg" onClick={handleSubmit(onSubmit)}>
              Save
            </button>
          </div>
        }
        modalContent={
          <div className="flex flex-col gap-y-3">
            <div>
              <input
                className={classnames('flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
                  'border-1 border-red-400' : errors.title
                })}
                {...register('title')}
                placeholder="Title"
                type="text"
              />
              {errors?.title && <p className="text-red-500 text-xs font-medium"> {errors.title.message} </p>}
            </div>

            <div>
              <input
                className={classnames('flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
                  'border-1 border-red-400' : errors.date
                })}
                {...register('date')}
                placeholder="Event date"
                type="date"
              />
              {errors?.date && <p className="text-red-500 text-xs font-medium"> {errors.date.message} </p>}
            </div>

            <div className="flex gap-x-2 w-full">
              <div className="flex-1">
                <Select
                  errorClassname={errors.startTime ? 'border-1 border-red-400' : ''}
                  options={map(getTimes(), time => ({
                    value : time,
                    name  : time
                  }))}
                  placeholder="Start Time"
                  selected={startTime}
                  setSelected={event => {
                    setStartTime(event);
                    setValue('startTime', event.value, {
                      shouldValidate : true
                    });
                  }}
                />

                {errors?.startTime && <p className="text-red-500 text-xs font-medium"> {errors.startTime.message} </p>}
              </div>

              <div className="flex-1">
                <Select
                  errorClassname={errors.endTime ? 'border-1 border-red-400' : ''}
                  options={map(getTimes(), time => ({
                    value : time,
                    name  : time
                  }))}
                  placeholder="End Time"
                  selected={endTime}
                  setSelected={event => {
                    setEndTime(event);
                    setValue('endTime', event.value, {
                      shouldValidate : true
                    });
                  }}
                />
                {errors?.endTime && <p className="text-red-500 text-xs font-medium"> {errors.endTime.message} </p>}
              </div>
            </div>

            <div>
              <Select
                errorClassname={errors.endTime ? 'border-1 border-red-400' : ''}
                options={map(users, user => ({
                  value: user._id, // eslint-disable-line
                  name  : user.firstName + ' ' + user.lastName
                }))}
                placeholder="Assignee"
                selected={selectedAssignee}
                setSelected={event => {
                  setSelectedAssignee(event);
                  setValue('assignee', event.value, {
                    shouldValidate : true
                  });
                }}
              />
              {errors?.assignee && <p className="text-red-500 text-xs font-medium"> {errors.assignee.message} </p>}
            </div>
            <div>
              <div className="flex items-center justify-between mx-5">
                {colors.map(color => (
                  <div
                    className={classnames(`rounded cursor-pointer hover:opacity-70 transition ${color} w-5 h-5`, {
                      'opacity-70 border border-2 border-gray-600' : selectedColor === color || color.includes(selectedColor)
                    })}
                    key={color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
        }
        modalTitle="Event details"
        setIsModalOpen={() => null}
      />

      <Modal
        isModalOpen={removeEventConfirmationModal}
        modalActions={
          <div className="flex w-full items-center justify-end gap-2">
            <button
              className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
              onClick={() => {
                setRemoveEventConfirmationModal(false);
                setEventModalOpen(true);
              }}
            >
              Cancel
            </button>
            <button className="px-8 py-2 text-sm text-white font-medium bg-red-500 rounded-lg" onClick={() => removeEvent()}>
              Remove
            </button>
          </div>
        }
        modalContent={<p> Are you sure you want to remove {selectedEvent?.title} ?</p>}
        modalTitle="Remove confirmation"
        setIsModalOpen={setRemoveEventConfirmationModal}
      />

      <div className="w-full">
        <Pagination
          currentPage={currentPage} onPageChange={page => setCurrentPage(page)} pageSize={PAGE_SIZE}
          totalCount={size(events)}
        />
      </div>
    </div>
  );
};

AdminEvents.getInitialProps = async ctx => {
  try {
    const {data} = await getPropsFromFetch('/events', ctx);
    const {data: users} = await getPropsFromFetch('/users', ctx);

    return {
      initialEvents : data,
      users
    };
  } catch {
    return {};
  }
};
AdminEvents.displayName = 'AdminEvents';
AdminEvents.propTypes = {
  initialEvents : array.isRequired,
  users         : array.isRequired
};

export default AdminEvents;
