import {useState, useEffect, useMemo} from 'react';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Modal, Table, Loader, Pagination} from 'components';
import {array} from 'prop-types';
import size from 'lodash/size';
import slice from 'lodash/slice';
import useSWR, {useSWRConfig} from 'swr';

import {useFetch} from 'utils/useFetch';
import {userColumns, PAGE_SIZE} from 'constants/index';
import {CreateEditUser} from 'components/modals';

// eslint-disable-next-line complexity, max-statements
const AdminUsers = ({
  defaultTeams,
  defaultUsers
}) => {
  const [selectedUser, setSelectedUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [removeUserConfirmationModal, setRemoveUserConfirmationModal] = useState(false);
  const {result: {data, loading}, fetchData} = useFetch('users');
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


  const removeUser = () => {
    fetchData({
      entityId : selectedUser._id, // eslint-disable-line no-underscore-dangle
      method   : 'DELETE'
    });
    setSelectedUser(null);
  };

  useEffect(() => {
    if (data) {
      setRemoveUserConfirmationModal(false);
      mutate('/users');
    }
    // eslint-disable-next-line
  }, [data]);

  return (
    <Loader isLoading={loading}>
      <div className="w-11/12 mx-auto flex flex-col">
        <section className="flex items-center justify-between">
          <h1 className="text-xl font-medium py-4"> Company Users </h1>
        </section>

        <Table
          columns={userColumns}
          conditionForBold={index => parseInt(index, 10) === 0 || parseInt(index, 10) === 1}
          data={paginatedUsers || []}
          isDisabled={item => item.jobTitle === 'superadmin'}
          onDeleteItem={item => {
            setSelectedUser(item);
            setRemoveUserConfirmationModal(true);
          }}
          onEdit={item => {
            setSelectedUser(item);
            setVisible(true);
          }}
          onRowClick={item => {
            setSelectedUser(item);
          }}
        />

        <CreateEditUser
          mutate={mutate}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setVisible={setVisible}
          teams={teams}
          visible={visible}
        />


        <Modal
          isModalOpen={removeUserConfirmationModal}
          modalActions={(
            <div className="flex w-full items-center justify-end gap-2">
              <button
                className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
                onClick={() => {
                  setRemoveUserConfirmationModal(false);
                }}
              > Cancel </button>
              <button
                className="px-8 py-2 text-sm text-white font-medium bg-red-500 rounded-lg"
                onClick={() => removeUser()}
              > Remove </button>
            </div>
          )}
          modalContent={(
            <p> Are you sure you want to remove { selectedUser?.firstName} {selectedUser?.lastName}?</p>
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
