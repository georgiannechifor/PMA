import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {object} from 'prop-types';
import {PUBLIC_PATHS, LOCAL_STORAGE_USER_KEY} from 'constants/index';
import useLocalStorage from 'utils/useLocalStorage';

const RouterGuard = ({children}) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [storedValue] = useLocalStorage(LOCAL_STORAGE_USER_KEY, {});

  // Const authCheck = url => {
  //   Const path = url.split('?')[0];
  //
  //   If (!storedValue.accessToken && !Object.values(PUBLIC_PATHS).includes(path)) {
  //     SetAuthorized(false);
  //     Router.push({
  //       Pathname : PUBLIC_PATHS.LOGIN,
  //       Query    : {
  //         ReturnUrl : router.asPath
  //       }
  //     });
  //   } else {
  //     SetAuthorized(true);
  //   }
  // };
  //
  //
  // UseEffect(() => {
  //   // On initial load - run auth check
  //   AuthCheck(router.asPath);
  //
  //   // On route change start - hide page content by setting authorized to false
  //   Const hideContent = () => setAuthorized(false);
  //
  //   Router.events.on('routeChangeStart', hideContent);
  //
  //   // On route change complete - run auth check
  //   Router.events.on('routeChangeComplete', authCheck);
  //
  //   // Unsubscribe from events in useEffect return function
  //   Return () => {
  //     Router.events.off('routeChangeStart', hideContent);
  //     Router.events.off('routeChangeComplete', authCheck);
  //   };
  // }, []);

  return children;
};

RouterGuard.displayName = 'RouterGuard';
RouterGuard.propTypes = {
  children : object.isRequired
};

export default RouterGuard;
