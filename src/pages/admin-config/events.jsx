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
import {eventsColumns, PAGE_SIZE} from 'constants/index';

const colors = [
  'bg-gray-400',
  'bg-blue-400',
  'bg-red-400',
  'bg-green-400',
  'bg-purple-400',
  'bg-orange-400',
  'bg-lime-400',
  'bg-cyan-400',
  'bg-violet-400',
  'bg-pink-400'
];


// eslint-disable-next-line complexity, max-statements
const AdminEvents = ({initialEvents, users, teams}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [assignedType, setAssignedType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [removeEventConfirmationModal, setRemoveEventConfirmationModal] = useState(false);

  const {mutate} = useSWRConfig();
  const formSchema = Yup.object().shape({
    id              : Yup.string().nullable(),
    title           : Yup.string().required('Title is required'),
    date            : Yup.string().required('Date is required'),
    startTime       : Yup.string().required('Start time is required'),
    endTime         : Yup.string().required('End time is required'),
    backgroundColor : Yup.string().default(colors[0]),
    assignee        : Yup.array().of(Yup.string()),
    teamAssigned    : Yup.array().of(Yup.string())
  });
  const validationOptions = {resolver : yupResolver(formSchema)};
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: {errors}
  } = useForm(validationOptions);
  const {
    result: {data, loading},
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
    if (formData._id) { // eslint-disable-line no-underscore-dangle
      delete formData.author;
      fetchData({
        entityId : formData._id, // eslint-disable-line no-underscore-dangle
        method   : 'PUT',
        data     : {
          ...formData,
          assignee     : map(selectedAssignee, assignee => assignee.value) || [],
          teamAssigned : map(selectedTeam, team => team.value) || []
        }
      });
    } else {
      fetchData({
        method : 'POST',
        data   : {
          ...formData,
          assignee     : map(selectedAssignee, assignee => assignee.value) || [],
          teamAssigned : map(selectedTeam, team => team.value) || []
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
        title           : '',
        date            : '',
        startTime       : '',
        endTime         : '',
        backgroundColor : '',
        assignee        : [],
        teamAssigned    : []
      });

      mutate('/events');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Loader isLoading={loading}>
      <div className="w-11/12 mx-auto flex flex-col">
        <section className="flex items-center justify-between">
          <h1 className="text-xl font-medium py-4"> Company Events </h1>
          <button
            className="px-5 py-2 bg-indigo-600 rounded text-white font-medium text-md hover:bg-indigo-700 transition"
            onClick={() => {
              setSelectedEvent(null);
              setSelectedAssignee(null);
              setAssignedType('');
              reset({
                title           : '',
                date            : '',
                startTime       : '',
                endTime         : '',
                backgroundColor : '',
                teamAssigned    : [],
                assignee        : []
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
          onDeleteItem={item => {
            setSelectedEvent(item);
            setRemoveEventConfirmationModal(true);
          }}
          onEdit={item => {
            Object.entries(item).forEach(([name, value]) => setValue(name, value, {
              shouldValidate : true
            }));
            setValue('date', moment(item.date, 'YYYY-MM-DD').format('YYYY-MM-DD'));
            setValue('author', item.author?.firstName + ' ' + item.author?.lastName);
            setSelectedAssignee(map(item.assignee, assignee => ({
              value: assignee._id, // eslint-disable-line
              label : assignee.firstName + ' ' + assignee?.lastName
            })));
            setSelectedTeam(map(item.teamAssigned, team => ({
              value : team._id, // eslint-disable-line
              label : team.name
            })));

            setEventModalOpen(true);
          }}
          onRowClick={item => setSelectedEvent(item)}
        />

        <Modal
          isModalOpen={eventModalOpen}
          modalActions={
            <div className="flex w-full items-center justify-end gap-2">
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
                      label : time
                    }))}
                    placeholder="Start Time"
                    selected={watch('startTime') && {
                      value : watch('startTime'),
                      label : watch('startTime')
                    }}
                    setSelected={event => {
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
                      label : time
                    }))}
                    placeholder="End Time"
                    selected={watch('endTime') && {
                      value : watch('endTime'),
                      label : watch('endTime')
                    }}
                    setSelected={event => {
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
                  options={[{
                    value : 'user',
                    label : 'Users'
                  }, {
                    value : 'teams',
                    label : 'Teams'
                  }]}
                  placeholder="Select an assignation type"
                  selected={assignedType}
                  setSelected={event => {
                    setAssignedType(event);
                  }}
                />
                {
                  assignedType && (!selectedTeam || !selectedAssignee) &&
                  <p className="text-red-500 text-xs font-medium">
                    Please select an assignee or a team
                  </p>
                }

              </div>

              {
                assignedType?.value === 'user' && (
                  <div>
                    <Select
                      errorClassname={errors.assignee ? 'border-1 border-red-400' : ''}
                      multiple
                      options={map(users, user => ({
                        value: user._id, // eslint-disable-line
                        label : user.firstName + ' ' + user.lastName
                      }))}
                      placeholder="Assignee"
                      selected={!selectedAssignee || selectedAssignee.length === 0 ? null : selectedAssignee}
                      setSelected={event => {
                        setSelectedAssignee(event);
                        setValue('assignee', map(event, item => item.value), {
                          shouldValidate : true
                        });
                      }}
                    />
                    {errors?.assignee && <p className="text-red-500 text-xs font-medium"> {errors.assignee.message} </p>}
                  </div>
                )
              }
              {
                assignedType?.value === 'teams' && (
                  <div>
                    <Select
                      errorClassname={errors.teamAssigned ? 'border-1 border-red-400' : ''}
                      multiple
                      options={map(teams, team => ({
                      value: team._id, // eslint-disable-line
                        label : team.name
                      }))}
                      placeholder="Team Assigned"
                      selected={!selectedTeam || selectedTeam.length === 0 ? null : selectedTeam}
                      setSelected={event => {
                        setSelectedTeam(event);
                        setValue('team', map(event, item => item.value), {
                          shouldValidate : true
                        });
                      }}
                    />
                    {errors?.teamAssigned && <p className="text-red-500 text-xs font-medium"> {errors.teamAssigned.message} </p>}
                  </div>
                )
              }


              <div>
                <div className="flex items-center justify-between mx-5">
                  {colors.map(color => (
                    <div
                      className={classnames(`${color} rounded cursor-pointer hover:opacity-70 transition w-5 h-5`, {
                        'opacity-70 border border-2 border-gray-600' : watch('backgroundColor') === color || color.includes(watch('backgroundColor'))
                      })}
                      key={color}
                      onClick={() => setValue('backgroundColor', color)}
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
    </Loader>
  );
};

AdminEvents.getInitialProps = async ctx => {
  try {
    const {data} = await getPropsFromFetch('/events', ctx);
    const {data: users} = await getPropsFromFetch('/users', ctx);
    const {data: teams} = await getPropsFromFetch('/teams', ctx);

    return {
      initialEvents : data,
      users,
      teams
    };
  } catch {
    return {};
  }
};
AdminEvents.displayName = 'AdminEvents';
AdminEvents.propTypes = {
  initialEvents : array.isRequired,
  users         : array.isRequired,
  teams         : array.isRequired
};

export default AdminEvents;
