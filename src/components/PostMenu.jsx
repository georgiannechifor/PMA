import {Fragment} from 'react';
import {Menu, Transition} from '@headlessui/react';
import {func} from 'prop-types';
import {AdjustmentsIcon, PencilIcon, TrashIcon} from '@heroicons/react/solid';

const PostMenu = ({
  setActiveItem
}) => (
  <div className="text-left">
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="
          inline-flex justify-center w-full px-4 py-2 text-sm font-medium
          text-white rounded-md focus:outline-none
          focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <AdjustmentsIcon className="w-6 h-6 text-gray-500" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 w-56 mt-2 origin-top-right bg-white
          divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black
          ring-opacity-5 focus:outline-none"
        >
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({active}) => (
                <button
                  className={`${
                    active ? 'bg-gray-300 text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  onClick={() => setActiveItem('edit')}
                >
                  {active ? (
                    <PencilIcon
                      aria-hidden="true"
                      className="w-5 h-5 mr-2"
                    />
                  ) : (
                    <PencilIcon
                      aria-hidden="true"
                      className="w-5 h-5 mr-2"
                    />
                  )}
                  Edit
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({active}) => (
                <button
                  className={`${
                    active ? 'bg-gray-300 text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  onClick={() => setActiveItem('delete')}
                >
                  {active ? (
                    <TrashIcon
                      aria-hidden="true"
                      className="w-5 h-5 mr-2"
                    />
                  ) : (
                    <TrashIcon
                      aria-hidden="true"
                      className="w-5 h-5 mr-2"
                    />
                  )}
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  </div>
);

PostMenu.displayName = 'PostMenu';
PostMenu.propTypes = {
  setActiveItem : func.isRequired
};
export default PostMenu;
