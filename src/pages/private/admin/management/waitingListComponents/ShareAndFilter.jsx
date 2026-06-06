import { Search, Download } from 'lucide-react';

const ShareAndFilter = ({
  totalResults,
  searchTerm,
  setSearchTerm,
  onExportCSV,
}) => {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-gray-50 dark:border-gray-700 p-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Waiting List Directory</h1>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-200">Total Users Found: {totalResults}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
          <input
            placeholder="Search Users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-52 rounded-lg border border-gray-200   py-3 pr-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent md:w-64 dark:placeholder:text-gray-300 dark:bg-zinc-800 dark:border-gray-400 dark:text-white"
          />
        </div>
        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 rounded-lg   border border-gray-200 px-4 py-3 text-sm font-medium text-white transition-all  0 dark:text-white "
        >
          <Download className="h-4 w-4 text-black dark:text-white" />
          <span className="hidden sm:inline text-black dark:text-white">Export CSV</span>
        </button>
      </div>
    </div>
  );
};

export default ShareAndFilter;
