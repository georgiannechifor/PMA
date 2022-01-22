import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {object} from 'prop-types';
import {PUBLIC_PATHS, LOCAL_STORAGE_USER_KEY} from 'constants/index';
import useLocalStorage from 'utils/useLocalStorage';

const RouterGuard = ({children}) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [storedValue] = useLocalStorage(LOCAL_STORAGE_USER_KEY, {});

  const authCheck = url => {
    const path = url.split('?')[0];

    if (!storedValue.accessToken && !Object.values(PUBLIC_PATHS).includes(path)) {
      setAuthorized(false);
      router.push({
        pathname : PUBLIC_PATHS.LOGIN,
        query    : {
          returnUrl : router.asPath
        }
      });
    } else {
      setAuthorized(true);
    }
  };


  useEffect(() => {
    // On initial load - run auth check
    authCheck(router.asPath);

    // On route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);

    router.events.on('routeChangeStart', hideContent);

    // On route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // Unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  return authorized && children;
};

RouterGuard.displayName = 'RouterGuard';
RouterGuard.propTypes = {
  children : object.isRequired
};

export default RouterGuard;
