import {useState, useEffect} from 'react';
import Link from 'next/link';
import * as cx from 'classnames';
import {ArrowLeftIcon} from '@heroicons/react/outline';

const TABS = {
  USERS    : 'users',
  TEAMS    : 'teams',
  PROJECTS : 'projects',
  EVENTS   : 'events'
};

const AdminMenu = () => {
  const [activeTab, setActiveTab] = useState(TABS.USERS);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Just trigger this so that the initial state
    // Is updated as soon as the component is mounted
    // Related: https://stackoverflow.com/a/63408216
    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div
      className={cx('fixed w-60 shadow-xl bg-gray-50')}
      // eslint-disable-next-line no-magic-numbers
      style={scrollY < 96 ? {
        top    : `calc(6rem - ${scrollY}px)`,
        height : `calc((100vh - 6rem) + ${scrollY}px)`
      } : {top    : 0,
        height : '100vh'}}
    >
      <div className="h-full flex flex-col items-start justify-center p-2 mt-3">
        <p
          className={cx('px-5 my-1 py-3 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.USERS},
            {'hover:bg-gray-100' : activeTab !== TABS.USERS})}
          onClick={() => setActiveTab(TABS.USERS)}
        > Users </p>
        <p
          className={cx('px-5 my-1 py-3 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.TEAMS},
            {'hover:bg-gray-100' : activeTab !== TABS.TEAMS})}
          onClick={() => setActiveTab(TABS.TEAMS)}
        > Teams </p>
        <p
          className={cx('px-5 my-1 py-3 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.PROJECTS},
            {'hover:bg-gray-100' : activeTab !== TABS.PROJECTS})}
          onClick={() => setActiveTab(TABS.PROJECTS)}
        > Projects </p>
        <p
          className={cx('px-5 my-1 py-3 text-gray-500 font-medium w-full cursor-pointer hover:text-gray-800 rounded',
            {'text-gray-800 bg-gray-200' : activeTab === TABS.EVENTS},
            {'hover:bg-gray-100' : activeTab !== TABS.EVENTS})}
          onClick={() => setActiveTab(TABS.EVENTS)}
        > Events </p>


        <Link href="/">
          <p className="mt-auto py-2 px-5 text-white bg-blue-500 w-full rounded mb-5 text-center font-medium cursor-pointer flex items-center justify-between">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to homepage
          </p>
        </Link>

      </div>
    </div>
  );
};

AdminMenu.displayName = 'AdminMenu';
AdminMenu.propTypes = {};

export default AdminMenu;
