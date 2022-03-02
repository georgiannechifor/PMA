import {useState, useEffect, useMemo} from 'react';
import size from 'lodash/size';
import slice from 'lodash/slice';
import * as classnames from 'classnames';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import useSWR, {useSWRConfig} from 'swr';
import {useFetch} from 'utils/useFetch';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Table, Pagination, Modal, Select} from 'components/index';
import {projectsColumns, PAGE_SIZE} from 'constants/index';
import { array } from 'prop-types';

const AdminProjects = ({
  initialProjects,
  teams
}) => {
  const [selectedProject, setSelectedProject] = useState({});
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isRemovingModalOpen, setIsRemovingModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const {data: projects} = useSWR('/projects', {
    initialData: initialProjects
  });
  const [paginatedProjects, setPaginatedProjects] = useState(initialProjects);
  const {
    result: {data, loading, error},
    fetchData
  } = useFetch('projects'); // eslint-disable-line no-unused-vars
  const {mutate} = useSWRConfig();
  const formSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    deadline: Yup.string().required('Date is required'),
    team : Yup.string().required('Team is required'),
    description: Yup.string(),
    clientName: Yup.string(),
  });
  const validationOptions = {resolver: yupResolver(formSchema)};
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: {errors}
  } = useForm(validationOptions);

  const onSubmit = formData => {
    if(selectedProject._id) {
      fetchData({
        entityId: formData._id, // eslint-disable-line no-underscore-dangle
        method: 'PUT',
        data: formData
      });
    } else {
      fetchData({
        method: 'POST',
        data: formData
      });
    }
  }

  const removeProject = () => {
    fetchData({
      entityId: selectedProject._id, // eslint-disable-line no-underscore-dangle
      method: 'DELETE'
    });
  };

  useMemo(() => {
    const firstPageIndex = (currentPage -  1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    setPaginatedProjects(slice(projects, firstPageIndex, lastPageIndex));
  }, [currentPage, projects])

  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    if ((data && data._id) || (data && data.deletedCount)) {
      setIsCreateProjectModalOpen(false);
      setIsRemovingModalOpen(false);
      mutate('/projects');
    }
  }, [data]);

  return (
    <div>
      <section className="w-5/6 mx-auto flex items-center justify-between">
        <h1 className="text-xl font-medium py-4"> Company Projects </h1>
        <button
          className="px-5 py-2 bg-blue-500 rounded text-white font-medium text-md"
          onClick={() => {
            setIsCreateProjectModalOpen(true);
            setSelectedProject({});
            setSelectedTeam({});
            reset({
              name : '',
              clientName: '',
              deadline: '',
              description: ''
            });
          }}
        > Create Project </button>
      </section>

      <Table
        columns={projectsColumns}
        data={paginatedProjects}
        isDisabled={item => item.jobTitle === 'superadmin'}
        onRowClick={row => {
          setSelectedProject(row);
          Object.entries(row).forEach(([name, value]) => setValue(name, value));
          setSelectedTeam({
            value : row.team._id,
            name : row.team.name
          });
          setValue('team', row.team._id, {
            shouldValidate: true
          })
          setIsCreateProjectModalOpen(true);
        }}
      />

      <Modal
        isModalOpen={isCreateProjectModalOpen}
        modalTitle="Create project"
        setIsModalOpen={setIsCreateProjectModalOpen}
        modalActions={(
          <div className="flex w-full items-center justify-end gap-2">
            <button
              className="pl-2 py-2 font-medium text-sm text-red-400 mr-auto hover:underline transition"
              onClick={() => {
                setIsRemovingModalOpen(true);
                setIsCreateProjectModalOpen(false);
              }}
            >
              Delete
            </button>
            <button
              className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
              onClick={() => setIsCreateProjectModalOpen(false)}>
              Cancel
            </button>
            <button
              className="px-8 py-2 text-sm text-white font-medium bg-blue-500 rounded-lg"
              onClick={handleSubmit(onSubmit)}
              >
              Save
            </button>
          </div>
        )}
        modalContent={(
          <div className="flex flex-col gap-y-3">
            <div className="flex-1">
              <input
                {...register('name')}
                className={classnames('flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
                'border-1 border-red-400': errors.name
                })}
                placeholder="Project's name"
              />
              {errors?.name && <p className="text-red-500 text-xs font-medium"> {errors.name.message} </p>}
            </div>

            <div className="flex-1">
              <input
                {...register('clientName')}
                className={classnames('flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
                'border-1 border-red-400': errors.clientName
              })}
              placeholder="Client's name (optional)" />
            </div>

            <div className="flex-1">
              <textarea
                {...register('description')}
                rows="2"
                className={classnames('flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
                'border-1 border-red-400': errors.description
              })}
              placeholder="Project's description (optional)" />
            </div>

            <div className="flex-1">
              <input
                {...register('deadline')}
                type="date"
                className={classnames('flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
                'border-1 border-red-400': errors.deadline
              })} />
            {errors?.deadline && <p className="text-red-500 text-xs font-medium"> {errors.deadline.message} </p>}
            </div>

            <div className="flex-1">
              <Select
                errorClassname={errors.team ? 'border-1 border-red-400' : ''}
                selected={selectedTeam}
                setSelected={event => {
                  setSelectedTeam(event);
                  setValue('team', event.value, {
                    shouldValidate: true
                  })
                }}
                options={teams && teams.map(team => ({
                  value : team._id, // eslint-disable-line no-underscore-dangle
                  name : team.name
                })) || []}
                placeholder="Select Team"
              />
            {errors?.team && <p className="text-red-500 text-xs font-medium"> {errors.team.message} </p>}

            </div>
          </div>
        )}
      />

      <Modal
        isModalOpen={isRemovingModalOpen}
        modalActions={
          <div className="flex w-full items-center justify-end gap-2">
            <button
              className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
              onClick={() => {
                setIsRemovingModalOpen(false);
                setIsCreateProjectModalOpen(true);
              }}
            >
              Cancel
            </button>
            <button className="px-8 py-2 text-sm text-white font-medium bg-red-500 rounded-lg" onClick={() => removeProject()}>
              Remove
            </button>
          </div>
        }
        modalTitle="Remove confirmation"
        setIsModalOpen={setIsRemovingModalOpen}
        modalContent={<p> Are you sure you want to remove {selectedProject?.title} ?</p>}
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
    const {data: teams} = await getPropsFromFetch('/teams', ctx);

    return {
      initialProjects : data,
      teams    : teams
    };
  } catch {
    return {};
  }
};
AdminProjects.displayName = 'AdminProjects';
AdminProjects.propTypes = {
  initialProjects : array.isRequired,
  teams : array.isRequired
};

export default AdminProjects;
