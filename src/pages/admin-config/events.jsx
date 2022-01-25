import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {array} from 'prop-types';

const AdminEvents = ({
  events
}) => (
  <div>
    <h1>AdminEvents Title </h1>
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
