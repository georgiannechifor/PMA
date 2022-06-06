import {useEffect, useState} from 'react';
import * as classnames from 'classnames';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import map from 'lodash/map';
import filter from 'lodash/filter';

import {useFetch} from 'utils/useFetch';
import {Modal, Select} from '..';
import {array, bool, func, object} from 'prop-types';
import {USER_ROLES} from 'constants/userRoles';

// eslint-disable-next-line complexity
const CreateEditUser = ({
  visible,
  setVisible,
  selectedUser,
  setSelectedUser,
  teams,
  mutate
}) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState({});

  const formSchema = Yup.object().shape({
    firstName : Yup.string().required('First name is required'),
    lastName  : Yup.string().required('Last name is required'),
    teamName  : Yup.string().required('Team Name is required'),
    email     : Yup.string().required('Email is required'),
    admin     : Yup.string().required('Team Admin is required')
  });
  const validationOptions = {resolver : yupResolver(formSchema)};
  const {register, handleSubmit, setValue, reset, formState: {errors}} = useForm(validationOptions);
  const {result: {data, error}, fetchData} = useFetch('users');

  useEffect(() => {
    if (selectedUser?._id) {
      Object.entries(selectedUser).forEach(([name, value]) => setValue(name, value, {
        shouldValidate : true
      }));
      setValue('admin', selectedUser.jobTitle);
      // eslint-disable-next-line no-underscore-dangle
      setValue('teamName', selectedUser.team?._id);
      setSelectedUserRole({
        value : selectedUser.jobTitle,
        label : selectedUser.jobTitle
      });
      setSelectedTeam({
        // eslint-disable-next-line no-underscore-dangle
        value : selectedUser.team?._id,
        label : selectedUser.team?.name
      });
    } else {
      reset({
        firstName : '',
        lastName  : '',
        teamName  : '',
        email     : '',
        admin     : ''
      });
      setSelectedTeam(null);
      setSelectedUserRole(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  useEffect(() => {
    if (data) {
      setVisible(false);
      setSelectedUser(null);
      mutate('/users');
    }
    // eslint-disable-next-line
  }, [data]);

  const onSubmit = formData => {
    fetchData({
      entityId : formData._id, // eslint-disable-line no-underscore-dangle
      method   : 'PUT',
      data     : {
        firstName : formData.firstName,
        lastName  : formData.lastName,
        team      : formData.teamName,
        jobTitle  : formData.admin
      }
    });
  };

  return (
    <Modal
      isModalOpen={visible}
      modalActions={(
        <div className="flex w-full items-center justify-end gap-2">
          <button
            className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
            onClick={() => setVisible(false)}
          > Cancel </button>
          <button
            className="px-8 py-2 text-sm text-white font-medium bg-blue-500 rounded-lg"
            onClick={handleSubmit(onSubmit)}
          > Save </button>
        </div>
      )}
      modalContent={(
        <div className="flex flex-col gap-y-3">
          <div className="flex gap-x-2">
            <input
              className={classnames(
                'flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none',
                {'border-1 border-red-400' : errors.firstName}
              )}
              {...register('firstName')}
              placeholder="First Name"
              type="text"
            />
            {errors?.firstName && <p className="-mt-2 text-red-500 text-xs font-medium"> {errors.firstName.message} </p>}

            <input
              className={classnames(
                'flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none',
                {'border-1 border-red-400' : errors.lastName}
              )}
              {...register('lastName')}
              placeholder="Last Name"
              type="text"
            />
            {errors?.lastName && <p className="-mt-2 text-red-500 text-xs font-medium"> {errors.lastName.message} </p>}
          </div>

          <input
            className={classnames(
              'text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none',
              {'border-1 border-red-400' : errors.email}
            )}
            {...register('email')}
            placeholder="Email"
            type="text"
          />
          {errors?.email && <p className="-mt-2 text-red-500 text-xs font-medium"> {errors.email.message} </p>}

          <Select
            errorClassname={errors.admin ? 'border-1 border-red-400' : ''}
            options={map(filter(USER_ROLES, item => item !== 'superadmin'), role => ({
              // eslint-disable-next-line no-underscore-dangle
              value : role,
              label : role
            }))}
            placeholder="Select a job title"
            selected={selectedUserRole}
            setSelected={event => {
              setSelectedUserRole(event);
              setValue('admin', event.value, {
                shouldValidate : true
              });
            }}
          />
          {errors?.admin && <p className="-mt-2 text-red-500 text-xs font-medium"> {errors.admin.message} </p>}

          <Select
            errorClassname={errors?.teamName ? 'border-1 border-red-400' : ''}
            options={map(teams, team => ({
              // eslint-disable-next-line no-underscore-dangle
              value : team._id,
              label : team.name
            }))}
            placeholder="Select a team"
            selected={selectedTeam}
            setSelected={event => {
              setSelectedTeam(event);
              setValue('teamName', event.value, {
                shouldValidate : true
              });
            }}
          />
          {errors?.teamName && <p className="-mt-2 text-red-500 text-xs font-medium"> {errors.teamName.message} </p>}

          {
            error &&
            error.message && (
              <p className="my-1 text-red-500 text-xs font-medium"> {error.message}</p>
            )
          }

        </div>
      )}
      modalTitle="User details"
      setIsModalOpen={() => null}
    />
  );
};

CreateEditUser.displayName = 'CreateEditUser';
CreateEditUser.propTypes = {
  visible         : bool.isRequired, // eslint-disable-line react/boolean-prop-naming
  setVisible      : func.isRequired,
  selectedUser    : object.isRequired,
  setSelectedUser : func.isRequired,
  teams           : array,
  mutate          : func.isRequired

};
CreateEditUser.defaultProps = {
  teams : []
};
export default CreateEditUser;
