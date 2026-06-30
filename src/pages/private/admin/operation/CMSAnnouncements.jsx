import { MoreVertical, Eye, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GET, DELETE } from '../../../../services/httpMethods';
import { toast } from 'react-toastify';
import AnnouncementModal from './components/AnnouncementModal';

export default function CMSAnnouncements() {
  const [modle, setModle] = useState(false);
  // State to track which announcement menu is open (stores the ID)
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleOpenModal = () => setModle(true);

  const handleCloseModal = () => setModle(false);

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close menu when clicking anywhere else on the screen
  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSavePlan = (createdAnnouncement) => {
    //
    const ann = createdAnnouncement?.announcement || createdAnnouncement;
    if (!ann) return;
    // Ensure we have an id; if not, create a timestamp id
    const id = ann.id || `local-${Date.now()}`;
    const item = {
      id,
      title: ann.title || 'Untitled',
      subtitle: ann.message || '',
      date: ann.scheduledAt ? new Date(ann.scheduledAt).toLocaleString() : new Date().toLocaleDateString(),
      views: ann.views || 0,
      isScheduled: !!ann.scheduledAt,
      raw: ann,
    };

    setAnnouncements((prev) => [item, ...prev]);
  };

  const handleDelete = async (id) => {
    // deprecated: keep for direct calls, but prefer confirm modal
    if (!id) return;
    try {
      const res = await DELETE(`/api/v1/admin/announcements/${id}`);
      const msg = res?.message || 'Announcement deleted';
      toast.success(msg);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      setOpenMenuId(null);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to delete announcement';
      toast.error(msg);
    }
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
    <div className="min-h-screen    p-4 sm:p-6 md:p-8">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-start md:items-center md:mb-8 mb-6 flex-col md:flex-row gap-2">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">CMS & Announcements</h1>
          <button onClick={handleOpenModal} className="text-base bg-[#7c3aed] hover:bg-[#7031dd]   text-white py-2 px-2 md:px-4 rounded-lg flex items-center gap-2 w-full md:w-auto justify-center">
            <span><Plus size={20} /></span> Create New
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="flex justify-between items-start p-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  {announcement.isScheduled ? (
                    <span className="inline-block bg-[#FEF9C3] text-[#AA6207] text-xs font-semibold px-3 py-1 rounded mb-2">
                      Scheduled
                    </span>
                  ) : (
                    <span className="block text-gray-600 text-sm font-medium mb-2 bg-[#EFF1F4] px-3 py-1 rounded ">
                      {announcement.status}
                    </span>
                  )}
                </div>

                {/* DROPDOWN CONTAINER */}
                <div className="relative">
                  <button
                    onClick={(e) => toggleMenu(announcement.id, e)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400 p-1"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* The Menu */}
                  {openMenuId === announcement.id && (
                    <div className="absolute right-0 mt-2 w-24 bg-white  border dark:bg-zinc-800 border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 overflow-hidden">
                      {/* <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200  transition-colors"
                        onClick={(e) => { e.stopPropagation(); console.log('Edit', announcement.id); }}
                      >
                        Edit
                      </button> */}
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 transition-colors"
                        onClick={(e) => { e.stopPropagation(); openConfirm(announcement); }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h3 className="text-gray-900 dark:text-white font-semibold dark:font-medium text-lg ">{announcement.title}</h3>
                {announcement.subtitle && <p className="text-gray-500 dark:text-gray-300 text-sm ">{announcement.subtitle}</p>}
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                <span className="text-gray-500 dark:text-gray-300 text-sm ">{announcement.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnnouncementModal open={modle} onClose={handleCloseModal} onSave={handleSavePlan} />

      {/* Delete confirmation modal */}
      {confirmAnnouncement && (
        <div onClick={() => setConfirmAnnouncement(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-400 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm delete</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">Are you sure you want to delete the announcement "{confirmAnnouncement.title}"?</p>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-400 dark:border-gray-700">
              <button onClick={() => setConfirmAnnouncement(null)} className="px-4 py-2 border rounded-md">Cancel</button>
              <button onClick={handleDeleteConfirmed} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}