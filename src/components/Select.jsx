import Select from 'react-select';
import {array, func, object, string, bool, oneOfType} from 'prop-types';

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
  options        : array,
  selected       : oneOfType([object, string]),
  setSelected    : func.isRequired,
  errorClassname : string,
  placeholder    : string,
  multiple       : bool, // eslint-disable-line
  disabled       : bool // eslint-disable-line
};

CustomSelect.defaultProps = {
  options        : [],
  errorClassname : '',
  placeholder    : '',
  disabled       : false,
  multiple       : false,
  selected       : null
};

export default CustomSelect;
