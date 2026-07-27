import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./EnquiryPagination.css";

/**
 * EnquiryPagination
 *
 * Footer strip under the Enquiries table: "Showing X-Y candidates out
 * of Z" on the left, prev/next arrows + current page + last page on
 * the right (matches the "< 2 ... 60 >" control in the design).
 * Fully controlled — the parent <Enquiry> page owns `currentPage` and
 * passes `onPrev`/`onNext`, so this component has no fetching logic of
 * its own.
 *
 * Props:
 *  - rangeStart, rangeEnd, total: number  -> "Showing X-Y ... out of Z" copy
 *  - currentPage, lastPage: number
 *  - onPrev, onNext: function()
 */
const EnquiryPagination = ({
  rangeStart = 1,
  rangeEnd = 1,
  total = 0,
  currentPage = 1,
  lastPage = 1,
  onPrev,
  onNext,
}) => {
  return (
    <div className="enquiry-pagination">
      <p className="enquiry-pagination__summary">
        Showing {rangeStart}-{rangeEnd} candidates out of {total}
      </p>

      <div className="enquiry-pagination__controls">
        <button
          type="button"
          className="enquiry-pagination__arrow"
          onClick={onPrev}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="enquiry-pagination__page enquiry-pagination__page--active">
          {currentPage}
        </span>
        <span className="enquiry-pagination__ellipsis">...</span>
        <span className="enquiry-pagination__page">{lastPage}</span>

        <button
          type="button"
          className="enquiry-pagination__arrow"
          onClick={onNext}
          disabled={currentPage >= lastPage}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default EnquiryPagination;
