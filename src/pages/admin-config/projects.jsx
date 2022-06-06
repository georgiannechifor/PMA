import {useState, useEffect, useMemo} from 'react';
import size from 'lodash/size';
import slice from 'lodash/slice';
import useSWR, {useSWRConfig} from 'swr';
import {useFetch} from 'utils/useFetch';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Table, Pagination, Modal, Loader} from 'components/index';
import {projectsColumns, PAGE_SIZE} from 'constants/index';
import {array} from 'prop-types';
import {CreateEditProject} from 'components/modals';

// eslint-disable-next-line complexity
const AdminProjects = ({
  initialProjects,
  teams
}) => {
  const [selectedProject, setSelectedProject] = useState({});
  const [visible, setVisible] = useState(false);
  const [isRemovingModalOpen, setIsRemovingModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const {data: projects} = useSWR('/projects', {
    initialData : initialProjects
  });
  const [paginatedProjects, setPaginatedProjects] = useState(initialProjects);
  const {
    result: {data, loading},
    fetchData
  } = useFetch('projects');
  const {mutate} = useSWRConfig();

  const removeProject = () => {
    fetchData({
      entityId : selectedProject._id, // eslint-disable-line no-underscore-dangle
      method   : 'DELETE'
    });
  };

  useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;

    setPaginatedProjects(slice(projects, firstPageIndex, lastPageIndex));
  }, [currentPage, projects]);

  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    if (data && data.deletedCount) {
      setIsRemovingModalOpen(false);
      mutate('/projects');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Loader isLoading={loading}>
      <div className="w-11/12 mx-auto flex flex-col">
        <section className="flex items-center justify-between">
          <h1 className="text-xl font-medium py-4"> Company Projects </h1>
          <button
            className="px-5 py-2 bg-indigo-600 rounded text-white font-medium text-md hover:bg-indigo-700 transition"
            onClick={() => {
              setSelectedProject(null);
              setVisible(true);
            }}
          > Create Project </button>
        </section>

        <Table
          columns={projectsColumns}
          data={paginatedProjects}
          isDisabled={item => item.jobTitle === 'superadmin'}
          onDeleteItem={item => {
            setSelectedProject(item);
            setIsRemovingModalOpen(true);
          }}
          onEdit={item => {
            setSelectedProject(item);
            setVisible(true);
          }}
          onRowClick={row => {
            setSelectedProject(row);
          }}
        />

        <CreateEditProject
          mutate={mutate}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          setVisible={setVisible}
          teams={teams}
          visible={visible}
        />


        <Modal
          isModalOpen={isRemovingModalOpen}
          modalActions={
            <div className="flex w-full items-center justify-end gap-2">
              <button
                className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
                onClick={() => {
                  setIsRemovingModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button className="px-8 py-2 text-sm text-white font-medium bg-red-500 rounded-lg" onClick={() => removeProject()}>
                Remove
              </button>
            </div>
          }
          modalContent={<p> Are you sure you want to remove <span className="font-semibold">{selectedProject?.name}</span> ?</p>}
          modalTitle="Remove confirmation"
          setIsModalOpen={setIsRemovingModalOpen}
        />

        <div className="w-full">
          <Pagination
            currentPage={currentPage} onPageChange={page => setCurrentPage(page)} pageSize={PAGE_SIZE}
            totalCount={size(paginatedProjects)}
          />
        </div>
      </div>
    </Loader>
  );
};

AdminProjects.getInitialProps = async ctx => {
  try {
    const {data} = await getPropsFromFetch('/projects', ctx);
    const {data: teams} = await getPropsFromFetch('/teams', ctx);

    return {
      initialProjects : data,
      teams
    };
  } catch {
    return {};
  }
};
AdminProjects.displayName = 'AdminProjects';
AdminProjects.propTypes = {
  initialProjects : array.isRequired,
  teams           : array.isRequired
};

export default AdminProjects;
