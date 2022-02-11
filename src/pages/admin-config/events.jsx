import {useState} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import flattenDeep from 'lodash/flattenDeep';
import {array} from 'prop-types';
import {useForm} from 'react-hook-form';
import {useFetch} from 'utils/useFetch';
import * as Yup from 'yup';
import classnames from 'classnames';
import moment from 'moment';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Modal, Select, Table, Loader} from 'components';

const eventsColumns = [
  {
    key   : 'title',
    title : 'Event Name'
  }, {
    key   : 'date',
    title : 'Date'
  }, {
    key   : 'startTime',
    title : 'Start Time'
  }, {
    key   : 'endTime',
    title : 'End Time'
  },
  {
    key   : 'author.firstName',
    title : 'Author'
  }, {
    key   : 'assignee.firstName',
    title : 'Assignee'
  }
];

// eslint-disable-next-line complexity
const AdminEvents = ({
  events
}) => {
  const [selectedEvent, setSelectedEvent] = useState({});
  const [eEventModalOpen, setEventModalOpen] = useState(false);

  const formSchema = Yup.object().shape({
    title     : Yup.string().required('Title is required'),
    date      : Yup.string().required('Date is required'),
    startTime : Yup.string().required('Start time is required'),
    endTime   : Yup.string().required('End time is required'),
    assignee  : Yup.string().required('Assignee is required')
  });
  const validationOptions = {resolver : yupResolver(formSchema)};
  const {register, handleSubmit, setValue, reset, formState: {errors}} = useForm(validationOptions);
  const {result: {data, loading, error}, fetchData} = useFetch('users');

  const onSubmit = formData => {
    fetchData({
      entityId : formData._id, // eslint-disable-line no-underscore-dangle
      method   : 'PUT',
      data     : {
        firstName : formData.firstName,
        lastName  : formData.lastName,
        team      : formData.teamName,
        jobTitle  : formData.admin
      }
    });
  };

  return (
    <div>
      <section className="w-5/6 mx-auto flex items-center justify-between">
        <h1 className="text-xl font-medium py-4"> Company Events </h1>
        <button className="px-5 py-2 bg-blue-500 rounded text-white font-medium text-md"> Create Event </button>
      </section>
      <Table
        columns={eventsColumns}
        data={sortBy(flattenDeep(map(events, event => flattenDeep(event))), item => item.date)}
        onRowClick={item => {
          setSelectedEvent(item);
          setEventModalOpen(true);
          Object.entries(item).forEach(([name, value]) => setValue(name, value));
          setValue('date', moment(item.date).format('DD/MM/YYYY'));
          setValue('author', item.author.firstName);
          setValue('assignee', item.assignee.firstName);
        }}
      />

      <Modal
        isModalOpen={eEventModalOpen}
        modalActions={(
          <div className="flex w-full items-center justify-end gap-2">
            <button
              className="pl-2 py-2 font-medium text-sm text-red-400 mr-auto hover:underline transition"
              onClick={() => {
                setEventModalOpen(false);
              }}
            > Delete </button>
            <button
              className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
              onClick={() => setEventModalOpen(false)}
            > Cancel </button>
            <button
              className="px-8 py-2 text-sm text-white font-medium bg-blue-500 rounded-lg"
              onClick={handleSubmit(onSubmit)}
            > Save </button>
          </div>
        )}
        modalContent={(
          <div className="flex flex-col gap-y-3">
            <div>
              <input
                className={classnames(
                  'flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none',
                  {'border-1 border-red-400' : errors.title}
                )}
                {...register('title')}
                placeholder="Title"
                type="text"
              />
              { errors?.title && <p className="-mt-2 text-red-500 text-xs font-medium"> { errors.title.message} </p>}
            </div>

            <div>
              <input
                className={classnames(
                  'flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none',
                  {'border-1 border-red-400' : errors.date}
                )}
                {...register('date')}
                placeholder="Event date"
                type="date"
              />
              { errors?.date && <p className="-mt-2 text-red-500 text-xs font-medium"> { errors.date.message} </p>}
            </div>

            <div className="flex gap-x-2 w-full">
              <div className="flex-1">
                <input
                  className={classnames(
                    'flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none',
                    {'border-1 border-red-400' : errors.startTime}
                  )}
                  {...register('startTime')}
                  placeholder="Start Time"
                  type="text"
                />
                { errors?.startTime && <p className="-mt-2 text-red-500 text-xs font-medium"> { errors.startTime.message} </p>}
              </div>

              <div className="flex-1">
                <input
                  className={classnames(
                    'flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none',
                    {'border-1 border-red-400' : errors.endTime}
                  )}
                  {...register('endTime')}
                  placeholder="End Time"
                  type="text"
                />
                { errors?.endTime && <p className="-mt-2 text-red-500 text-xs font-medium"> { errors.endTime.message} </p>}
              </div>
            </div>

            <div>
              <input
                className={classnames(
                  'flex-1 text-sm placeholder-gray-500 rounded-lg border bg-gray-100 text-gray-500 border-gray-400 w-full py-2 px-4 focus:outline-none'
                )}
                {...register('author')}
                disabled
                placeholder="Author"
                type="text"
              />
              { errors?.author && <p className="-mt-2 text-red-500 text-xs font-medium"> { errors.author.message} </p>}
            </div>

            <div>
              <input
                className={classnames(
                  'flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none',
                  {'border-1 border-red-400' : errors.assignee}
                )}
                {...register('assignee')}
                placeholder="Assignee"
                type="text"
              />
              { errors?.assignee && <p className="-mt-2 text-red-500 text-xs font-medium"> { errors.assignee.message} </p>}
            </div>
          </div>
        )}
        modalTitle="Event details"
        setIsModalOpen={() => null}
      />
    </div>
  );
};

AdminEvents.getInitialProps = async ctx => {
  try {
    const {data} = await getPropsFromFetch('/events', ctx);

    return {
      events : data
    };
  } catch {
    return {};
  }
};
AdminEvents.displayName = 'AdminEvents';
AdminEvents.propTypes = {
  events : array.isRequired
};

export default AdminEvents;
