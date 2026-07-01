// const AllPagination = ({
//   indexOfFirstItem,
//   indexOfLastItem,
//   totalResults,
//   handlePrevious,
//   currentPage,
//   handleNext,
//   totalPages,
//   onPageChange, // optional callback: (page) => void
// }) => {
//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   const goToPage = (target) => {
//     if (target === currentPage) return;
//     if (onPageChange) {
//       onPageChange(target);
//       return;
//     }

//     // Fallback: step using handleNext/handlePrevious if available.
//     if (handleNext && handlePrevious) {
//       const step = target > currentPage ? 1 : -1;
//       let steps = Math.abs(target - currentPage);
//       // call handlers with small delays to allow parent state updates
//       for (let i = 0; i < steps; i++) {
//         setTimeout(() => {
//           if (step === 1) handleNext();
//           else handlePrevious();
//         }, i * 60);
//       }
//     }
//   };

//   // Build compact page list with ellipses when totalPages is large
//   const getPageItems = () => {
//     const items = [];
//     if (totalPages <= 7) return pageNumbers;

//     items.push(1);

//     if (currentPage <= 4) {
//       for (let i = 2; i <= 5; i++) items.push(i);
//       items.push('...');
//     } else if (currentPage >= totalPages - 3) {
//       items.push('...');
//       for (let i = totalPages - 4; i < totalPages; i++) items.push(i);
//     } else {
//       items.push('...');
//       items.push(currentPage - 1);
//       items.push(currentPage);
//       items.push(currentPage + 1);
//       items.push('...');
//     }

//     items.push(totalPages);
//     return items;
//   };
//   return (
//     <div className="flex flex-col items-center justify-between gap-4 bg-white  sm:flex-row sm:items-center">
//       <div className="text-sm text-gray-400 ">
//         Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to
//         <span className="px-1 font-semibold">{Math.min(indexOfLastItem, totalResults)}</span>
//         of <span className="px-1 font-semibold">{totalResults}</span> results
//       </div>
//       <div className="flex items-center gap-2 sm:gap-3">
//         <button
//           onClick={handlePrevious}
//           disabled={currentPage === 1}
//           aria-disabled={currentPage === 1}
//           className={`border rounded px-3 py-1 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50`}
//         >
//           ‹ Previous
//         </button>

//         <div className="flex items-center gap-2">
//           {getPageItems().map((item, idx) =>
//             item === '...' ? (
//               <span key={`dots-${idx}`} className="px-2 text-sm text-gray-400">
//                 ...
//               </span>
//             ) : (
//               <button
//                 key={item}
//                 onClick={() => goToPage(item)}
//                 aria-current={currentPage === item ? 'page' : undefined}
//                 className={`w-9 h-9 inline-flex items-center justify-center rounded-md border text-sm font-medium ${currentPage === item
//                   ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
//                   : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
//                   }`}
//               >
//                 {item}
//               </button>
//             )
//           )}
//         </div>

//         <button
//           onClick={handleNext}
//           disabled={currentPage === totalPages || totalPages === 0}
//           aria-disabled={currentPage === totalPages || totalPages === 0}
//           className={`border rounded px-3 py-1 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50`}
//         >
//           Next ›
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AllPagination;







// const AllPagination = ({
//   indexOfFirstItem,
//   indexOfLastItem,
//   totalResults,
//   handlePrevious,
//   currentPage,
//   handleNext,
//   totalPages,
//   onPageChange,
// }) => {
//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   const goToPage = (target) => {
//     if (target === currentPage) return;
//     if (onPageChange) {
//       onPageChange(target);
//       return;
//     }

//     if (handleNext && handlePrevious) {
//       const step = target > currentPage ? 1 : -1;
//       let steps = Math.abs(target - currentPage);
//       for (let i = 0; i < steps; i++) {
//         setTimeout(() => {
//           if (step === 1) handleNext();
//           else handlePrevious();
//         }, i * 60);
//       }
//     }
//   };

//   const getPageItems = () => {
//     const items = [];
//     if (totalPages <= 7) return pageNumbers;

//     items.push(1);

//     if (currentPage <= 4) {
//       for (let i = 2; i <= 5; i++) items.push(i);
//       items.push("...");
//     } else if (currentPage >= totalPages - 3) {
//       items.push("...");
//       for (let i = totalPages - 4; i < totalPages; i++) items.push(i);
//     } else {
//       items.push("...");
//       items.push(currentPage - 1);
//       items.push(currentPage);
//       items.push(currentPage + 1);
//       items.push("...");
//     }

//     items.push(totalPages);
//     return items;
//   };

//   return (
//     // Change 1: Added w-full and padding for safe area
//     <div className="flex w-full flex-col items-center justify-between gap-4 bg-white px-2 py-2 sm:flex-row sm:items-center sm:px-4">

