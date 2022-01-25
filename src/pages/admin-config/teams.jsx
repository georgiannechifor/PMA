import {getPropsFromFetch} from 'utils/getPropsFromFetch';

const AdminTeams = () => (
  <div>
    <h1>Admin Teams Title </h1>
  </div>
);

AdminTeams.getInitialProps = async ctx => {
  try {
    const {data} = await getPropsFromFetch('/teams', ctx);

    return {
      teams : data
    };
  } catch {
    return {};
  }
};

AdminTeams.displayName = 'AdminTeams';
AdminTeams.propTypes = {};

export default AdminTeams;
