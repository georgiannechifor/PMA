import {getPropsFromFetch} from 'utils/getPropsFromFetch';

const AdminProjects = () => (
  <div>
    <h1>AdminProjects Title </h1>
  </div>
);

AdminProjects.getInitialProps = async ctx => {
  try {
    const {data} = await getPropsFromFetch('/projects', ctx);

    return {
      projects : data
    };
  } catch {
    return {};
  }
};
AdminProjects.displayName = 'AdminProjects';
AdminProjects.propTypes = {};

export default AdminProjects;
