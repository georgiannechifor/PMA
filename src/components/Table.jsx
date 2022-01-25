import {array, func} from 'prop-types';
import map from 'lodash/map';

const Table = ({
  data,
  columns,
  onRowClick
}) => {
  const getRowColumnValue = (rowItem, key) => {
    const keys = key.split('.');

    let item = rowItem;

    for (let keyValue of keys) {
      item = item[keyValue];
    }

    return item;
  };

  return (
    <>
      <table className="w-5/6 mx-auto table-auto">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
            {
              map(columns, column => (
                <th className="px-16 py-2 text-left">
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
                className="bg-white cursor-pointer hover:bg-gray-50"
                key={item._id} // eslint-disable-line no-underscore-dangle
                onClick={() => onRowClick(item)}
              >
                {
                  map(columns, rowColumn => (
                    <td className="px-16 py-2 text-left">
                      <span>{ getRowColumnValue(item, rowColumn.key) || <span className="italic"> No value </span>}</span>
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
  columns    : array.isRequired
};

export default Table;
