import {useState, useEffect, useMemo} from 'react';
import {array} from 'prop-types';
import useSWR from 'swr';
import slice from 'lodash/slice';
import size from 'lodash/size';
import {Modal, Select, Table, Loader, Pagination} from 'components'; // eslint-disable-line no-unused-vars
import {deploymentColumns, PAGE_SIZE} from 'constants/index';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {useFetch} from 'utils/useFetch';

const DeployTracker = ({
  initialData
}) => {
  const {data: deployments} = useSWR('/deployments', {
    initialData
  });
  const {result: {data, loading, error}, fetchData} = useFetch('/deployments');
  const {result: {data: projects}, fetchData: fetchProjects} = useFetch('/projects');
  const [createModal, displayCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedUsers, setPaginatedUsers] = useState(deployments);
  const [selectedProject, setSelectedProject] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;

    setPaginatedUsers(slice(deployments, firstPageIndex, lastPageIndex));
  }, [currentPage, deployments]);

  return (
    <Loader isLoading={loading} >
      <div className="w-10/12 mx-auto">
        <section className="w-5/6 mx-auto flex items-center justify-between">
          <h1 className="text-3xl py-4"> Deployment Tracker </h1>
          <button
            className="px-5 py-2 bg-blue-500 rounded text-white font-medium text-md hover:bg-blue-600 transition"
            onClick={() => displayCreateModal(true)}
          > Add Deployment
          </button>
        </section>

        <Table
          columns={deploymentColumns}
          data={deployments}
        />


        <div className="w-full">
          <Pagination
            currentPage={currentPage} onPageChange={page => setCurrentPage(page)} pageSize={PAGE_SIZE}
            totalCount={size(paginatedUsers)}
          />
        </div>

        <Modal
          isModalOpen={createModal}
          modalActions={(
            <div className="flex justify-end gap-x-4">
              <button
                className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
                onClick={() => displayCreateModal(false)}
              > Cancel </button>
              <button className="px-8 py-2 text-sm text-white font-medium bg-blue-500 rounded-lg"> Add </button>
            </div>
          )}
          modalContent={(
            <div className="flex flex-col gap-y-3">
              <input
                className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none"
                placeholder="Deployment title"
                type="text"
              />
              <input
                className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none"
                placeholder="Deployment description"
                type="text"
              />
              <input
                className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none"
                type="date"
              />

              <Select
                options={projects && projects.map(project => ({
                  value : project._id, // eslint-disable-line
                  name  : project.name
                }))}
                placeholder="Select project"
                selected={selectedProject}
                setSelected={setSelectedProject}
              />
            </div>
          )}
          modalTitle="Add deployment info"
          setIsModalOpen={displayCreateModal}
        />
      </div>


    </Loader>
  );
};


DeployTracker.getInitialProps = async ctx => {
  const {data} = await getPropsFromFetch('/deployments', ctx);


  return {
    initialData : data
  };
};

DeployTracker.displayName = 'DeployTracker';
DeployTracker.propTypes = {
  initialData : array.isRequired
};

export default DeployTracker;
