import {useState} from 'react';
import Link from 'next/link';
import * as cx from 'classnames';
import {useRouter} from 'next/router';
import {
  ArrowLeftIcon,
  UserIcon,
  CalendarIcon,
  PresentationChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/outline';
import {PRIVATE_PATHS, TABS} from 'constants/index';

const AdminMenu = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[router.asPath.split('/')[2]?.toUpperCase()] || TABS.USERS);

  return (
    <nav className="h-full flex flex-col items-start justify-center p-2 mt-3">
      <Link href={PRIVATE_PATHS.ADMIN_USERS} passHref>
        <a
          className={cx('flex items-center gap-x-3 px-5 my-1 py-5 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.USERS},
            {'hover:bg-gray-100' : activeTab !== TABS.USERS})}
          onClick={() => setActiveTab(TABS.USERS)}
        > <UserIcon className="w-5 h-5" /> Users
        </a>
      </Link>
      <Link href={PRIVATE_PATHS.ADMIN_TEAMS} passHref>
        <a
          className={cx('flex items-center gap-x-3 px-5 my-1 py-5 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.TEAMS},
            {'hover:bg-gray-100' : activeTab !== TABS.TEAMS})}
          onClick={() => setActiveTab(TABS.TEAMS)}
        > <UserGroupIcon className="w-5 h-5" /> Teams </a>
      </Link>
      <Link href={PRIVATE_PATHS.ADMIN_PROJECTS} passHref>
        <a
          className={cx('flex items-center gap-x-3 px-5 my-1 py-5 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.PROJECTS},
            {'hover:bg-gray-100' : activeTab !== TABS.PROJECTS})}
          onClick={() => setActiveTab(TABS.PROJECTS)}
        > <PresentationChartBarIcon className="w-5 h-5" /> Projects </a>
      </Link>
      <Link href={PRIVATE_PATHS.ADMIN_EVENTS} passHref>
        <a
          className={cx('flex items-center gap-x-3 px-5 my-1 py-5 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.EVENTS},
            {'hover:bg-gray-100' : activeTab !== TABS.EVENTS})}
          onClick={() => setActiveTab(TABS.EVENTS)}
        > <CalendarIcon className="w-5 h-5" /> Events </a>
      </Link>
      <Link href="/" passHref>
        <a className="
          mt-auto py-2 px-5 text-white bg-indigo-600 hover:bg-indigo-700 transition
          w-full rounded mb-5 text-center font-medium cursor-pointer
          flex items-center justify-between"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to homepage
        </a>
      </Link>
    </nav>
  );
};

AdminMenu.displayName = 'AdminMenu';
AdminMenu.propTypes = {};

export default AdminMenu;
