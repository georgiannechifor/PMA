import Login from 'pages/login';
import {bool} from 'prop-types';

const withAuth = Component => {
  const Auth = props => {
    const {isLoggedIn} = props;

    if (!isLoggedIn) {
      return (
        <Login />
      );
    }

    return (
      <Component
        {...props}
      />
    );
  };

  Auth.displayName = 'AuthWrapper';
  Auth.propTypes = {
    isLoggedIn : bool.isRequired
  };

  return Auth;
};

export default withAuth;
