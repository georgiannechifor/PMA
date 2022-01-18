import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {LogoutIcon} from '@heroicons/react/solid';
import {useRouter} from 'next/router';
import * as cx from 'classnames';

import {Modal} from './';

const Header = () => {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const getActiveHeaderTab = tab => router.route === tab;

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
        <Link href="/">
          <p
            className={cx(
              'text-md font-medium p-2 cursor-pointer text-gray-400 hover:text-gray-800 sm:p-4',
              {'text-black' : getActiveHeaderTab('/')}
            )}
          > Home </p>
        </Link>
        <Link href="/knowledge-sharing">
          <p
            className={cx(
              'text-md font-medium p-2 cursor-pointer text-gray-400 hover:text-gray-800 sm:p-4',
              {'text-black' : getActiveHeaderTab('/knowledge-sharing')}
            )}
          > Knowledge sharing  </p>
        </Link>
        <Link href="/deploy-tracker">
          <p
            className={cx(
              'text-md font-medium p-2 cursor-pointer text-gray-400 hover:text-gray-800 sm:p-4',
              {'text-black' : getActiveHeaderTab('/deploy-tracker')}
            )}
          > Deploy Tracker </p>
        </Link>


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
