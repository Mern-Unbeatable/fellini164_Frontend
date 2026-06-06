import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Download, Search } from 'lucide-react';
import AllPagination from '../../../../../components/common/AllPagination';

const MobileCard = ({
  user,
  index,
  getInitials,
  getAvatarColor,
  getPlanColor,
  getStatusColor,
  getStatusDot,
  onManage,
}) => (
  <div className="mb-3 rounded-lg border border-gray-200 bg-white dark:bg-zinc-800 p-4 shadow-sm">
    {/* User Info */}
    <div className="mb-4 flex items-center gap-3">
      <div
        className={`h-12 w-12 rounded-full ${getAvatarColor(
          index
        )} flex items-center justify-center text-sm font-semibold text-gray-700`}
      >
        {getInitials(user.name)}
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-200">{user.email}</div>
      </div>
    </div>

    {/* Details Grid */}
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase dark:text-gray-200">Plan</span>
        <span
          className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${getPlanColor(user.plan)}`}
        >
          {user.plan}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase dark:text-gray-200">Status</span>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(user.status)}`}
        >
          <span className={`h-2 w-2 rounded-full ${getStatusDot(user.status)}`} />
          {user.status}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase dark:text-gray-200">Joined</span>
        <span className="text-sm text-gray-700 dark:text-gray-200">{user.joined}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase dark:text-gray-200">Last Active</span>
        <span className="text-sm text-gray-700 dark:text-gray-200">{user.lastActive}</span>
      </div>
    </div>

    {/* Action Button */}
    <button
      onClick={() => onManage(user.id)}
      className="w-full rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-[#7C46EE] transition hover:bg-blue-100"
    >
      Manage
    </button>
  </div>
);

const TableHeader = () => (
  <thead>
    <tr className="h-8 border-b border-[#E0E5ED] dark:border-gray-400 bg-[#F8FBFE] dark:bg-zinc-700">
      <th className="px-6 py-3 text-left text-sm font-medium text-[#666B74] uppercase dark:text-white
      ">User</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-[#666B74] uppercase dark:text-white">Plan</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-[#666B74] uppercase dark:text-white">Status</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-[#666B74] uppercase dark:text-white">Joined</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-[#666B74] uppercase dark:text-white">
        Last Active
      </th>
      <th className="px-6 py-3 text-left text-sm font-medium text-[#666B74] uppercase dark:text-white">Actions</th>
    </tr>
  </thead>
);

// Status filter using native <select>
const StatusFilterDropdown = ({ value, onChange }) => {
  const options = ['All Status', 'Waitlist', 'Invited', 'Active', 'Unsubscribe'];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg appearance-none border border-[#9CA3AF] bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-[#111827] dark:text-white focus:outline-none md:px-4"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-center">
            {opt}
          </option>
        ))}
         <ChevronDown
            size={18}
            className=" text-gray-400 dark:text-white"
          />
      </select>
    </div>
  );
};
  
