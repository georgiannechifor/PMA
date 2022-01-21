import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {elementType} from 'prop-types';
import {PUBLIC_PATHS, LOCAL_STORAGE_USER_KEY} from 'constants/index';
import useLocalStorage from 'utils/useLocalStorage';

const RouterGuard = ({children}) => {
  const router = useRouter();
  const [, setAuthorized] = useState(false);
  const [storedValue] = useLocalStorage(LOCAL_STORAGE_USER_KEY, '');

  const authCheck = path => {
    if (!storedValue.accessToken && !Object.values(PUBLIC_PATHS).includes(path)) {
      setAuthorized(false);
      router.replace(PUBLIC_PATHS.LOGIN);
    } else {
      setAuthorized(true);
    }
  };

  useEffect(() => {
    authCheck(router.asPath);
  }, []);

  return children;
};

RouterGuard.displayName = 'RouterGuard';
RouterGuard.propTypes = {
  children : elementType.isRequired
};

export default RouterGuard;
