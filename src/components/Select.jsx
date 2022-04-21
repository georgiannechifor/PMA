import Select from 'react-select';
import {array, func, object, string, boolean} from 'prop-types';

const CustomSelect = ({
  errorClassname,
  options,
  selected,
  setSelected,
  multiple,
  placeholder,
  disabled
}) => (
  <Select
    className={errorClassname}
    classNamePrefix="select"
    closeMenuOnSelect={!multiple}
    isDisabled={disabled}
    isMulti={multiple}
    onChange={setSelected}
    options={options}
    placeholder={placeholder}
    value={selected}
  />
);

CustomSelect.displayName = 'Select';
CustomSelect.propTypes = {
  options        : array.isRequired,
  selected       : object.isRequired,
  setSelected    : func.isRequired,
  errorClassname : string,
  placeholder    : string,
  multiple       : boolean,
  disabled       : boolean
};

CustomSelect.defaultProps = {
  errorClassname : '',
  placeholder    : '',
  disabled       : false,
  multiple       : false
};

export default CustomSelect;
