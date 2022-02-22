import {useState, useMemo} from 'react';
import size from 'lodash/size';
import slice from 'lodash/slice';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Table, Pagination} from 'components/index';
import { projectsColumns, PAGE_SIZE} from 'constants/index';

const AdminProjects = ({
  projects
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedProjects, setPaginatedProjects] = useState(projects);

  useMemo(() => {
    const firstPageIndex = (currentPage -  1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    setPaginatedProjects(slice(projects, firstPageIndex, lastPageIndex));
  }, [currentPage, projects])

  return (
    <div>
      <section className="w-5/6 mx-auto flex items-center justify-between">
        <h1 className="text-xl font-medium py-4"> Company Projects </h1>
        <button className="px-5 py-2 bg-blue-500 rounded text-white font-medium text-md"> Create Project </button>
      </section>

      <Table
        columns={projectsColumns}
        data={paginatedProjects}
        isDisabled={item => item.jobTitle === 'superadmin'}
      />

      <div className="w-full">
        <Pagination currentPage={currentPage} onPageChange={page => setCurrentPage(page)} totalCount={size(paginatedProjects)} pageSize={PAGE_SIZE} />
      </div>
    </div>
  )
}

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
