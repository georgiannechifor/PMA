import {useState, useEffect, useMemo} from 'react';
import size from 'lodash/size';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import {array} from 'prop-types';
import {useFetch} from 'utils/useFetch';
import useSWR, {useSWRConfig} from 'swr';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Modal, Table, Loader, Pagination} from 'components'; // eslint-disable-line no-unused-vars
import {eventsColumns, PAGE_SIZE} from 'constants/index';
import {CreateEditEvent} from 'components/modals';

// eslint-disable-next-line complexity, max-statements
const AdminEvents = ({initialEvents, users, teams}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [removeEventConfirmationModal, setRemoveEventConfirmationModal] = useState(false);

  const {mutate} = useSWRConfig();

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


  const removeEvent = () => {
    fetchData({
      entityId : selectedEvent._id, // eslint-disable-line no-underscore-dangle
      method   : 'DELETE'
    });
  };

  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    if (data && data.deletedCount) {
      setEventModalOpen(false);
      setRemoveEventConfirmationModal(false);

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
            setSelectedEvent(item);
            setEventModalOpen(true);
          }}
          onRowClick={item => setSelectedEvent(item)}
        />


        <CreateEditEvent
          mutate={mutate}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          setVisible={setEventModalOpen}
          teams={teams}
          users={users}
          visible={eventModalOpen}
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
