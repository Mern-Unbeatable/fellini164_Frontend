import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserTable from './userManagementComponents/UserTable';
import { fetchUsers } from '../../../../features/users/usersApi';

const UserManagementTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const {
    list: users,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.users || {
        list: [],
        loading: false,
        error: null,
        pagination: { currentPage: 1, totalPages: 1, total: 0 },
      }
  );

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // Format last active helper
  const formatLastActive = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffMonths = Math.floor(diffMs / 2592000000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  };

  // Fetch users via Redux
  useEffect(() => {
    dispatch(fetchUsers({ page: 1 }));
  }, [dispatch]);

  console.log(dispatch);

  const getPlanColor = (plan) =>
    ({
      PRO: 'bg-[#E0E7FF] text-[#4338CA]',
      FREE: 'bg-[#F1F5F9] text-[#334155]',
      ULTIMATE: 'bg-[#F3E8FF] text-[#7E22D7]',
      STARTER: 'bg-[#E0F2FE] text-[#0369B6]',
    })[plan] || 'bg-gray-100 text-gray-700';

  const getStatusColor = (status) =>
    ({
      Active: 'bg-[#DCFCE7] text-[#16A34A]',
      Inactive: 'bg-[#F3F4F6] text-[#6B7280]',
      Suspended: 'bg-[#FEE2E2] text-[#DC2626]',
    })[status] || 'bg-gray-100 text-gray-600';

  const getStatusDot = (status) =>
    ({
      Active: 'bg-green-600',
      Inactive: 'bg-gray-400',
      Suspended: 'bg-red-700',
    })[status] || 'bg-gray-400';

  // Export to CSV function
  const handleExportCSV = () => {
    const filteredUsers = (users || []).filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const headers = ['Name', 'Email', 'Plan', 'Status', 'Joined', 'Last Active'];

    const csvRows = [
      headers.join(','),
      ...filteredUsers.map((user) =>
        [
          `"${user.name}"`,
          `"${user.email}"`,
          user.plan,
          user.status,
          formatDate(user.joined),
          `"${formatLastActive(user.lastActive)}"`,
        ].join(',')
      ),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare display users with formatted dates
  const displayUsers = (users || []).map((u) => ({
    ...u,
    joined: formatDate(u.joined),
    lastActive: formatLastActive(u.lastActive),
  }));

  console.log('Hello', displayUsers);

  return (
    <UserTable
      users={displayUsers}
      loading={loading}
      error={error}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onExportCSV={handleExportCSV}
      getPlanColor={getPlanColor}
      getStatusColor={getStatusColor}
      getStatusDot={getStatusDot}
    />
  );
};

export default UserManagementTable;
