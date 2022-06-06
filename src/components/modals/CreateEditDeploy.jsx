import {useState, useEffect} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import * as classnames from 'classnames';

import {Modal, Select} from '..';
import {func, object, array, bool} from 'prop-types';
import {useFetch} from 'utils/useFetch';


const CreateEditDeploy = ({
  selectedDeployment,
  setSelectedDeployment,
  visible,
  setVisible,
  projects,
  mutate
}) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const {result: {data}, fetchData} = useFetch('/deployments');

  const formSchema = yup.object().shape({
    title       : yup.string().required('Title is required'),
    date        : yup.string().required('Date is required'),
    project     : yup.string().required('Project is required'),
    description : yup.string()
  });
  const validationOptions = {resolver : yupResolver(formSchema)};
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: {errors}
  } = useForm(validationOptions);

  const onSubmit = formData => {
    if (formData._id) {
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

  useEffect(() => {
    if (selectedDeployment?._id) {
      Object
        .entries(selectedDeployment)
        .forEach(([name, value]) => setValue(name, value, {
          shouldValidate : true
        }));
      setValue('project', selectedDeployment.project._id, {
        shouldValidate : true
      });
      setSelectedProject({
        value : selectedDeployment.project._id,
        label : selectedDeployment.project.name
      });
    } else {
      reset({
        title       : '',
        date        : '',
        project     : '',
        description : ''
      });
      setSelectedProject(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeployment]);

  useEffect(() => {
    if (data && data._id) {
      setVisible(false);
      setSelectedDeployment(null);
      mutate('/deployments');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Modal
      isModalOpen={visible}
      modalActions={(
        <div className="flex justify-end gap-x-4">
          <button
            className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
            onClick={() => {
              setSelectedDeployment(null);
              setVisible(false);
            }}
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
            options={projects?.map(project => ({
            value : project._id, // eslint-disable-line
              label : project.name
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
      setIsModalOpen={() => null}
    />
  );
};

CreateEditDeploy.displayName = 'CreateEditDeploy';
CreateEditDeploy.propTypes = {
  selectedDeployment    : object.isRequired,
  setSelectedDeployment : func.isRequired,
  visible               : bool, // eslint-disable-line
  setVisible            : func.isRequired,
  projects              : array,
  mutate                : func.isRequired
};

CreateEditDeploy.defaultProps = {
  visible  : false,
  projects : []
};
export default CreateEditDeploy;
