



import { MoreVertical, Eye, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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

  const handleSavePlan = (data) => {
    console.log('Saved plan:', data);
  };

  const announcements = [
    { id: 1, status: 'Draft', title: 'Maintenance', subtitle: 'System maintenance in...', date: '2025-12-14', views: 0, isScheduled: false },
    { id: 2, status: 'Scheduled', title: 'Maintenance Scheduled', subtitle: 'System maintenance in...', date: '2025-2-21', views: 0, isScheduled: true },
    { id: 3, status: 'Draft', title: 'Black Friday Sale', subtitle: 'Limited time offers...', date: '2024-11-15', views: 0, isScheduled: false },
  ];

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
                    <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-3 py-1 rounded mb-2">
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
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200  transition-colors"
                        onClick={() => console.log('Edit', announcement.id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 transition-colors"
                        onClick={() => console.log('Delete', announcement.id)}
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
    </div>
  );
}