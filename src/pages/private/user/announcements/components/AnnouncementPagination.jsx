import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const AnnouncementPagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const activePage = Math.min(currentPage, Math.max(1, totalPages));

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (activePage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (activePage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', activePage, '...', totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 mb-7.5 md:mb-0 pb-7.5 md:pb-0 flex w-full items-center justify-center gap-4 pt-4 dark:border-zinc-700">
      {/* Button Container */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* First Page Button (<<) */}
        <button
          onClick={() => setCurrentPage(1)}
          disabled={activePage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f2f2f2] bg-white text-[#5d5d5d] transition-all hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="First Page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous Button (<) */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={activePage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f2f2f2] bg-white text-[#5d5d5d] transition-all hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span
                key={`dots-${idx}`}
                className="inline-flex h-9 w-9 items-center justify-center text-sm font-medium text-[#c2c2c2] dark:text-zinc-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                  activePage === page
                    ? 'bg-[#8022fe] text-white shadow-sm shadow-[#8022fe]/20'
                    : 'border border-[#f2f2f2] bg-white text-[#5d5d5d] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next Button (>) */}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={activePage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f2f2f2] bg-white text-[#5d5d5d] transition-all hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last Page Button (>>) */}
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={activePage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f2f2f2] bg-white text-[#5d5d5d] transition-all hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Last Page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementPagination;
