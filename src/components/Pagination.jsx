import React from 'react';
import {usePagination, DOTS} from 'utils/usePagination';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/outline';
import {number} from 'prop-types';
import * as classNames from 'classnames';

const Pagination = ({onPageChange, totalCount, currentPage, pageSize, siblingCount}) => {
  const paginationRange = usePagination({currentPage,
    totalCount,
    siblingCount,
    pageSize});

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    currentPage < lastPage ? onPageChange(currentPage + 1) : null;
  };

  const onPrevious = () => {
    currentPage > 1 ? onPageChange(currentPage - 1) : null;
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="w-full justify-center flex items-center my-5">
      <ChevronLeftIcon
        className={classNames('cursor-pointer w-6 mx-5 h-6 text-gray-500', {
          'cursor-auto text-gray-300' : currentPage === 1
        })}
        onClick={() => onPrevious()}
      />
      {paginationRange.map(index => {
        if (index === DOTS) {
          return <div> &#8230;</div>;
        }

        return (
          <div
            className={classNames('select-none cursor-pointer hover:bg-gray-300 w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full mx-2', {
              'bg-gray-600 text-white' : currentPage === index
            })}
            onClick={() => onPageChange(index)}
          >
            {index}
          </div>
        );
      })}
      <ChevronRightIcon
        className={classNames('cursor-pointer w-6 mx-5 h-6 text-gray-500', {
          'cursor-auto text-gray-300' : currentPage === lastPage
        })}
        onClick={() => onNext()}
      />
    </div>
  );
};

Pagination.displayName = 'Pagination';
Pagination.propTypes = {
  totalCount   : number.isRequired,
  currentPage  : number.isRequired,
  pageSize     : number,
  siblingCount : number
};
Pagination.defaultProps = {
  pageSize     : 10,
  siblingCount : 1
};

export default Pagination;
