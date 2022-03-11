import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {LogoutIcon} from '@heroicons/react/solid';
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
      self-start bg-white w-full h-24 shadow-md
      flex justify-center items-center
      px-10
      sm:justify-end
      `
    }
    >
      <div className="relative justify-self-start mr-auto w-28 h-20 cursor-pointer hidden sm:block" onClick={() => router.push('/')}>
        <Image alt="ProjectManagementAppLogo" layout="fill" src={'/images/logo.png'} />
      </div>
      <div className="flex gap-x-5">
        {
          router.asPath.includes('/admin-config') ? null : (
            <div>
              <Link href={PRIVATE_PATHS.HOME_PAGE}>
                <a
                  className={cx(
                    'text-xs font-medium p-2 cursor-pointer text-gray-400 hover:text-gray-800 md:p-4 md:text-base',
                    {'text-black font-bold' : router.asPath === PRIVATE_PATHS.HOME_PAGE}
                  )}
                > Home </a>
              </Link>
              <Link href={PRIVATE_PATHS.KNOWLEDGE_SHARING}>
                <a
                  className={cx(
                    'text-xs font-medium p-2 cursor-pointer text-gray-400 hover:text-gray-800 md:p-4 md:text-base',
                    {'text-black font-bold' : router.asPath.includes(PRIVATE_PATHS.KNOWLEDGE_SHARING)}
                  )}
                > Knowledge sharing  </a>
              </Link>
              <Link href={PRIVATE_PATHS.DEPLOY_TRACKER}>
                <a
                  className={cx(
                    'text-xs font-medium p-2 cursor-pointer text-gray-400 hover:text-gray-800 md:p-4 md:text-base',
                    {'text-black font-bold' : router.asPath === PRIVATE_PATHS.DEPLOY_TRACKER}
                  )}
                > Deploy Tracker
                </a>
              </Link>
              { getIsAdmin() && <Link href={PRIVATE_PATHS.ADMIN_CONFIG}>
                <a className="text-xs font-medium p-2 cursor-pointer text-gray-400 hover:text-gray-800 md:p-4 md:text-base"> Admin </a>
              </Link>
              }
            </div>
          )
        }

        <LogoutIcon
          className="w-7 self-center cursor-pointer text-gray-800 hover:text-gray-600 sm:w-6 md:w-5"
          onClick={() => setIsSignOutModalOpen(true)}
        />
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
