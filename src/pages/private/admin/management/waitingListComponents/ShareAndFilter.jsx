import { Search, Download } from 'lucide-react';

const ShareAndFilter = ({
  totalResults,
  searchTerm,
  setSearchTerm,
  onExportCSV,
}) => {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-[#f2f2f2] dark:border-zinc-700 px-6 py-3.5 bg-white dark:bg-zinc-800 md:flex-row md:items-center">
      <div>
        <h1 className="text-[16px] font-medium text-[#181818] dark:text-white">Waiting List Directory</h1>
        <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Total Users Found: {totalResults}</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex w-full items-center gap-[6px] rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] px-3.5 py-1.75 md:w-64 dark:border-zinc-700 dark:bg-zinc-800">
          <Search size={14} className="shrink-0 text-[#5d5d5d] dark:text-gray-300" />
          <input
            placeholder="Search Users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-[12px] font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] dark:text-white"
          />
        </div>

        {/* Export CSV */}
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-1.75 text-[12px] font-semibold text-[#5d5d5d] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
        >
          <Download size={14} className="shrink-0 text-[#5d5d5d] dark:text-gray-300" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};

export default ShareAndFilter;
