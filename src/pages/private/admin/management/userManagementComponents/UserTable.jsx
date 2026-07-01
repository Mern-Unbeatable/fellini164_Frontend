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
  <div className="mb-3 rounded-lg border border-gray-200 bg-white dark:bg-zinc-800  shadow-sm">
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
    <tr className="border-b border-[#f2f2f2] dark:border-zinc-700 bg-[#fcfcfc] dark:bg-zinc-800">
      <th className="px-6 py-2.5 text-left text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">User</th>
      <th className="px-6 py-2.5 text-left text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Plan</th>
      <th className="px-6 py-2.5 text-left text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Status</th>
      <th className="px-6 py-2.5 text-left text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Joined</th>
      <th className="px-6 py-2.5 text-left text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Last Active</th>
      <th className="px-6 py-2.5 text-left text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Actions</th>
    </tr>
  </thead>
);

const StatusFilterDropdown = ({ value, onChange }) => {
  const options = ['All Status', 'Waitlist', 'Invited', 'Active', 'Unsubscribe'];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-medium text-[#181818] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
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
  <tr className="border-b border-[#f2f2f2] dark:border-zinc-700 transition hover:bg-[#fcfcfc] dark:hover:bg-zinc-700/50">
    <td className="px-6 py-2.5">
      <div className="flex items-center gap-3">
        <div
          className={`h-7 w-7 rounded-full bg-[#f9f4ff] flex items-center justify-center text-[10px] font-bold text-[#8022fe]`}
        >
          {getInitials(user.name)}
        </div>
        <div>
          <div className="text-[14px] font-medium text-[#181818] dark:text-white">{user.name}</div>
          <div className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">{user.email}</div>
        </div>
      </div>
    </td>

    <td className="px-6 py-2.5">
      <span
        className={`inline-flex rounded-[6px] px-2 py-0.75 text-[12px] font-medium ${getPlanColor(user.plan)}`}
      >
        {user.plan}
      </span>
    </td>

    <td className="px-6 py-2.5">
      <span
        className={`inline-flex items-center gap-1.5 rounded-[6px] px-2 py-0.75 text-[12px] font-medium ${getStatusColor(user.status)}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(user.status)}`} />
        {user.status}
      </span>
    </td>

    <td className="px-6 py-2.5 text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">{user.joined}</td>
    <td className="px-6 py-2.5 text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">{user.lastActive}</td>

    <td className="px-6 py-2.5">
      <button onClick={() => onManage(user.id)} className="text-[12px] font-semibold text-[#8022fe] dark:text-violet-400 hover:underline">
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
  const ITEMS_PER_PAGE = 8;
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
    <div className="w-full py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      {/* Header */}
      <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[20px] font-medium text-[#181818] dark:text-white">User Management</p>
          <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400 max-lg:text-sm">
            View, manage, and monitor registered platform users and their accounts.
          </p>
        </div>
      </div>
      <div className="rounded-lg bg-white dark:bg-zinc-800 border border-[#f2f2f2] dark:border-zinc-700 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] ">
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
              <p className="font-medium"> {error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Header */}
            <div className="flex flex-col gap-3 rounded-t-lg border-b border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-800 px-4 py-3.5 md:flex-row md:items-center md:justify-between md:px-6">
              <div className="flex w-full items-center gap-[6px] rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] px-3.5 py-1.75 md:w-64 dark:border-zinc-700 dark:bg-zinc-800">
                <Search size={14} className="shrink-0 text-[#5d5d5d] dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Search Users"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-transparent text-[12px] font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] dark:text-white"
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
                  className="flex items-center gap-1.5 rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-1.75 text-[12px] font-semibold text-[#5d5d5d] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                >
                  <Download size={14} className="shrink-0 text-[#5d5d5d] dark:text-gray-300" />
                  <span>Export CSV</span>
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
