import {array, func} from 'prop-types';
import classnames from 'classnames';
import map from 'lodash/map';
import moment from 'moment';

const Table = ({
  data,
  columns,
  onRowClick,
  isDisabled
}) => {
  const getRowColumnValue = (rowItem, key) => {
    const keys = key.split('.');

    let item = rowItem;

    for (let keyValue of keys) {
      item = item && item[keyValue] || '';
    }

    return item;
  };

  return (
    <>
      <table className="w-5/6 mx-auto table-auto shadow">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
            {
              map(columns, column => (
                <th className="px-16 py-2 text-left" key={column.key}>
                  <span className="text-gray-100 font-medium"> { column.title } </span>
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody className="bg-gray-200">
          {
            data &&
            data.length &&
            map(data, item => (
              <tr
                className={classnames(
                  'bg-white cursor-pointer hover:bg-gray-50',
                  {'pointer-events-none bg-gray-100 text-gray-400' : isDisabled(item)}
                )}
                key={item._id} // eslint-disable-line no-underscore-dangle
                onClick={() => onRowClick(item)}
              >
                {
                  map(columns, rowColumn => (
                    // eslint-disable-next-line no-underscore-dangle
                    <td className="px-16 py-2 text-left" key={`${item._id}-${rowColumn.key}`}>
                      <span>{ rowColumn.isDate ? moment(getRowColumnValue(item, rowColumn.key))
                        .format(rowColumn.options) : getRowColumnValue(item, rowColumn.key) ||
                          <span className="italic"> No value </span>}
                      </span>
                    </td>
                  ))
                }
              </tr>
            )) || (
              <tr className="bg-white cursor-pointer hover:bg-gray-50 col-span-auto">
                <td className="text-center text-gray-400 italic" colSpan={columns.length}> <p> No items to be displayed </p> </td>
              </tr>
            )
          }
        </tbody>

      </table>
    </>
  );
};

Table.displayName = 'Table';
Table.propTypes = {
  onRowClick : func.isRequired,
  data       : array.isRequired,
  columns    : array.isRequired,
  isDisabled : func
};

Table.defaultProps = {
  isDisabled : () => false
};

export default Table;
