import {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {bool, string, oneOfType, object, elementType, func} from 'prop-types';

const Modal = ({
  isModalOpen,
  setIsModalOpen,
  modalTitle,
  modalContent,
  modalActions
}) => (
  <Transition
    appear
    as={Fragment}
    show={isModalOpen}
  >
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
      onClose={() => setIsModalOpen(false)}
    >
      <div className="min-h-screen px-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0" />
        </Transition.Child>

        <span
          aria-hidden="true"
          className="inline-block h-screen align-middle"
        >
          &#8203;
        </span>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              { modalTitle }
            </Dialog.Title>
            <div className="mt-2">
              <div className="text-sm">
                { modalContent }
              </div>
            </div>

            <div className="mt-4">
              { modalActions }
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
);

Modal.displayName = 'CustomModal';
Modal.propTypes = {
  isModalOpen    : bool.isRequired,
  modalTitle     : string.isRequired,
  modalContent   : oneOfType([object, elementType]).isRequired,
  modalActions   : oneOfType([object, elementType]).isRequired,
  setIsModalOpen : func.isRequired
};
export default Modal;
