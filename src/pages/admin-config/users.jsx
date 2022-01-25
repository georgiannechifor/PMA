import {useState} from 'react';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Modal, Table} from 'components';
import {array} from 'prop-types';

const AdminUsers = ({
  users
}) => {
  const [selectedUser, setSelectedUser] = useState({});
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);

  const userColumns = [
    {
      key   : 'firstName',
      title : 'First Name'
    }, {
      key   : 'lastName',
      title : 'LastName'
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
      <h1 className="text-xl font-medium text-gray-600 py-4"> Company Users </h1>

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
      users : data
    };
  } catch {
    return {
      users : []
    };
  }
};
AdminUsers.displayName = 'AdminUsers';
AdminUsers.propTypes = {
  users : array.isRequired
};

export default AdminUsers;
