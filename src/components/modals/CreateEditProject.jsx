import {useEffect, useState} from 'react';
import * as classnames from 'classnames';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {useFetch} from 'utils/useFetch';
import {Modal, Select} from '..';
import {array, bool, func, object} from 'prop-types';

// eslint-disable-next-line complexity
const CreateEditProject = ({
  visible,
  setVisible,
  selectedProject,
  setSelectedProject,
  teams,
  mutate
}) => {
  const [selectedTeam, setSelectedTeam] = useState();
  const formSchema = Yup.object().shape({
    name        : Yup.string().required('Name is required'),
    deadline    : Yup.string().required('Date is required'),
    team        : Yup.string().required('Team is required'),
    description : Yup.string(),
    clientName  : Yup.string()
  });
  const validationOptions = {resolver : yupResolver(formSchema)};
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: {errors}
  } = useForm(validationOptions);
  const {
    result: {data},
    fetchData
  } = useFetch('projects');

  useEffect(() => {
    if (selectedProject?._id) {
      Object.entries(selectedProject).forEach(([name, value]) => setValue(name, value));
      setSelectedTeam({
        value : selectedProject.team._id,
        label : selectedProject.team.name
      });
      setValue('team', selectedProject.team._id, {
        shouldValidate : true
      });
    } else {
      reset({
        name        : '',
        deadline    : '',
        team        : '',
        description : '',
        clientName  : ''
      });
      setSelectedTeam(null);
    }
    // eslint-disable-next-line
  }, [selectedProject]);

  useEffect(() => {
    if (data?._id) {
      setVisible(false);
      setSelectedProject(null);
      mutate('/projects');
    }
    // eslint-disable-next-line
  }, [data]);

  const onSubmit = formData => {
    if (selectedProject?._id) {
      fetchData({
        entityId : formData._id,
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
    <Modal
      isModalOpen={visible}
      modalActions={(
        <div className="flex w-full items-center justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
            onClick={() => setVisible(false)}
          >
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
                'border-1 border-red-400' : errors.name
              })}
              placeholder="Project's name"
            />
            {errors?.name && <p className="text-red-500 text-xs font-medium"> {errors.name.message} </p>}
          </div>

          <div className="flex-1">
            <input
              {...register('clientName')}
              className={classnames('flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
                'border-1 border-red-400' : errors.clientName
              })}
              placeholder="Client's name (optional)"
            />
          </div>

          <div className="flex-1">
            <textarea
              {...register('description')}
              className={classnames('flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
                'border-1 border-red-400' : errors.description
              })}
              placeholder="Project's description (optional)"
              rows="2"
            />
          </div>

          <div className="flex-1">
            <input
              {...register('deadline')}
              className={classnames('flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
                'border-1 border-red-400' : errors.deadline
              })}
              type="date"
            />
            {errors?.deadline && <p className="text-red-500 text-xs font-medium"> {errors.deadline.message} </p>}
          </div>

          <div className="flex-1">
            <Select
              errorClassname={errors.team ? 'border-1 border-red-400' : ''}
              options={teams && teams.map(team => ({
                value : team._id, // eslint-disable-line no-underscore-dangle
                label : team.name
              })) || []}
              placeholder="Select Team"
              selected={selectedTeam}
              setSelected={event => {
                setSelectedTeam(event);
                setValue('team', event.value, {
                  shouldValidate : true
                });
              }}
            />
            {errors?.team && <p className="text-red-500 text-xs font-medium"> {errors.team.message} </p>}

          </div>
        </div>
      )}
      modalTitle="Create project"
      setIsModalOpen={() => null}
    />
  );
};

CreateEditProject.propTypes = {
  visible            : bool.isRequired,
  setVisible         : func.isRequired,
  setSelectedProject : func.isRequired,
  mutate             : func.isRequired,
  teams              : array,
  selectedProject    : object
};
CreateEditProject.defaultProps = {
  teams           : [],
  selectedProject : null
};
CreateEditProject.displayName = 'CreateEditProject';
export default CreateEditProject;
