import {useState, useEffect, useMemo} from 'react';
import {array} from 'prop-types';
import useSWR, {useSWRConfig} from 'swr';
import slice from 'lodash/slice';
import size from 'lodash/size';
import {Modal, Table, Loader, Pagination} from 'components';
import {deploymentColumns, PAGE_SIZE} from 'constants/index';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {useFetch} from 'utils/useFetch';
import {CreateEditDeploy} from 'components/modals';

const DeployTracker = ({
  initialData
}) => {
  const {data: deployments} = useSWR('/deployments', {
    initialData
  });
  const {mutate} = useSWRConfig();
  const {result: {data, loading}, fetchData} = useFetch('deployments');
  const {result: {data: projects}, fetchData: fetchProjects} = useFetch('projects');
  const [visible, setVisible] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedDeployments, setPaginatedDeployments] = useState(deployments);
  const [selectedDeployment, setSelectedDeployment] = useState({});

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      setRemoveModal(false);
      mutate('/deployments');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;

    const items = deployments?.map(item => ({
      ...item,
      author : {
        ...item.author,
        fullName : `${item.author.firstName} ${item.author.lastName}`
      }
    }));

    setPaginatedDeployments(slice(items, firstPageIndex, lastPageIndex));
  }, [currentPage, deployments]);

  const removeData = () => {
    fetchData({
      entityId : selectedDeployment._id,
      method   : 'DELETE'
    });
    setSelectedDeployment(null);
  };


  return (
    <Loader isLoading={loading}>
      <div className="w-11/12 mx-auto mt-5 h-full flex flex-col">
        <section className="flex items-center justify-between">
          <h1 className="text-3xl py-4"> Deployment Tracker </h1>
          <button
            className="px-5 py-2 bg-indigo-600 rounded text-white font-medium text-md hover:bg-indigo-700 transition"
            onClick={() => setVisible(true)}
          > Add Deployment
          </button>
        </section>

        <Table
          columns={deploymentColumns}
          data={paginatedDeployments || []}
          onDeleteItem={item => {
            setSelectedDeployment(item);
            setRemoveModal(true);
          }}
          onEdit={item => {
            setSelectedDeployment(item);
            setVisible(true);
          }}
          onRowClick={item => setSelectedDeployment(item)}
        />

        <CreateEditDeploy
          mutate={mutate}
          projects={projects}
          selectedDeployment={selectedDeployment}
          setSelectedDeployment={setSelectedDeployment}
          setVisible={setVisible}
          visible={visible}
        />

        <Modal
          isModalOpen={removeModal}
          modalActions={
            <div className="flex w-full items-center justify-end gap-2">
              <button
                className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
                onClick={() => {
                  setSelectedDeployment(null);
                  setRemoveModal(false);
                }}
              >
                Cancel
              </button>
              <button className="px-8 py-2 text-sm text-white font-medium bg-red-500 rounded-lg" onClick={() => removeData()}>
                Remove
              </button>
            </div>
          }
          modalContent={<p>Are you sure you want to remove <span className="font-semibold">{'  '} { selectedDeployment?.title}</span> ?</p>}
          modalTitle="Remove confirmation"
          setIsModalOpen={setRemoveModal}
        />


        <div className="w-full">
          <Pagination
            currentPage={currentPage}
            onPageChange={page => setCurrentPage(page)}
            pageSize={PAGE_SIZE}
            totalCount={size(paginatedDeployments)}
          />
        </div>
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
