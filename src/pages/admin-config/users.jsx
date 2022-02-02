import {useState} from 'react';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Modal, Select, Table} from 'components';
import {array} from 'prop-types';
import map from 'lodash/map';
import filter from 'lodash/filter';
import classnames from 'classnames';
import useSWR from 'swr';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {USER_ROLES} from 'constants/userRoles';

const AdminUsers = ({
  defaultTeams,
  defaultUsers
}) => {
  const [selectedUser, setSelectedUser] = useState({});
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const {data: teams} = useSWR('/teams', {
    initialData : defaultTeams
  });
  const {data: users} = useSWR('/users', {
    initialData : defaultUsers
  });

  const userColumns = [
    {
      key   : 'firstName',
      title : 'First Name'
    }, {
      key   : 'lastName',
      title : 'Last Name'
    }, {
      key   : 'email',
      title : 'Email'
    }, {
      key   : 'team',
      title : 'Team Name'
    }, {
      key   : 'jobTitle',
      title : 'Position'
    }

  ];

  const formSchema = Yup.object().shape({
    teamName : Yup.string()
      .required('Team Name is required'),
    admin : Yup.string().required('Team Admin is required')
  });
  const validationOptions = {resolver : yupResolver(formSchema)};
  const {register, handleSubmit, reset, watch, setValue, formState: {errors}} = useForm(validationOptions);


  return (
    <div className="w-full flex flex-col">
      <section className="w-5/6 mx-auto flex items-center justify-between">
        <h1 className="text-xl font-medium py-4"> Company Users </h1>
        <button className="px-5 py-2 bg-gray-500 rounded text-white font-medium text-md cursor-not-allowed" disabled> Create User </button>
      </section>

      <div className="flex-1 ">
        <Table
          columns={userColumns}
          data={users}
          isDisabled={item => item.jobTitle === 'superadmin'}
          onRowClick={item => {
            setSelectedUser(item);
            setIsEditUserModalOpen(true);
            Object.entries(item).forEach(([name, value]) => setValue(name, value));
          }}
        />
      </div>

      <Modal
        isModalOpen={isEditUserModalOpen}
        modalActions={(
          <div className="flex w-full items-center justify-end gap-2">
            <button
              className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
              onClick={() => setIsEditUserModalOpen(false)}
            > Cancel </button>
            <button
              className="px-8 py-2 text-sm text-white font-medium bg-blue-500 rounded-lg"
              onClick={() => {
                setIsEditUserModalOpen(false);
              }}
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

              <input
                className={classnames(
                  'flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none',
                  {'border-1 border-red-400' : errors.lastName}
                )}
                {...register('lastName')}
                placeholder="Last Name"
                type="text"
              />
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

            <Select
              errorClassname={errors.jobTitle ? 'border-1 border-red-400' : ''}
              onChange={event => {
                setValue('jobTitle', event, {
                  shouldValidate : true
                });
                setSelectedUser({
                  ...selectedUser,
                  jobTitle : event
                });
              }}
              options={map(filter(USER_ROLES, item => item !== 'superadmin'), role => ({
                // eslint-disable-next-line no-underscore-dangle
                value : role,
                name  : role
              }))}
              placeholder="Select a job title"
              value={selectedUser.jobTitle}
            />

            <Select
              errorClassname={errors.team ? 'border-1 border-red-400' : ''}
              onChange={event => {
                setSelectedUser({
                  ...selectedUser,
                  team : event
                });
                setValue('team', event, {
                  shouldValidate : true
                });
              }}
              options={map(teams, team => ({
                // eslint-disable-next-line no-underscore-dangle
                value : team._id,
                name  : team.name
              }))}
              placeholder="Select a team"
              value={selectedUser.team}
            />

          </div>
        )}
        modalTitle="User details"
        setIsModalOpen={setIsEditUserModalOpen}
      />
    </div>
  );
};


AdminUsers.getInitialProps = async ctx => {
  try {
    const {data: teams} = await getPropsFromFetch('/teams', ctx);
    const {data: users} = await getPropsFromFetch('/users', ctx);

    return {
      defaultTeams : teams,
      defaultUsers : users
    };
  } catch {
    return {
      defaultTeams : [],
      defaultUsers : []
    };
  }
};
AdminUsers.displayName = 'AdminUsers';
AdminUsers.propTypes = {
  defaultTeams : array.isRequired,
  defaultUsers : array.isRequired
};

export default AdminUsers;
