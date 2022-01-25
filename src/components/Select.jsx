import {Fragment} from 'react';
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, SelectorIcon} from '@heroicons/react/solid';
import {array, func, object, string} from 'prop-types';

const Select = ({
  errorClassname,
  options,
  value,
  onChange
}) => (
  <div>
    <Listbox onChange={onChange} value={value || options[0]}>
      <div className="relative mt-1">
        <Listbox.Button
          className={`relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg
            border border-gray-400 cursor-default sm:text-sm ${errorClassname}`}
        >
          <span className="block truncate">{value.name || 'Select a team admin'}</span>
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
            className="absolute w-full py-1 mt-1 overflow-auto
              text-base bg-white rounded-md shadow-lg max-h-60 sm:text-sm"
          >
            {options.map(option => (
              <Listbox.Option
                className={({active}) =>
                  `${active ? 'text-gray-900 bg-gray-50' : 'text-gray-600'}
                          cursor-default select-none relative py-2 pl-10 pr-4`
                }
                key={option.value}
                value={option}
              >
                {({selected, active}) => (
                  <>
                    <span
                      className={`${
                        selected ? 'font-medium' : 'font-normal'
                      } block truncate`}
                    >
                      {option.name}
                    </span>
                    {selected ? (
                      <span
                        className={`${
                          active ? 'text-gray-600' : 'text-gray-600'
                        }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                      >
                        <CheckIcon aria-hidden="true" className="w-5 h-5" />
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
  value          : object.isRequired,
  onChange       : func.isRequired,
  errorClassname : string
};

Select.defaultProps = {
  errorClassname : ''
};

export default Select;
