import { useMemo } from 'react';
const range = (start, end) => {
  let length = end - start + 1;

  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */

  return Array.from({length}, (_, idx) => idx + start);
};

/*
CASE 1: if we can show all the pages
CASE 2: display dots on the right side
CASE 3: display dots on the left side
CASE 4: display dots on both sides
*/

export const DOTS = "...";

export const usePagination = ({totalCount, pageSize, siblingCount = 1, currentPage}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);
    const totalPageNumbers = siblingCount + 5;

    /* CASE 1 */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /* CASE 2 */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /* CASE 3 */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);

      return [firstPageIndex, DOTS, ...rightRange];
    }

    /* CASE 4 */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);

      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
