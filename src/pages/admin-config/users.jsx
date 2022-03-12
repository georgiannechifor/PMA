import {useState, useEffect, useMemo} from 'react';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Modal, Select, Table, Loader, Pagination} from 'components';
import {array} from 'prop-types';
import map from 'lodash/map';
import size from 'lodash/size';
import slice from 'lodash/slice';
import filter from 'lodash/filter';
import classnames from 'classnames';
import useSWR, {useSWRConfig} from 'swr';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {useFetch} from 'utils/useFetch';
import {USER_ROLES, userColumns, PAGE_SIZE} from 'constants/index';

// eslint-disable-next-line complexity, max-statements
const AdminUsers = ({
  defaultTeams,
  defaultUsers
}) => {
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedTeam, setSelectedTeam] = useState({});
  const [selectedUserRole, setSelectedUserRole] = useState({});
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [removeUserConfirmationModal, setRemoveUserConfirmationModal] = useState(false);
  const {mutate} = useSWRConfig();
  // eslint-disable-next-line no-unused-vars
  const {data: teams} = useSWR('/teams', {
    initialData : defaultTeams
  });
  const {data: users} = useSWR('/users', {
    initialData : defaultUsers
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedUsers, setPaginatedUsers] = useState(users);

  useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;

    setPaginatedUsers(slice(users, firstPageIndex, lastPageIndex));
  }, [currentPage, users]);


  const formSchema = Yup.object().shape({
    firstName : Yup.string().required('First name is required'),
    lastName  : Yup.string().required('Last name is required'),
    teamName  : Yup.string().required('Team Name is required'),
    email     : Yup.string().required('Email is required'),
    admin     : Yup.string().required('Team Admin is required')
  });
  const validationOptions = {resolver : yupResolver(formSchema)};
  const {register, handleSubmit, setValue, reset, formState: {errors}} = useForm(validationOptions);
  const {result: {data, loading, error}, fetchData} = useFetch('users');

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

  const removeUser = () => {
    fetchData({
      entityId : selectedUser._id, // eslint-disable-line no-underscore-dangle
      method   : 'DELETE'
    });
  };

  useEffect(() => {
    if (selectedUser) {
      setValue('admin', selectedUser.jobTitle);
      // eslint-disable-next-line no-underscore-dangle
      setValue('teamName', selectedUser.team?._id);
      setSelectedUserRole({
        value : selectedUser.jobTitle,
        name  : selectedUser.jobTitle
      });
      setSelectedTeam({
        // eslint-disable-next-line no-underscore-dangle
        value : selectedUser.team?._id,
        name  : selectedUser.team?.name
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    if (data && data._id || data && data.deletedCount) {
      setIsEditUserModalOpen(false);
      setRemoveUserConfirmationModal(false);
      reset({
        teamName : '',
        admin    : ''
      });

      mutate('/users');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Loader isLoading={loading}>
      <div className="w-11/12 mx-auto flex flex-col">
        <section className="flex items-center justify-between">
          <h1 className="text-xl font-medium py-4"> Company Users </h1>
        </section>

        <div className="flex-1">
          <Table
            columns={userColumns}
            conditionForBold={index => parseInt(index, 10) === 0 || parseInt(index, 10) === 1}
            data={paginatedUsers}
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
                className="pl-2 py-2 font-medium text-sm text-red-400 mr-auto hover:underline transition"
                onClick={() => {
                  setIsEditUserModalOpen(false);
                  setRemoveUserConfirmationModal(true);
                }}
              > Delete </button>
              <button
                className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
                onClick={() => setIsEditUserModalOpen(false)}
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
                { errors?.firstName && <p className="-mt-2 text-red-500 text-xs font-medium"> { errors.firstName.message} </p>}

                <input
                  className={classnames(
                    'flex-1 text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none',
                    {'border-1 border-red-400' : errors.lastName}
                  )}
                  {...register('lastName')}
                  placeholder="Last Name"
                  type="text"
                />
                { errors?.lastName && <p className="-mt-2 text-red-500 text-xs font-medium"> { errors.lastName.message} </p>}
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
              { errors?.email && <p className="-mt-2 text-red-500 text-xs font-medium"> { errors.email.message} </p>}

              <Select
                errorClassname={errors.admin ? 'border-1 border-red-400' : ''}
                options={map(filter(USER_ROLES, item => item !== 'superadmin'), role => ({
                // eslint-disable-next-line no-underscore-dangle
                  value : role,
                  name  : role
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
              { errors?.admin && <p className="-mt-2 text-red-500 text-xs font-medium"> { errors.admin.message} </p>}

              <Select
                errorClassname={errors?.teamName ? 'border-1 border-red-400' : ''}
                options={map(teams, team => ({
                // eslint-disable-next-line no-underscore-dangle
                  value : team._id,
                  name  : team.name
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
              { errors?.teamName && <p className="-mt-2 text-red-500 text-xs font-medium"> { errors.teamName.message} </p> }

              {
                error &&
                error.message && (
                  <p className="my-1 text-red-500 text-xs font-medium"> { error.message }</p>
                )
              }

            </div>
          )}
          modalTitle="User details"
          setIsModalOpen={() => null}
        />

        <Modal
          isModalOpen={removeUserConfirmationModal}
          modalActions={(
            <div className="flex w-full items-center justify-end gap-2">
              <button
                className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
                onClick={() => {
                  setRemoveUserConfirmationModal(false);
                  setIsEditUserModalOpen(true);
                }}
              > Cancel </button>
              <button
                className="px-8 py-2 text-sm text-white font-medium bg-red-500 rounded-lg"
                onClick={() => removeUser()}
              > Remove </button>
            </div>
          )}
          modalContent={(
            <p> Are you sure you want to remove { selectedUser.firstName} {selectedUser.lastName}?</p>
          )}
          modalTitle="Remove confirmation"
          setIsModalOpen={setRemoveUserConfirmationModal}
        />

        <div className="w-full">
          <Pagination
            currentPage={currentPage} onPageChange={page => setCurrentPage(page)} pageSize={PAGE_SIZE}
            totalCount={size(paginatedUsers)}
          />
        </div>
      </div>


    </Loader>
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
