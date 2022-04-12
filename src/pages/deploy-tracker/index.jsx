import {useState, useEffect, useMemo} from 'react';
import {array} from 'prop-types';
import useSWR, {useSWRConfig} from 'swr';
import slice from 'lodash/slice';
import size from 'lodash/size';
import * as classnames from 'classnames';
import {Modal, Select, Table, Loader, Pagination} from 'components'; // eslint-disable-line no-unused-vars
import {deploymentColumns, PAGE_SIZE} from 'constants/index';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {useFetch} from 'utils/useFetch';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';

// eslint-disable-next-line complexity, max-statements
const DeployTracker = ({
  initialData
}) => {
  const {data: deployments} = useSWR('/deployments', {
    initialData
  });
  const {mutate} = useSWRConfig();
  const {result: {data, loading}, fetchData} = useFetch('/deployments');
  const {result: {data: projects}, fetchData: fetchProjects} = useFetch('/projects');
  const [createModal, displayCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedDeployments, setPaginatedDeployments] = useState(deployments);
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedDeployment, setSelectedDeployment] = useState({});

  // Modal form
  const formSchema = Yup.object().shape({
    title       : Yup.string().required('Title is required'),
    date        : Yup.string().required('Date is required'),
    project     : Yup.string().required('Project is required'),
    description : Yup.string()
  });
  const validationOptions = {resolver : yupResolver(formSchema)};
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: {errors}
  } = useForm(validationOptions);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!createModal) {
      setTimeout(() => {
        reset();
        setSelectedProject({});
        setSelectedDeployment({});
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModal]);

  useEffect(() => {
    if (data && data._id) {  // eslint-disable-line
      displayCreateModal(false);
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

  const onSubmit = formData => {
    if (selectedDeployment && selectedDeployment.title) {
      fetchData({
        entityId : selectedDeployment._id, // eslint-disable-line
        method   : 'PUT',
        data     : formData
      });
    } else {
      fetchData({
        method : 'POST',
        data   : formData
      });
    }
  };

  return (
    <Loader isLoading={loading}>
      <div className="w-11/12 mx-auto mt-5 h-full flex flex-col">
        <section className="flex items-center justify-between">
          <h1 className="text-3xl py-4"> Deployment Tracker </h1>
          <button
            className="px-5 py-2 bg-indigo-600 rounded text-white font-medium text-md hover:bg-indigo-700 transition"
            onClick={() => displayCreateModal(true)}
          > Add Deployment
          </button>
        </section>

        <div className="">
          <Table
            columns={deploymentColumns}
            data={paginatedDeployments}
            onRowClick={item => {
              setSelectedDeployment(item);
              Object.entries(item).forEach(([name, value]) => setValue(name, value._id ? value._id : value)); // eslint-disable-line
              setSelectedProject({
                value : item.project._id, // eslint-disable-line
                name  : item.project.name
              });

              displayCreateModal(true);
            }}
          />


        </div>

        <div className="w-full">
          <Pagination
            currentPage={currentPage}
            onPageChange={page => setCurrentPage(page)}
            pageSize={PAGE_SIZE}
            totalCount={size(paginatedDeployments)}
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
              <button
                className="px-8 py-2 text-sm text-white font-medium bg-blue-500 rounded-lg"
                onClick={handleSubmit(onSubmit)}
              > Add </button>
            </div>
          )}
          modalContent={(
            <div className="flex flex-col gap-y-3">
              <input
                {...register('title')}
                className={classnames('flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
                  'border-1 border-red-400' : errors.title
                })} placeholder="Deployment title (*)"
                type="text"
              />
              { errors.title && <p className="text-red-500 text-xs font-medium -mt-3 ml-1"> { errors.title.message} </p>}

              <input
                {...register('description')}
                className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none"
                placeholder="Deployment description"
                type="text"
              />
              <input
                {...register('date')}
                className={classnames('flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
                  'border-1 border-red-400' : errors.date
                })}
                max={new Date().toISOString()
                  .split('T')[0]}
                type="date"
              />
              { errors.date && <p className="text-red-500 text-xs font-medium -mt-3 ml-1"> { errors.date.message} </p>}


              <Select
                errorClassname={errors.project ? 'border-1 border-red-400' : ''}
                options={projects && projects.map(project => ({
                  value : project._id, // eslint-disable-line
                  name  : project.name
                }))}
                placeholder="Select project (*)"
                selected={selectedProject}
                setSelected={event => {
                  setSelectedProject(event);
                  setValue('project', event.value);
                }}
              />
              { errors.project && <p className="text-red-500 text-xs font-medium -mt-3 ml-1"> { errors.project.message} </p>}
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
