import { useState, useRef, useEffect } from 'react';
import { Loader2, MoreVertical, X } from 'lucide-react';
import EditModal from './EditModal';

const ThreeDot = ({ setOpenMenuId, openMenuId, user, handleToggleSubscription, updatingId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Function to close modal
  const closeEditModal = () => setIsModalOpen(false);

  // Click outside dropdown handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setOpenMenuId]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
        className="rounded text-gray-500 dark:text-gray-200"
      >
        <MoreVertical />
      </button>

      {openMenuId === user.id && (
        <div
          ref={dropdownRef}
          className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-gray-100 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div className="flex flex-col">
            {/* Subscribe/Unsubscribe Button */}
            <div className="block w-full">
              <button
                disabled={updatingId === user.id}
                onClick={() => handleToggleSubscription(user.id, user.status)}
                className={`inline-flex min-w-[110px] items-center justify-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 ${
                  user.status === 'UNSUBSCRIBED'
                    ? 'bg-green-600 text-white'
                    : 'border border-gray-200 bg-zinc-500 text-white dark:border-zinc-700 dark:text-white dark:shadow-2xl'
                }`}
              >
                {updatingId === user.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : user.status === 'UNSUBSCRIBED' ? (
                  'Resubscribe'
                ) : (
                  'Unsubscribe'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDot;
