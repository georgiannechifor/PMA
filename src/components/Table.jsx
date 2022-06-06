import {array, func} from 'prop-types';
import classnames from 'classnames';
import map from 'lodash/map';
import moment from 'moment';

const Table = ({
  data,
  columns,
  onRowClick,
  onEdit,
  onDeleteItem,
  isDisabled,
  conditionForBold
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
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-md sm:rounded-lg overflow-y-hidden min-h-full bg-white">
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  {
                    map(columns, column => (
                      <th
                        className="py-3 px-6 text-xs tracking-wider text-left uppercase text-gray-400"
                        key={column.key}
                        scope="col"
                      >
                        <span> { column.title } </span>
                      </th>
                    ))
                  }
                  <th className="py-3 px-6 text-xs tracking-wider text-center uppercase text-gray-400 relative" colSpan={2} scope="col">
                    <span className="">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {
                  data &&
                  data.length &&
                  map(data, item => (
                    <tr
                      className={classnames(
                        'bg-white border-b  hover:bg-gray-50',
                        {'pointer-events-none bg-gray-100 text-gray-400' : isDisabled(item)}
                      )}
                      key={item._id} // eslint-disable-line no-underscore-dangle
                      onClick={() => onRowClick(item)}
                    >
                      {
                        map(columns, (rowColumn, index) => (

                          <td
                            className={
                              classnames('py-4 px-6 text-sm font-medium text-gray-400 whitespace-nowrap', {
                                'text-gray-900' : conditionForBold(index)
                              })
                              // eslint-disable-next-line no-underscore-dangle
                            } key={`${item._id}-${rowColumn.key}`}
                          >
                            <span>{ rowColumn.isDate ? moment(getRowColumnValue(item, rowColumn.key))
                              .format(rowColumn.options) : getRowColumnValue(item, rowColumn.key) ||
                                <span className="italic"> No value </span>}
                            </span>
                          </td>
                        ))
                      }
                      <td className="py-4 text-sm font-medium text-right whitespace-nowrap">
                        <a className="text-indigo-600 hover:text-indigo-400 transition" href="#" onClick={() => onEdit(item)}>Edit</a>
                      </td>
                      <td className="py-4 pr-8 text-sm font-medium text-right whitespace-nowrap">
                        <a className="text-red-600 hover:text-red-400 transition" href="#" onClick={() => onDeleteItem(item)}>Delete</a>
                      </td>
                    </tr>
                  )) || (
                    <tr className="bg-white cursor-pointer hover:bg-gray-50 col-span-auto">
                      <td className="text-center text-gray-400 italic" colSpan={columns.length}> <p> No items to be displayed </p> </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

Table.displayName = 'Table';
Table.propTypes = {
  onRowClick       : func,
  onEdit           : func.isRequired,
  onDeleteItem     : func.isRequired,
  data             : array.isRequired,
  columns          : array.isRequired,
  isDisabled       : func,
  conditionForBold : func
};

Table.defaultProps = {
  onRowClick       : () => null,
  isDisabled       : () => false,
  conditionForBold : index => parseInt(index, 10) === 0
};

export default Table;
