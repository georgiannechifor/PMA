import {getPropsFromFetch} from 'utils/getPropsFromFetch';

const AdminProjects = () => (
  <div>
    <section className="w-5/6 mx-auto flex items-center justify-between">
      <h1 className="text-xl font-medium py-4"> Company Projects </h1>
      <button className="px-5 py-2 bg-blue-500 rounded text-white font-medium text-md"> Create Project </button>
    </section>
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
