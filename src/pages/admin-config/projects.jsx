import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Table} from 'components/index';

const projectsColumns = [
  {
    key   : 'firstName',
    title : 'First Name'
  }, {
    key   : 'lastName',
    title : 'Last Name'
  }, {
    key   : 'email',
    title : 'Email'
  }, {
    key   : 'team.name',
    title : 'Team Name'
  }, {
    key   : 'jobTitle',
    title : 'Position'
  }
];

const AdminProjects = () => (
  <div>
    <section className="w-5/6 mx-auto flex items-center justify-between">
      <h1 className="text-xl font-medium py-4"> Company Projects </h1>
      <button className="px-5 py-2 bg-blue-500 rounded text-white font-medium text-md"> Create Project </button>
    </section>

    <Table
      columns={projectsColumns}
      data={[]}
      isDisabled={item => item.jobTitle === 'superadmin'}
    />
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
