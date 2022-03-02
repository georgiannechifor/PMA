import {Fragment} from 'react';
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, SelectorIcon} from '@heroicons/react/solid';
import {array, func, object, string, boolean} from 'prop-types';

const Select = ({
  errorClassname,
  options,
  selected,
  setSelected,
  placeholder,
  disabled
}) => (
  <div>
    <Listbox onChange={setSelected} value={selected}>
      <div className="relative mt-1">
        <Listbox.Button
          className={`relative w-full py-2 pl-3 pr-10 text-left ${disabled ? 'bg-gray-200' : 'bg-white'} rounded-lg
            border border-gray-400 cursor-default sm:text-sm ${errorClassname}`}
        >
          <span className="block truncate">{selected?.name || placeholder}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon
              aria-hidden="true"
              className="w-5 h-5 text-gray-400"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="z-50 absolute w-full py-1 mt-1 overflow-auto
              text-base bg-white rounded-md shadow-lg max-h-60 sm:text-sm"
          >
            {options.map((option, optionIdx) => (
              <Listbox.Option
                className={({active}) =>
                  `${active ? 'text-gray-600 bg-gray-50' : 'text-gray-400'}
                          cursor-pointer select-none relative py-2 pl-10 pr-4`
                }
                key={optionIdx.toString()} // eslint-disable-line
                value={option}
              >
                {({active}) => (
                  <>
                    <span
                      className={`${
                        active ? 'font-medium' : 'font-normal'
                      } block truncate`}
                    >
                      {option.name}
                    </span>
                    {selected.name === option.name ? (
                      <span
                        className={`${active ? 'text-gray-600' : 'text-gray-400'}
                        absolute inset-y-0 left-0 flex items-center pl-3`}
                      >
                        <CheckIcon aria-hidden="true" className="w-5 w-5" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  </div>
);

Select.displayName = 'Select';
Select.propTypes = {
  options        : array.isRequired,
  selected       : object.isRequired,
  setSelected    : func.isRequired,
  errorClassname : string,
  placeholder    : string,
  disabled       : boolean
};

Select.defaultProps = {
  errorClassname : '',
  placeholder    : '',
  disabled       : false
};

export default Select;
