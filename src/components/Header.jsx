import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {LogoutIcon} from '@heroicons/react/solid';
import {Menu} from '@headlessui/react';
import {useRouter} from 'next/router';
import * as cx from 'classnames';

import useLocalStorage from 'utils/useLocalStorage';
import {LOCAL_STORAGE_USER_KEY, USER_ROLES, PRIVATE_PATHS} from 'constants/index';

import {Modal} from './';

const Header = () => {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [storedValue, setValue] = useLocalStorage(LOCAL_STORAGE_USER_KEY);

  const getActiveHeaderTab = tab => router.asPath === tab;

  const getIsAdmin = () => storedValue &&
  storedValue.user &&
  (storedValue.user.jobTitle === USER_ROLES.ADMIN || storedValue.user.jobTitle === USER_ROLES.SUPER_ADMIN);


  const getAdminDropDown = () => (
    <Menu>
      <Menu.Button> Admin </Menu.Button>
      <Menu.Items>
        <Menu.Item>
          {({active}) => (
            <Link
              className={`${active && 'bg-gray-300'}`}
              href="/admin-users"
            > Users </Link>
          )}
        </Menu.Item>

      </Menu.Items>
    </Menu>
  );

  return (
    <div className="
      self-start bg-white w-full h-24 shadow-md
      flex justify-center items-center
      px-10
      sm:justify-end
      "
    >
      <div className="relative justify-self-start mr-auto w-28 h-20 cursor-pointer hidden sm:block" onClick={() => router.push('/')}>
        <Image layout="fill" src={'/images/logo.png'} />
      </div>
      <div className="flex gap-x-5">
        {
          router.asPath === PRIVATE_PATHS.ADMIN_CONFIG ? null : (
            <>
              <Link href={PRIVATE_PATHS.HOME_PAGE}>
                <p
                  className={cx(
                    'text-md font-medium p-2 cursor-pointer text-gray-400 hover:text-gray-800 sm:p-4',
                    {'text-gray-800' : getActiveHeaderTab(PRIVATE_PATHS.HOME_PAGE)}
                  )}
                > Home </p>
              </Link>
              <Link href={PRIVATE_PATHS.KNOWLEDGE_SHARING}>
                <p
                  className={cx(
                    'text-md font-medium p-2 cursor-pointer text-gray-400 hover:text-gray-800 sm:p-4',
                    {'text-gray-800' : getActiveHeaderTab(PRIVATE_PATHS.KNOWLEDGE_SHARING)}
                  )}
                > Knowledge sharing  </p>
              </Link>
              <Link href={PRIVATE_PATHS.DEPLOY_TRACKER}>
                <p
                  className={cx(
                    'text-md font-medium p-2 cursor-pointer text-gray-400 hover:text-gray-800 sm:p-4',
                    {'text-gray-800' : getActiveHeaderTab(PRIVATE_PATHS.DEPLOY_TRACKER)}
                  )}
                > Deploy Tracker </p>
              </Link>
              { getIsAdmin() && <Link href={PRIVATE_PATHS.ADMIN_CONFIG}>
                <p className={cx(
                  'text-md font-medium p-2 cursor-pointer text-gray-400 hover:text-gray-800 sm:p-4',
                  {'text-gray-800' : getActiveHeaderTab(PRIVATE_PATHS.ADMIN_CONFIG)}
                )}
                > Admin </p>
              </Link>
              }
            </>
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
export default Header;
