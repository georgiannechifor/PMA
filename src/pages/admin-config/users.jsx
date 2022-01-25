import {useState} from 'react';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Modal} from 'components';
import {array} from 'prop-types';

const AdminUsers = ({
  users
}) => {
  const [selectedUser, setSelectedUser] = useState({});
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col">
      <h1 className="text-xl font-medium text-gray-600 py-4"> Company Users </h1>

      <div className="flex-1 ">
        <table className="mx-auto table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <th className="px-16 py-2"> <span className="text-gray-100 font-medium"> First Name </span></th>
              <th className="px-16 py-2"> <span className="text-gray-100 font-medium"> Last Name </span></th>
              <th className="px-16 py-2"> <span className="text-gray-100 font-medium"> Email </span></th>
              <th className="px-16 py-2"> <span className="text-gray-100 font-medium"> Team  </span></th>
              <th className="px-16 py-2"> <span className="text-gray-100 font-medium"> Position </span></th>
            </tr>
          </thead>
          <tbody className="bg-gray-200">
            {
              users &&
              users.map(user => (
                <tr
                  className="bg-white cursor-pointer hover:bg-gray-50"
                  key={user._id} // eslint-disable-line no-underscore-dangle
                  onClick={() => {
                    setSelectedUser(user);
                    setIsEditUserModalOpen(true);
                  }}
                >
                  <td className="px-16 py-2">
                    <span>{ user.firstName }</span>
                  </td>
                  <td className="px-16 py-2">
                    <span>{ user.lastName }</span>
                  </td>
                  <td className="px-16 py-2">
                    <span>{ user.email }</span>
                  </td>
                  <td className="px-16 py-2">
                    <span>{ user.team || <span className="italic"> No team</span> }</span>
                  </td>
                  <td className="px-16 py-2">
                    <span>{ user.jobTitle }</span>
                  </td>
                </tr>
              ))
            }
          </tbody>

        </table>

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
