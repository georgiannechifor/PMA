import {useEffect} from 'react';
import {useRouter} from 'next/router';

import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import useLocalStorage from 'utils/useLocalStorage';
import {useFetch} from 'utils/useFetch';
import {LOCAL_STORAGE_USER_KEY, USER_ROLES, PUBLIC_PATHS} from 'constants/index';

const AdminPage = () => {
  const router = useRouter();
  const [storedValue, setValue] = useLocalStorage(LOCAL_STORAGE_USER_KEY, {});
  const { fetchData} = useFetch('api/logout');

  const getIsAdmin = () =>
    storedValue &&
  (storedValue.jobTitle === USER_ROLES.ADMIN || storedValue.jobTitle === USER_ROLES.SUPER_ADMIN);

  useEffect(() => {
    if (!getIsAdmin()) {
      setValue({});
      fetchData({ method : "POST"});
      router.push(PUBLIC_PATHS.LOGIN);
    }
  }, []);

  return (
    <div> AdminPage Title </div>
  );
};

AdminPage.getInitialProps = async (context) => {
  const { data } = await getPropsFromFetch('http://localhost:3000/api/events', context);

  return {
    events : data
  }
}

AdminPage.displayName = 'AdminPage';
AdminPage.propTypes = {};

export default AdminPage;
