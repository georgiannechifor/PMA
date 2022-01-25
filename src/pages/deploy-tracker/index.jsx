import {getPropsFromFetch} from 'utils/getPropsFromFetch';

const DeployTracker = () => (
  <div>
    <h1>DeployTracker Title </h1>
  </div>
);


DeployTracker.getInitialProps = async (ctx) => {
  const { data } = await getPropsFromFetch('http://localhost:3000/api/events', ctx);
  return {
    events : data
  }
}

DeployTracker.displayName = 'DeployTracker';
DeployTracker.propTypes = {};

export default DeployTracker;
