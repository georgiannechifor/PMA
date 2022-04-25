import {useEffect, useState} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import * as classnames from 'classnames';
import {Modal, Select} from '..';
import {func, bool, array, object} from 'prop-types';
import map from 'lodash/map';
import {getTimes} from 'utils/dateTimePickerItems';
import {useFetch} from 'utils/useFetch';

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


// eslint-disable-next-line complexity
const CreateEditEvent = ({
  selectedEvent,
  setSelectedEvent,
  visible,
  setVisible,
  users,
  teams,
  mutate
}) => {
  const [assignedType, setAssignedType] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);

  const formSchema = yup.object().shape({
    id              : yup.string().nullable(),
    title           : yup.string().required('Title is required'),
    date            : yup.string().required('Date is required'),
    startTime       : yup.string().required('Start time is required'),
    endTime         : yup.string().required('End time is required'),
    backgroundColor : yup.string().default(colors[0]),
    assignee        : yup.array().of(yup.string())
      .ensure()
      .when('id', {
        is   : () => assignedType.value === 'user',
        then : yup.array().of(yup.string())
          .min(1, 'Select an assignee')
      }),
    teamAssigned : yup.array().of(yup.string())
      .ensure()
      .when('id', {
        is   : () => assignedType.value === 'team',
        then : yup.array().of(yup.string())
          .min(1, 'Select a team')
      })
  }, [['assignee', 'teamAssigned']]);

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
    result: {data},
    fetchData
  } = useFetch('events'); // eslint-disable-line no-unused-vars


  const getExtraAssignee = () => {
    if (assignedType) {
      if (assignedType.value === 'user') {
        return {
          assignee     : map(selectedAssignee, assignee => assignee.value) || [],
          teamAssigned : []
        };
      } else if (assignedType.value === 'team') {
        return {
          assignee     : [],
          teamAssigned : map(selectedTeam, team => team.value) || []
        };
      }
    }

    return {};
  };

  const onSubmit = formData => {
    if (formData._id) { // eslint-disable-line no-underscore-dangle
      delete formData.author;
      fetchData({
        entityId : formData._id, // eslint-disable-line no-underscore-dangle
        method   : 'PUT',
        data     : {
          ...formData,
          ...getExtraAssignee()
        }
      });
    } else {
      fetchData({
        method : 'POST',
        data   : {
          ...formData,
          ...getExtraAssignee()
        }
      });
    }
  };

  useEffect(() => {
    if (selectedEvent && selectedEvent._id) { // eslint-disable-line
      Object.entries(selectedEvent).forEach(([name, value]) => setValue(name, value, {
        shouldValidate : true
      }));
      if (selectedEvent?.assignee?.length > 0) {
        setAssignedType({
          value : 'user',
          label : 'Users'
        });

        const extra = map(selectedEvent.assignee, assignee => ({
          value : assignee._id, // eslint-disable-line
          label : assignee.firstName + ' ' + assignee.lastName
        }));

        setSelectedAssignee(extra);
        setSelectedTeam([]);
        setValue('assignee', extra.map(item => item.value), {
          shouldValidate : true
        });
      } else if (selectedEvent?.teamAssigned?.length) {
        setAssignedType({
          value : 'team',
          label : 'Teams'
        });

        const extra = map(selectedEvent.teamAssigned, team => ({
          value: team._id, // eslint-disable-line
          label : team.name
        }));

        setSelectedAssignee([]);
        setSelectedTeam(extra);
        setValue('teamAssigned', extra.map(item => item.value), {
          shouldValidate : true
        });
      }
    } else {
      reset({
        id              : '',
        title           : '',
        startTime       : '',
        endTime         : '',
        backgroundColor : '',
        assignee        : [],
        teamAssigned    : []
      });
      setSelectedAssignee([]);
      setSelectedTeam([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent]);

  useEffect(() => {
    if (data && data._id) { // eslint-disable-line no-underscore-dangle
      setVisible(false);
      setSelectedEvent({});
      mutate('/events');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Modal
      isModalOpen={visible}
      modalActions={
        <div className="flex w-full items-center justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
            onClick={() => {
              setVisible(false);
              setSelectedEvent({});
            }}
          >
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
                value : 'team',
                label : 'Teams'
              }]}
              placeholder="Select an assignation type"
              selected={assignedType}
              setSelected={event => {
                setAssignedType(event);
              }}
            />
            {
              !assignedType && (errors?.assignee || errors?.teamAssigned) &&
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
                {errors?.assignee && <p className="text-red-500 text-xs font-medium"> {errors.assignee.message}  </p>}
              </div>
            )
          }
          {
            assignedType?.value === 'team' && (
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
                    setValue('teamAssigned', map(event, item => item.value), {
                      shouldValidate : true
                    });
                  }}
                />
                {errors?.teamAssigned && <p className="text-red-500 text-xs font-medium"> {errors.teamAssigned.message}  </p>}

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
  );
};

CreateEditEvent.displayName = 'CreateEditEvent';
CreateEditEvent.propTypes = {
  selectedEvent    : object,
  visible          : bool.isRequired,
  teams            : array.isRequired,
  users            : array.isRequired,
  setVisible       : func.isRequired,
  mutate           : func.isRequired,
  setSelectedEvent : func.isRequired
};

CreateEditEvent.defaultProps = {
  selectedEvent : null
};

export default CreateEditEvent;
