import {useState} from 'react';
import Link from 'next/link';
import * as cx from 'classnames';
import {useRouter} from 'next/router';
import {ArrowLeftIcon} from '@heroicons/react/outline';
import {PRIVATE_PATHS, TABS} from 'constants/index';

const AdminMenu = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[router.asPath.split('/')[2]?.toUpperCase()] || TABS.USERS);

  return (
    <div className="h-full flex flex-col items-start justify-center p-2 mt-3">
      <Link href={PRIVATE_PATHS.ADMIN_USERS} passHref>
        <a
          className={cx('px-5 my-1 py-3 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.USERS},
            {'hover:bg-gray-100' : activeTab !== TABS.USERS})}
          onClick={() => setActiveTab(TABS.USERS)}
        > Users
        </a>
      </Link>
      <Link href={PRIVATE_PATHS.ADMIN_TEAMS} passHref>
        <a
          className={cx('px-5 my-1 py-3 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.TEAMS},
            {'hover:bg-gray-100' : activeTab !== TABS.TEAMS})}
          onClick={() => setActiveTab(TABS.TEAMS)}
        > Teams </a>
      </Link>
      <Link href={PRIVATE_PATHS.ADMIN_PROJECTS} passHref>
        <a
          className={cx('px-5 my-1 py-3 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.PROJECTS},
            {'hover:bg-gray-100' : activeTab !== TABS.PROJECTS})}
          onClick={() => setActiveTab(TABS.PROJECTS)}
        > Projects </a>
      </Link>
      <Link href={PRIVATE_PATHS.ADMIN_EVENTS} passHref>
        <a
          className={cx('px-5 my-1 py-3 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.EVENTS},
            {'hover:bg-gray-100' : activeTab !== TABS.EVENTS})}
          onClick={() => setActiveTab(TABS.EVENTS)}
        > Events </a>
      </Link>


      <Link href="/" passHref>
        <a className="mt-auto py-2 px-5 text-white bg-blue-500 w-full rounded mb-5 text-center font-medium cursor-pointer flex items-center justify-between">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to homepage
        </a>
      </Link>
    </div>
  );
};

AdminMenu.displayName = 'AdminMenu';
AdminMenu.propTypes = {};

export default AdminMenu;
