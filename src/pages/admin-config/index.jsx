import {useEffect} from 'react';
import {useRouter} from 'next/router';

import useLocalStorage from 'utils/useLocalStorage';
import {LOCAL_STORAGE_USER_KEY, USER_ROLES, PUBLIC_PATHS} from 'constants/index';

const AdminPage = () => {
  const router = useRouter();
  const [storedValue, setValue] = useLocalStorage(LOCAL_STORAGE_USER_KEY, {});

  const getIsAdmin = () => storedValue &&
  storedValue.user &&
  (storedValue.user.jobTitle === USER_ROLES.ADMIN || storedValue.user.jobTitle === USER_ROLES.SUPER_ADMIN);

  useEffect(() => {
    if (!getIsAdmin()) {
      alert('You are not authorized'); // eslint-disable-line no-alert
      setValue({});
      router.push(PUBLIC_PATHS.LOGIN);
    }
  }, []);

  return (
    <div> AdminPage Title </div>
  );
};

AdminPage.displayName = 'AdminPage';
AdminPage.propTypes = {};

export default AdminPage;
