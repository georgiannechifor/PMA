import {Modal, Select} from '..';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {useFetch} from 'utils/useFetch';
import * as classnames from 'classnames';
import map from 'lodash/map';
import filter from 'lodash/filter';
import {useEffect, useState} from 'react';
import {array, bool, func, object} from 'prop-types';


// eslint-disable-next-line complexity
const CreateEditTeam = ({
  visible,
  setVisible,
  selectedTeam,
  setSelectedTeam,
  mutate,
  users
}) => {
  const [selectedTeamAdmin, setSelectedTeamAdmin] = useState(null);
  const formSchema = Yup.object().shape({
    teamName : Yup.string().required('Team Name is required'),
    admin    : Yup.string().required('Team Admin is required')
  });
  const validationOptions = {resolver : yupResolver(formSchema)};

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {errors}
  } = useForm(validationOptions);

  const {
    result: {data, error},
    fetchData
  } = useFetch('teams');

  useEffect(() => {
    if (selectedTeam?._id) {
      setValue('_id', selectedTeam._id);
      setValue('teamName', selectedTeam.name);
      setValue('admin', selectedTeam.admin._id);

      setSelectedTeamAdmin({
        value : selectedTeam.admin._id,
        label : selectedTeam.admin.firstName + ' ' + selectedTeam.admin.lastName
      });
    } else {
      reset({
        teamName : '',
        admin    : ''
      });
      setSelectedTeamAdmin(null);
    }
    // eslint-disable-next-line
  }, [selectedTeam]);

  const onSubmit = formdata => {
    if (formdata._id) {
      fetchData({
        // eslint-disable-next-line no-underscore-dangle
        entityId : formdata._id,
        method   : 'PUT',
        data     : {
          name  : formdata.teamName,
          admin : formdata.admin
        }
      });
    } else {
      fetchData({
        method : 'POST',
        data   : {
          name  : formdata.teamName,
          admin : formdata.admin
        }
      });
    }
  };

  useEffect(() => {
    if (data && data.name) {
      setVisible(false);
      mutate('/teams');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Modal
      isModalOpen={visible}
      modalActions={
        <div className="flex w-full items-center justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
            onClick={() => {
              setVisible(false);
              setSelectedTeam(null);
            }}
          >
            Cancel
          </button>
          <button className="px-8 py-2 text-sm text-white font-medium bg-blue-500 rounded-lg" onClick={handleSubmit(onSubmit)}>
            Save
          </button>
        </div>
      }
      modalContent={
        <div>
          <input
            {...register('teamName')}
            className={classnames('text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none', {
              'border-1 border-red-400' : errors.teamName
            })}
            placeholder="Team Name"
            type="text"
          />
          {errors && errors.teamName && <p className="my-1 text-red-500 text-xs font-medium"> {errors.teamName.message}</p>}

          <div className="mt-5">
            <Select
              errorClassname={errors.admin ? 'border-1 border-red-400' : ''}
              options={map(
                filter(users, user => user.team?._id === selectedTeam?._id),
                user => ({
                  value : user._id,
                  label : user.firstName + ' ' + user.lastName
                })
              )}
              placeholder="Select a team admin"
              selected={selectedTeamAdmin}
              setSelected={event => {
                setSelectedTeamAdmin(event);
                setValue('admin', event.value, {
                  shouldValidate : true
                });
              }}
            />
          </div>
          {errors && errors.admin && <p className="my-1 text-red-500 text-xs font-medium"> {errors.admin?.message}</p>}

          {error && error.message && <p className="my-1 text-red-500 text-xs font-medium"> {error.message}</p>}
        </div>
      }
      modalTitle="Create Team"
      setIsModalOpen={() => null}
    />
  );
};

CreateEditTeam.displayName = 'CreateEditTeam';
CreateEditTeam.propTypes = {
  visible               : bool, // eslint-disable-line
  setVisible      : func.isRequired,
  selectedTeam    : object.isRequired,
  setSelectedTeam : func.isRequired,
  users           : array,
  mutate          : func.isRequired
};
CreateEditTeam.defaultProps = {
  users : []
};
export default CreateEditTeam;
