import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {array} from 'prop-types';

const AdminEvents = ({
  events
}) => (
  <div>
    <section className="w-5/6 mx-auto flex items-center justify-between">
      <h1 className="text-xl font-medium py-4"> Company Events </h1>
      <button className="px-5 py-2 bg-blue-500 rounded text-white font-medium text-md"> Create Event </button>
    </section>
    <p> { events.length }</p>
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
