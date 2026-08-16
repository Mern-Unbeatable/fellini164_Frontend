import { MoreVertical, Plus } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { GET, DELETE } from '../../../../services/httpMethods';
import { API_ENDPOINTS, adminAnnouncementById } from '../../../../services/httpEndpoint';
import { toast } from 'react-toastify';
import AnnouncementModal from './components/AnnouncementModal';
import AllPagination from '../../../../components/common/AllPagination';

const ITEMS_PER_PAGE = 12;
const PAGINATION_MIN_ITEMS = 12;

function toAnnouncementItem(ann) {
  return {
    id: ann.id,
    title: ann.title,
    subtitle: ann.message,
    date: ann.scheduledAt
      ? new Date(ann.scheduledAt).toLocaleString()
      : new Date(ann.createdAt).toLocaleString(),
    views: ann._count?.userNotifications || ann.recipientsCount || 0,
    status: ann.status,
    raw: ann,
  };
}

function AnnouncementStatusBadge({ status }) {
  const normalized = String(status || '').toUpperCase();

  if (normalized === 'DRAFT') {
    return (
      <span className="inline-flex rounded-md bg-[rgba(202,138,4,0.05)] px-1.5 py-0.5 text-[12px] font-medium text-[#ca8a04] uppercase">
        Scheduled
      </span>
    );
  }

  if (normalized === 'SENT') {
    return (
      <span className="inline-flex rounded-md bg-[#f9f4ff] px-1.5 py-0.5 text-[12px] font-medium text-[#8022fe] uppercase">
        Published
      </span>
    );
  }

  if (normalized === 'SCHEDULED') {
    return (
      <span className="inline-flex rounded-md bg-[rgba(202,138,4,0.05)] px-1.5 py-0.5 text-[12px] font-medium text-[#ca8a04] uppercase">
        Scheduled
      </span>
    );
  }

  if (!normalized) return null;

  return (
    <span className="inline-flex rounded-md bg-[rgba(107,114,128,0.05)] px-1.5 py-0.5 text-[12px] font-medium text-[#6b7280] uppercase">
      {normalized}
    </span>
  );
}

export default function CMSAnnouncements() {
  const [modle, setModle] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleOpenModal = () => setModle(true);
  const handleCloseModal = () => setModle(false);

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAnnouncements = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const body = await GET(API_ENDPOINTS.ADMIN.ANNOUNCEMENTS, {
        page,
        limit: ITEMS_PER_PAGE,
      });

      const anns = body?.data?.announcements || body?.announcements || body?.data || [];
      const list = Array.isArray(anns) ? anns.map(toAnnouncementItem) : [];
      const pagination = body?.data?.pagination || body?.pagination;

      if (pagination && (pagination.total != null || pagination.totalPages != null)) {
        setAnnouncements(list);
        setTotalResults(pagination.total ?? list.length);
        setTotalPages(Math.max(1, pagination.totalPages ?? 1));
        setCurrentPage(pagination.page ?? page);
        return;
      }

      const start = (page - 1) * ITEMS_PER_PAGE;
      const paged = list.slice(start, start + ITEMS_PER_PAGE);
      setAnnouncements(paged);
      setTotalResults(list.length);
      setTotalPages(Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE)));
      setCurrentPage(page);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements(currentPage);
  }, [currentPage, fetchAnnouncements]);

  const handleSavePlan = () => {
    if (currentPage === 1) fetchAnnouncements(1);
    else setCurrentPage(1);
  };

  const [confirmAnnouncement, setConfirmAnnouncement] = useState(null);

  const openConfirm = (announcement) => {
    setConfirmAnnouncement(announcement);
    setOpenMenuId(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmAnnouncement) return;
    const id = confirmAnnouncement.id;
    try {
      const res = await DELETE(adminAnnouncementById(id));
      const msg = res?.message;
      toast.success(msg);
      const nextPage =
        announcements.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      if (nextPage !== currentPage) setCurrentPage(nextPage);
      else fetchAnnouncements(currentPage);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
    } finally {
      setConfirmAnnouncement(null);
    }
  };

  const indexOfFirstItem = totalResults === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE;
  const indexOfLastItem = indexOfFirstItem + announcements.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      <div className="">
        {/* Header */}
        <div className="mb-5 flex w-full items-center justify-between gap-2 max-lg:mb-4">
          <p className="text-[20px] font-medium text-[#181818] dark:text-white"> Announcements</p>
          <button
            onClick={handleOpenModal}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#6d18f5]"
          >
            <Plus size={14} strokeWidth={2.5} className="shrink-0 text-white" />
            <span>Create New</span>
          </button>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">
              Loading announcements…
            </p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">
              No announcements yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-[#f2f2f2] pb-2.5 dark:border-zinc-700">
                <div>
                  <AnnouncementStatusBadge status={announcement.status} />
                </div>

                {/* DROPDOWN CONTAINER */}
                <div className="relative">
                  <button
                    onClick={(e) => toggleMenu(announcement.id, e)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {/* The Menu */}
                  {openMenuId === announcement.id && (
                    <div className="absolute right-0 z-50 mt-1 w-24 overflow-hidden rounded-md border border-[#f2f2f2] bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                      <button
                        className="w-full px-3 py-2 text-left text-[12px] font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfirm(announcement);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col gap-1 py-2.5">
                <h3 className="text-[16px] leading-normal font-medium text-[#181818] dark:text-white">
                  {announcement.title}
                </h3>
                {announcement.subtitle && (
                  <p className="text-[12px] leading-normal font-medium text-[#a3a3a3] dark:text-zinc-500">
                    {announcement.subtitle}
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-[#f2f2f2] pt-2.5 dark:border-zinc-700">
                <span className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">
                  {announcement.date}
                </span>
              </div>
            </div>
          ))}
          </div>
        )}

        {!loading && totalResults > PAGINATION_MIN_ITEMS && (
          <div className="mt-6 rounded-2xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-800">
            <AllPagination
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              totalResults={totalResults}
              handlePrevious={() => handlePageChange(Math.max(1, currentPage - 1))}
              currentPage={currentPage}
              handleNext={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      <AnnouncementModal open={modle} onClose={handleCloseModal} onSave={handleSavePlan} />

      {/* Delete confirmation modal */}
      {confirmAnnouncement && (
        <div
          onClick={() => setConfirmAnnouncement(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] font-sans shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between border-b border-[#f2f2f2] px-6 py-3.5 dark:border-zinc-700">
              <h3 className="text-[16px] font-semibold text-[#181818] dark:text-white">
                Confirm delete
              </h3>
            </div>
            <div className="p-6">
              <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
                Are you sure you want to delete the announcement "{confirmAnnouncement.title}"?
              </p>
            </div>
            <div className="flex items-center gap-2 border-t border-[#f2f2f2] px-6 py-3.5 dark:border-zinc-700">
              <button
                onClick={() => setConfirmAnnouncement(null)}
                className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] transition-colors dark:bg-zinc-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex flex-1 items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
