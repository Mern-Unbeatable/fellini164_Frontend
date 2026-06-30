import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Share2, CircleCheck, Download } from 'lucide-react';
import AllPagination from './../../../../components/common/AllPagination';
import { POST } from '../../../../services/httpMethods';
import { fetchWaitlistUsers } from '../../../../features/users/usersApi';
import UserMobileCard from './waitingListComponents/UserMobileCard';
import ShareAndFilter from './waitingListComponents/ShareAndFilter';
import TableHead from './waitingListComponents/TableHead';
import Modal from './waitingListComponents/Modal';
import ThreeDot from './waitingListComponents/ThreeDot';


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const STATUS_CONFIG = {
  ALL: { label: 'All Status', className: 'text-gray-700 bg-gray-50 border-gray-200' },
  WAITLIST: { label: 'Waitlist', className: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
  INVITED: { label: 'Invited', className: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  ACTIVE: { label: 'Active', className: 'text-green-600 bg-green-50 border-green-100' },
  UNSUBSCRIBED: { label: 'Unsubscribe', className: 'text-red-600 bg-red-50 border-red-100' },
};

const WaitingList = () => {
  const [usersData, setUsersData] = useState([]);
  const dispatch = useDispatch();
  const {
    waitlistList = [],
    loading,
    waitlistPagination = {},
  } = useSelector((state) => state.users || {});
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load all data from server once - only if not already loaded
  useEffect(() => {
    // Check if data is already loaded in Redux
    if (!waitlistList || waitlistList.length === 0) {
      const params = { page: 1, limit: 1000 }; // Fetch all data
      dispatch(fetchWaitlistUsers(params));
    }
  }, [dispatch, waitlistList]);

  // mirror waitlistList to local shape used by component
  useEffect(() => {
    const allUsers = (waitlistList || []).map((user) => ({
      id: user.id,
      name: user.fullName || 'No Name',
      email: user.email,
      status: user.userStatus,
      referralCount: user.referralCount || 0,
      date: formatDate(user.createdAt),
      // try common image fields from API
      avatar: user.avatar || user.image || user.profilePhoto || user.photo || null,
    }));
    setUsersData(allUsers);
  }, [waitlistList]);

  const handleToggleSubscription = async (userId, currentStatus) => {
    if (!userId) return alert('User ID is missing');

    setUpdatingId(userId);
    try {
      const isCurrentlyUnsubscribed = currentStatus === 'UNSUBSCRIBED';
      const path = isCurrentlyUnsubscribed ? 'resubscribe' : 'unsubscribe';
      const endpoint = `/api/v1/auth/${path}?userId=${userId}`;
      const res = await POST(endpoint, {});

      if (res?.success) {
        const newStatus = isCurrentlyUnsubscribed ? 'ACTIVE' : 'UNSUBSCRIBED';
        setUsersData((prev) =>
          prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
        );
      } else {
        throw new Error(res?.message || 'Server error');
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed: check backend route.');
    } finally {
      setUpdatingId(null);
    }
  };



  
  // Frontend search filtering
  const filteredUsers = usersData.filter((user) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search);
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Paginate filtered results on frontend
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalResults = filteredUsers.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const getStatusStyles = (status) =>
    STATUS_CONFIG[status]?.className || 'text-gray-500 bg-gray-50';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);


  

  // Direct page change handler - jumps directly to the target page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Export to CSV function
  const handleExportCSV = () => {
    // Define CSV headers
    const headers = ['Name', 'Email', 'Status', 'Referrals', 'Joined Date'];

    // Convert data to CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...filteredUsers.map((user) =>
        [`"${user.name}"`, `"${user.email}"`, user.status, user.referralCount || 0, user.date].join(
          ','
        )
      ),
    ];

    // Create CSV string
    const csvString = csvRows.join('\n');

    // Create blob and download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `waitlist_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      <div className="w-full rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-200">Loading users...</p>
            </div>
          </div>
        ) : (
          <>
            {/* SEARCH & FILTER */}
            <ShareAndFilter
              totalResults={totalResults}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onExportCSV={handleExportCSV}
            />

            {/* MOBILE */}
            <div className="p-4 lg:hidden">
              {currentUsers.map((user) => (
                <UserMobileCard
                  key={user.id}
                  user={user}
                  getStatusStyles={getStatusStyles}
                  handleToggleSubscription={handleToggleSubscription}
                  updatingId={updatingId}
                />
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <TableHead />
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-[#f2f2f2] dark:border-zinc-700 transition-colors hover:bg-[#fcfcfc] dark:hover:bg-zinc-700/50"
                      >
                        <td className="px-6 py-2.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center shrink-0">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="h-7 w-7 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f9f4ff] text-[10px] font-bold text-[#8022fe]">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-[14px] font-medium text-[#181818] dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-2.5">
                          <span
                            className={`inline-flex rounded-[6px] px-2 py-0.75 text-[12px] font-medium border ${getStatusStyles(user.status)}`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="px-6 py-2.5">
                          <span className="flex items-center gap-1 text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
                            {user.referralCount || 0}
                            <Share2
                              className={`h-3.5 w-3.5 ${
                                user.referralCount === 0
                                  ? 'text-gray-300 dark:text-gray-600'
                                  : 'text-[#5d5d5d] dark:text-gray-200'
                              }`}
                            />
                          </span>
                        </td>

                        <td className="px-6 py-2.5 text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
                          {user.date}
                        </td>

                        <td className="px-6 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="">
                              <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-1.5 rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] px-2.5 py-1.5 text-[12px] font-semibold text-[#5d5d5d] hover:bg-gray-100 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                              >
                                <CircleCheck className="h-4 w-4 text-[#22A853]" />
                                Sent
                              </button>
                            </div>

                            {/* Three Dot */}
                            <ThreeDot
                              setOpenMenuId={setOpenMenuId}
                              openMenuId={openMenuId}
                              user={user}
                              setIsModalOpen={setIsModalOpen}
                              handleToggleSubscription={handleToggleSubscription}
                              updatingId={updatingId}
                              usersData={usersData}
                            />
                          </div>
                          {/* Modal */}
                          <Modal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            setOpen={setIsModalOpen}
                            user={user.id}
                            currentUsers={currentUsers}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-400 dark:text-gray-200">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-50 p-6 dark:border-gray-800">
              <AllPagination
                currentPage={currentPage}
                handleNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                onPageChange={handlePageChange}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
                totalPages={totalPages}
                totalResults={totalResults}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WaitingList;
