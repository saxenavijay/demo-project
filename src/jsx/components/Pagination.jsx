// import React, { useCallback, useEffect, useState } from "react";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

const Pagination = ({
  maxPage,
  page,
  pageSize,
  pageSizes,
  handlePageChange,
  handlePageSizeChange,
}) => {
  const filterPages = useCallback(
    (visiblePages, totalPages) => {
      return visiblePages.filter((page) => page <= pageSize);
    },
    [pageSize]
  );

  /**
   * handle visible pages
   */


   function* generateRange(start, end, step = 1) {
    let current = start;
    while (start < end ? current <= end : current >= end) {
        yield current;
        current = start < end ? current + step : current - step;
    }
}

function getRange(start, end, step = 1) {
    return [...generateRange(start, end, step)];
}



  const getVisiblePages = useCallback(
    //var maxPage

    (page, total) => {
      //const total = pageSize;

      console.log("page - " + page + ", pageSize - " + total);

      if (total < 7) {
        //return filterPages([1, 2, 3, 4, 5, 6], total);
        return filterPages(getRange(1,total), total);
      } else {
        if (page % 5 >= 0 && page > 4 && page + 2 < total) {
          return [1, page - 1, page, page + 1, total];
        } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
          return [1, total - 3, total - 2, total - 1, total];
        } else {
          return [1, 2, 3, 4, 5, total];
        }

        /*         if (page % 5 >= 0 && page > 4 && page + 2 < total) {
          return [1, page - 1, page, page + 1, total];
        } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
          return [1, total - 3, total - 2, total - 1, total];
        } else {
          return [1, 2, 3, 4, 5, total];
        } */
      }
    },
    [filterPages]
  );

  /**
   * handle page change
   * @param page - current page
   * @returns
   */
  const changePage = (page) => {
    const activePage = page + 1;

    if (page === activePage) {
      return;
    }

    const visiblePages = getVisiblePages(page, pageSize);
    setVisiblePages(filterPages(visiblePages, pageSize));
    handlePageChange(page);
  };

  /* useEffect(() => {
    const visiblePages = getVisiblePages(null, pageSize);
    setVisiblePages(visiblePages);
  }, [pageSize, getVisiblePages]); */

  const [visiblePages, setVisiblePages] = useState(
    getVisiblePages(page, maxPage)
  );
  const activePage = page + 1;

  return (
    <>
      <div className="d-lg-flex align-items-center text-center pb-1 mt-4">
        {pageSizes.length > 0 && (
          <div className="d-inline-block mr-3">
            <label className="mr-3">Display : </label>
            <select
              value={pageSize}
              onChange={(e) => {
                //setPageCount(Number(e.target.value));
                handlePageSizeChange(Number(e.target.value));
              }}
              className="form-select d-inline-block w-auto form-control"
            >
              {(pageSizes || []).map((pageSize, index) => {
                return (
                  <option key={index} value={pageSize}>
                    {pageSize}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        <span className="me-3">
          Page{" "}
          <strong>
            {page + 1} of {maxPage}
          </strong>{" "}
        </span>

        <span className="d-inline-block align-items-center text-sm-start text-center my-sm-0 my-2">
          <label className="mr-3">Go to page : </label>
          <input
            type="number"
            value={page + 1}
            min="1"
            max={maxPage}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              //setPageIndex(page);
              //handlePageChange(page)
              changePage(page);
            }}
            className="form-select form-control w-25 ms-1 d-inline-block form-control"
          />
        </span>

        <ul className="pagination2 pagination-rounded d-inline-flex ml-auto">
          <li
            className="page-item page-indicator "
            onClick={() => {
              console.log("activePage - " + activePage + ", page - " + page);
              if (activePage === 1) return;
              changePage(page - 1);
            }}
          >
            <Link className="page-link" to="#">
              <i className="la la-angle-left" />
            </Link>
          </li>

          {(visiblePages || []).map((page, index, array) => {
            return array[index - 1] + 1 < page ? (
              <React.Fragment key={page}>
                <li className="page-item disabled d-none d-xl-inline-block">
                  <Link to="#" className="page-link">
                    ...
                  </Link>
                </li>
                <li
                  className={classNames(
                    "page-item",
                    "d-none",
                    "d-xl-inline-block",
                    {
                      active: activePage === page,
                    }
                  )}
                  onClick={(e) => changePage(page - 1)}
                >
                  <Link to="#" className="page-link">
                    {page}
                  </Link>
                </li>
              </React.Fragment>
            ) : (
              <li
                key={page}
                className={classNames(
                  "page-item",
                  "d-none",
                  "d-xl-inline-block",
                  {
                    active: activePage === page,
                  }
                )}
                onClick={(e) => {
                  changePage(page - 1);
                  console.log(
                    "activePage - " + activePage + ", page - " + page
                  );
                }}
              >
                <Link to="#" className="page-link">
                  {page}
                </Link>
              </li>
            );
          })}

          <li
            className="page-item page-indicator"
            onClick={() => {
              if (activePage === maxPage) return;
              changePage(activePage);
            }}
          >
            <Link className="page-link" to="#">
              <i className="la la-angle-right" />
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Pagination;
