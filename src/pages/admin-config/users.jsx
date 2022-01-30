import {useState} from 'react';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Modal, Table} from 'components';
import {array} from 'prop-types';
import useSWR from 'swr';

const AdminUsers = ({
  defaultUsers,
  defaultTeams
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
          onRowClick={item => {
            setSelectedUser(item);
            setIsEditUserModalOpen(true);
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
          <div>
            <p> { selectedUser.firstName }</p>
            <p> { selectedUser.lastName }</p>
            <p> { selectedUser.email }</p>
            <p> { selectedUser.jobTitle }</p>

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
    const {data} = await getPropsFromFetch('/users', ctx);

    return {
      defaultUsers : data,
      defaultTeams : []
    };
  } catch {
    return {
      defaultUsers : [],
      defaultTeams : []
    };
  }
};
AdminUsers.displayName = 'AdminUsers';
AdminUsers.propTypes = {
  defaultUsers : array.isRequired,
  defaultTeams : array.isRequired
};

export default AdminUsers;