const UserRow = ({
  user,
  index,
  getInitials,
  getAvatarColor,
  getPlanColor,
  getStatusColor,
  getStatusDot,
  onManage,
}) => (
  <tr className="border-b border-gray-200 dark:border-gray-400 transition hover:bg-gray-50 dark:hover:bg-zinc-700">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-full ${getAvatarColor(
            index
          )} flex items-center justify-center text-sm font-semibold text-gray-700`}
        >
          {getInitials(user.name)}
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
          <div className="text-sm text-gray-500  dark:text-white/90">{user.email}</div>
        </div>
      </div>
    </td>

    <td className="px-6 py-4">
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPlanColor(user.plan)}`}
      >
        {user.plan}
      </span>
    </td>

    <td className="px-6 py-4">
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(user.status)}`}
      >
        <span className={`h-2 w-2 rounded-full ${getStatusDot(user.status)}`} />
        {user.status}
      </span>
    </td>

    <td className="px-6 py-4 text-sm text-gray-700 dark:text-white">{user.joined}</td>
    <td className="px-6 py-4 text-sm text-gray-700 dark:text-white">{user.lastActive}</td>

    <td className="px-6 py-4">
      <button onClick={() => onManage(user.id)} className="text-sm font-medium text-[#7C46EE] dark:text-violet-400">
        Manage
      </button>
    </td>
  </tr>
);

const UserTable = ({
  users,
  loading,
  error,
  searchTerm,
  onSearchChange,
  onExportCSV,
  getPlanColor,
  getStatusColor,
  getStatusDot,
}) => {
  const navigate = useNavigate();

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const getAvatarColor = () => 'bg-purple-200';
  const [statusFilter, setStatusFilter] = useState('All Status');

  const statusLabelToInternal = (label) => {
    const map = {
      Waitlist: 'Inactive',
      Invited: 'Active',
      Active: 'Active',
      Unsubscribe: 'Suspended',
    };
    return map[label] || null;
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((u) => {
        const matchesText =
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesText) return false;

        if (statusFilter && statusFilter !== 'All Status') {
          const internal = statusLabelToInternal(statusFilter);
          if (internal) return u.status === internal;
          return true;
        }

        return true;
      }),
    [users, searchTerm, statusFilter]
  );

  // Pagination (client-side): 6 items per page
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalResults = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE));

  useEffect(() => {
    // reset page when search or status filter changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(indexOfFirstItem, indexOfFirstItem + ITEMS_PER_PAGE);

  return (
    <div className="w-full p-4 md:p-8">
      <div className="rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <p className="mt-3 text-sm text-gray-500">Loading users...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              <p className="font-medium">⚠️ {error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Header */}
            <div className="flex flex-col gap-3 rounded-t-lg border-b border-gray-200 bg-[#FCFCFD] dark:bg-zinc-800 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
              <div className="relative w-full md:w-64">
                <Search size={18} className="absolute top-2.5 left-3 text-[#9CA3AF] dark:text-white" />
                <input
                  type="text"
                  placeholder="Search Users"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full rounded-lg dark:text-white border border-[#9CA3AF] py-2 pr-4 pl-10 text-sm focus:outline-0 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                {/* Status filter dropdown (matches image) */}
                <StatusFilterDropdown
                  onChange={(val) => setStatusFilter(val)}
                  value={statusFilter}
                />

                <button
                  onClick={onExportCSV}
                  className="flex items-center gap-1 rounded-lg border border-[#9CA3AF] px-3 py-2 text-xs font-medium text-[#000000] dark:text-white  hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 md:gap-2 md:px-4 md:text-sm"
                >
                  <Download size={14} className="md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">CSV</span>
                </button>
              </div>
            </div>

            {/* Mobile & Tablet Card View (hidden on lg and up) */}
            <div className="p-4 lg:hidden">
              {paginatedUsers.map((user, index) => (
                <MobileCard
                  key={user.id}
                  user={user}
                  index={index}
                  getInitials={getInitials}
                  getAvatarColor={getAvatarColor}
                  getPlanColor={getPlanColor}
                  getStatusColor={getStatusColor}
                  getStatusDot={getStatusDot}
                  onManage={(id) => navigate(`/admin/users/${id}`)}
                />
              ))}
            </div>

            {/* Desktop Table View (hidden on mobile & tablet) */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <TableHeader />
                <tbody>
                  {paginatedUsers.map((user, index) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      index={index}
                      getInitials={getInitials}
                      getAvatarColor={getAvatarColor}
                      getPlanColor={getPlanColor}
                      getStatusColor={getStatusColor}
                      getStatusDot={getStatusDot}
                      onManage={(id) => navigate(`/admin/users/${id}`)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="rounded-b-lg  bg-white dark:bg-zinc-800 px-4 py-3">
              <AllPagination
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfFirstItem + paginatedUsers.length}
                totalResults={totalResults}
                handlePrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
                currentPage={currentPage}
                handleNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserTable;
