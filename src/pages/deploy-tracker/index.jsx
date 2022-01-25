import {getPropsFromFetch} from 'utils/getPropsFromFetch';

const DeployTracker = () => (
  <div>
    <h1>DeployTracker Title </h1>
  </div>
);


DeployTracker.getInitialProps = async ctx => {
  const {data} = await getPropsFromFetch('/events', ctx);


  return {
    events : data
  };
};

DeployTracker.displayName = 'DeployTracker';
DeployTracker.propTypes = {};

export default DeployTracker;