//       {/* Result Text */}
//       <div className="text-center text-sm text-gray-400 sm:text-left">
//         Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{" "}
//         <span className="px-1 font-semibold">
//           {Math.min(indexOfLastItem, totalResults)}
//         </span>
//         of <span className="px-1 font-semibold">{totalResults}</span> results
//       </div>

//       {/* Button Container */}
//       {/* Change 2: Added flex-wrap and justify-center to handle overflow on small screens */}
//       <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">

//         {/* Previous Button */}
//         <button
//           onClick={handlePrevious}
//           disabled={currentPage === 1}
//           aria-disabled={currentPage === 1}
//           className={`rounded border bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50`}
//         >
//           {/* Optional: Use symbol on very small screens if text is still too big */}
//           ‹ Previous
//         </button>

//         <div className="flex flex-wrap items-center justify-center gap-2">
//           {getPageItems().map((item, idx) =>
//             item === "..." ? (
//               <span key={`dots-${idx}`} className="px-1 text-sm text-gray-400">
//                 ...
//               </span>
//             ) : (
//               <button
//                 key={item}
//                 onClick={() => goToPage(item)}
//                 aria-current={currentPage === item ? "page" : undefined}
//                 // Change 3: Made buttons slightly smaller on mobile (w-8 h-8) and normal on sm (w-9 h-9)
//                 className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium sm:h-9 sm:w-9 ${
//                   currentPage === item
//                     ? "border-[#7C3AED] bg-[#7C3AED] text-white"
//                     : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 {item}
//               </button>
//             )
//           )}
//         </div>

//         {/* Next Button */}
//         <button
//           onClick={handleNext}
//           disabled={currentPage === totalPages || totalPages === 0}
//           aria-disabled={currentPage === totalPages || totalPages === 0}
//           className={`rounded border bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50`}
//         >
//           Next ›
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AllPagination;





import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

const AllPagination = ({
  indexOfFirstItem,
  indexOfLastItem,
  totalResults,
  handlePrevious,
  currentPage,
  handleNext,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const goToPage = (target) => {
    if (target === currentPage) return;
    if (onPageChange) {
      onPageChange(target);
      return;
    }

    if (handleNext && handlePrevious) {
      const step = target > currentPage ? 1 : -1;
      let steps = Math.abs(target - currentPage);
      for (let i = 0; i < steps; i++) {
        setTimeout(() => {
          if (step === 1) handleNext();
          else handlePrevious();
        }, i * 60);
      }
    }
  };

  const getPageItems = () => {
    const items = [];
    if (totalPages <= 7) return pageNumbers;

    items.push(1);

    if (currentPage <= 4) {
      for (let i = 2; i <= 5; i++) items.push(i);
      items.push('...');
    } else if (currentPage >= totalPages - 3) {
      items.push('...');
      for (let i = totalPages - 4; i < totalPages; i++) items.push(i);
    } else {
      items.push('...');
      items.push(currentPage - 1);
      items.push(currentPage);
      items.push(currentPage + 1);
      items.push('...');
    }

    items.push(totalPages);
    return items;
  };

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 bg-white dark:bg-zinc-800 px-2 py-3 sm:flex-row sm:px-4">
      {/* Result Text */}
      <div className="text-center text-[12px] text-gray-400 dark:text-white  sm:text-left">
        Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{" "}
        <span className="px-1 font-semibold">
          {Math.min(indexOfLastItem, totalResults)}
        </span>
        of <span className="px-1 font-semibold">{totalResults}</span> results
      </div>

      {/* Button Container - ONE LINE (flex-nowrap) */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">

        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-disabled={currentPage === 1}
          className="flex h-8 items-center justify-center rounded border px-2 text-[12px] font-medium bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-zinc-600 disabled:text-gray-400 dark:disabled:text-white sm:h-9 sm:px-3"
        >
          {/* Mobile: Show Icon Only */}
          <span className="sm:hidden"> <ChevronLeft /></span>

          {/* Desktop: Show Text */}
          <span className="hidden sm:inline-flex sm:items-center sm:gap-1"><ChevronLeft className="h-4 w-4" /> Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 sm:gap-2">
          {getPageItems().map((item, idx) =>
            item === "..." ? (
              <span key={`dots-${idx}`} className="px-1 text-[12px] text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => goToPage(item)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-[12px] font-medium sm:h-9 sm:w-9 ${currentPage === item
                  ? "border-[#7C3AED] bg-[#7C3AED] text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-disabled={currentPage === totalPages || totalPages === 0}
          className="flex h-8 items-center justify-center rounded border px-2 text-[12px] font-medium bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-zinc-600 disabled:text-gray-400 dark:disabled:text-white sm:h-9 sm:px-3"
        >
          {/* Mobile: Show Icon Only */}
          <span className="sm:hidden"> <ChevronRight /></span>

          {/* Desktop: Show Text */}
          <span className="hidden sm:inline-flex sm:items-center sm:gap-1">Next <ChevronRight className="h-4 w-4" /></span>
        </button>
      </div>
    </div>
  );
};

export default AllPagination;