import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {array} from 'prop-types';

const AdminUsers = ({
  users
}) => (
  <div>
    <h1>Admin Users Title  </h1>
    {
      users &&
        users.map(user => (
          <p key={user.email}>
            {user.firstName} { user.lastName} { user.email }
          </p>
        ))
    }
  </div>
);


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
