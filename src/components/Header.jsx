import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LogoutIcon,
  HomeIcon,
  ShareIcon,
  DocumentReportIcon,
  CogIcon
} from '@heroicons/react/outline';
import {string} from 'prop-types';
import {useRouter} from 'next/router';
import * as cx from 'classnames';

import useLocalStorage from 'utils/useLocalStorage';
import {LOCAL_STORAGE_USER_KEY, USER_ROLES, PRIVATE_PATHS} from 'constants/index';
import {useFetch} from 'utils/useFetch';

import {Modal} from './';

const Header = ({
  className
}) => {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [storedValue, setValue] = useLocalStorage(LOCAL_STORAGE_USER_KEY);
  const {fetchData} = useFetch('auth/logout');

  const getIsAdmin = () =>
    storedValue &&
  (storedValue.jobTitle === USER_ROLES.ADMIN || storedValue.jobTitle === USER_ROLES.SUPER_ADMIN);

  return (
    <div className={`${className}
      self-start bg-white w-full h-32 shadow
      w-full
      flex items-center
      px-14
      `
    }
    >
      <div className="relative w-28 h-20 cursor-pointer hidden sm:block" onClick={() => router.push('/')}>
        <Image alt="ProjectManagementAppLogo" layout="fill" src="../images/logo.png" />
      </div>
      <div className="ml-14 flex-1 flex items-center">
        <div className="flex gap-5">
          <Link href={PRIVATE_PATHS.HOME_PAGE}>
            <a
              className={cx(
                'flex items-center gap-2 text-xs font-medium rounded-lg p-2 cursor-pointer text-gray-400 hover:text-gray-800 md:px-4 md:text-base',
                {'text-black font-bold bg-gray-100' : router.asPath === PRIVATE_PATHS.HOME_PAGE}
              )}
            > <HomeIcon className={
                cx('w-7 text-gray-400 sm:w-6 md:w-5', {'text-black' : router.asPath === PRIVATE_PATHS.HOME_PAGE})
              }
              /> Home </a>
          </Link>
          <Link href={PRIVATE_PATHS.KNOWLEDGE_SHARING}>
            <a
              className={cx(
                'flex items-center gap-2 text-xs font-medium rounded-lg p-2 cursor-pointer text-gray-400 hover:text-gray-800 md:px-4 md:text-base',
                {'text-black font-bold bg-gray-100' : router.asPath.includes(PRIVATE_PATHS.KNOWLEDGE_SHARING)}
              )}
            > <ShareIcon className={
                cx('w-7 text-gray-400 sm:w-6 md:w-5', {'text-black' : router.asPath === PRIVATE_PATHS.KNOWLEDGE_SHARING})
              }
              /> Knowledge sharing  </a>
          </Link>
          <Link href={PRIVATE_PATHS.DEPLOY_TRACKER}>
            <a
              className={cx(
                'flex items-center gap-2 text-xs font-medium rounded-lg p-2 cursor-pointer text-gray-400 hover:text-gray-800 md:px-4 md:text-base',
                {'text-black font-bold bg-gray-100' : router.asPath === PRIVATE_PATHS.DEPLOY_TRACKER}
              )}
            > <DocumentReportIcon className={
                cx('w-7 text-gray-400 sm:w-6 md:w-5', {'text-black' : router.asPath === PRIVATE_PATHS.DEPLOY_TRACKER})
              }
              /> Deploy Tracker
            </a>
          </Link>
          { getIsAdmin() ? <Link href={PRIVATE_PATHS.ADMIN_CONFIG}>
            <a className={cx(
              'flex items-center gap-2 text-xs font-medium rounded-lg p-2 cursor-pointer text-gray-400 hover:text-gray-800 md:px-4 md:text-base',
              {'text-black font-bold bg-gray-100' : router.asPath.includes(PRIVATE_PATHS.ADMIN_CONFIG)}
            )}
            > <CogIcon className={
                cx('w-7 text-gray-400 sm:w-6 md:w-5', {'text-black' : router.asPath.includes(PRIVATE_PATHS.ADMIN_CONFIG)})
              }
              /> Admin </a>
          </Link> : null
          }
        </div>

        <div
          className="flex gap-3 bg-gray-200 py-2 px-5 rounded-lg ml-auto cursor-pointer hover:bg-gray-300 transition"
          onClick={() => setIsSignOutModalOpen(true)}
        >
          <LogoutIcon className="w-7 text-gray-800 sm:w-6 md:w-5" />
          Sign out
        </div>
      </div>

      <Modal
        isModalOpen={isSignOutModalOpen}
        modalActions={(
          <div className="flex w-full items-center justify-end gap-2">
            <button
              className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
              onClick={() => setIsSignOutModalOpen(false)}
            > Cancel </button>
            <button
              className="px-4 py-2 text-sm text-white font-medium bg-blue-500 rounded-lg"
              onClick={() => {
                setValue({});
                fetchData({
                  method : 'POST'
                });
                setIsSignOutModalOpen(false);
                router.push('/login');
              }}
            > Sign out </button>
          </div>
        )}
        modalContent={(<p> Are you sure you want to sign out&#63; </p>)}
        modalTitle="Sign out Confirmation"
        setIsModalOpen={setIsSignOutModalOpen}
      />
    </div>
  );
};

Header.displayName = 'Header';
Header.propTypes = {
  className : string
};
Header.defaultProps = {
  className : ''
};
export default Header;
