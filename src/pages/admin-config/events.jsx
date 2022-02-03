import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import map from 'lodash/map';
import flattenDeep from 'lodash/flattenDeep';
import sortBy from 'lodash/sortBy';
import {array} from 'prop-types';
import {Table} from 'components/index';

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

const AdminEvents = ({
  events
}) => (
  <div>
    <section className="w-5/6 mx-auto flex items-center justify-between">
      <h1 className="text-xl font-medium py-4"> Company Events </h1>
      <button className="px-5 py-2 bg-blue-500 rounded text-white font-medium text-md"> Create Event </button>
    </section>
    <Table
      columns={eventsColumns}
      data={sortBy(flattenDeep(map(events, event => flattenDeep(event))), item => item.date)}
      isDisabled={item => item.jobTitle === 'superadmin'}
    />
  </div>
);

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
