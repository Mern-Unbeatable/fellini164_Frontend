import { MoreVertical, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GET, DELETE } from '../../../../services/httpMethods';
import { toast } from 'react-toastify';
import AnnouncementModal from './components/AnnouncementModal';

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

  const handleSavePlan = (createdAnnouncement) => {
    const ann = createdAnnouncement?.announcement || createdAnnouncement;
    if (!ann) return;
    const id = ann.id || `local-${Date.now()}`;
    const item = {
      id,
      title: ann.title || 'Untitled',
      subtitle: ann.message || '',
      date: ann.scheduledAt ? new Date(ann.scheduledAt).toLocaleString() : new Date().toLocaleDateString(),
      views: ann.views || 0,
      isScheduled: !!ann.scheduledAt,
      status: ann.status || 'Published',
      raw: ann,
    };

    setAnnouncements((prev) => [item, ...prev]);
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
      const res = await DELETE(`/api/v1/admin/announcements/${id}`);
      const msg = res?.message || 'Announcement deleted';
      toast.success(msg);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to delete announcement';
      toast.error(msg);
    } finally {
      setConfirmAnnouncement(null);
    }
  };

  useEffect(() => {
    const toItem = (ann) => ({
      id: ann.id,
      title: ann.title,
      subtitle: ann.message,
      date: ann.scheduledAt ? new Date(ann.scheduledAt).toLocaleString() : new Date(ann.createdAt).toLocaleString(),
      views: ann._count?.userNotifications || ann.recipientsCount || 0,
      isScheduled: !!ann.scheduledAt,
      status: ann.status,
      raw: ann,
    });

    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const body = await GET('/api/v1/admin/announcements');
        const anns = body?.data?.announcements || body?.announcements || body?.data || [];
        const items = Array.isArray(anns) ? anns.map(toItem) : [];
        setAnnouncements(items);
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || 'Failed to load announcements';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="w-full py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 gap-2">
          <h1 className="text-[20px] font-medium text-[#181818] dark:text-white">CMS & Announcements</h1>
          <button
            onClick={handleOpenModal}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#6d18f5] transition-colors"
          >
            <Plus size={14} strokeWidth={2.5} className="shrink-0 text-white" />
            <span>Create New</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start pb-2.5 border-b border-[#f2f2f2] dark:border-zinc-700">
                <div>
                  {announcement.isScheduled ? (
                    <span className="inline-flex rounded-[6px] bg-[rgba(202,138,4,0.05)] text-[#ca8a04] px-1.5 py-0.5 text-[12px] font-medium uppercase">
                      Scheduled
                    </span>
                  ) : announcement.status === 'Draft' ? (
                    <span className="inline-flex rounded-[6px] bg-[rgba(107,114,128,0.05)] text-[#6b7280] px-1.5 py-0.5 text-[12px] font-medium uppercase">
                      Draft
                    </span>
                  ) : (
                    <span className="inline-flex rounded-[6px] bg-[#f9f4ff] text-[#8022fe] px-1.5 py-0.5 text-[12px] font-medium uppercase">
                      Published
                    </span>
                  )}
                </div>

                {/* DROPDOWN CONTAINER */}
                <div className="relative">
                  <button
                    onClick={(e) => toggleMenu(announcement.id, e)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400 p-1"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {/* The Menu */}
                  {openMenuId === announcement.id && (
                    <div className="absolute right-0 mt-1 w-24 bg-white border dark:bg-zinc-800 border-[#f2f2f2] dark:border-zinc-700 rounded-md shadow-lg z-50 overflow-hidden">
                      <button
                        className="w-full text-left px-3 py-2 text-[12px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 transition-colors"
                        onClick={(e) => { e.stopPropagation(); openConfirm(announcement); }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="py-2.5 flex flex-col gap-1">
                <h3 className="text-[16px] font-medium text-[#181818] dark:text-white leading-normal">
                  {announcement.title}
                </h3>
                {announcement.subtitle && (
                  <p className="text-[12px] font-medium text-[#a3a3a3] dark:text-zinc-500 leading-normal">
                    {announcement.subtitle}
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-center pt-2.5 border-t border-[#f2f2f2] dark:border-zinc-700">
                <span className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">
                  {announcement.date}
                </span>
              </div>
            </div>
          ))}
        </div>
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
            className="w-full max-w-md bg-[#fcfcfc] dark:bg-zinc-900 rounded-2xl border border-[#f2f2f2] dark:border-zinc-700 shadow-xl overflow-hidden font-sans flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-[#f2f2f2] px-6 py-3.5 dark:border-zinc-700">
              <h3 className="text-[16px] font-semibold text-[#181818] dark:text-white">Confirm delete</h3>
            </div>
            <div className="p-6">
              <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
                Are you sure you want to delete the announcement "{confirmAnnouncement.title}"?
              </p>
            </div>
            <div className="flex items-center gap-2 border-t border-[#f2f2f2] px-6 py-3.5 dark:border-zinc-700">
              <button
                onClick={() => setConfirmAnnouncement(null)}
                className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex flex-1 items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-[12px] font-semibold text-white hover:bg-red-700 transition-colors"
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