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
          className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-lg"
        >
          <div className="flex flex-col ">
            {/* Subscribe/Unsubscribe Button */}
            <div className="block w-full ">
              <button
                disabled={updatingId === user.id}
                onClick={() => handleToggleSubscription(user.id, user.status)}
                className={`inline-flex min-w-[110px] items-center justify-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 ${
                  user.status === 'UNSUBSCRIBED'
                    ? 'bg-green-600 text-white'
                    : 'border border-gray-200 dark:border-zinc-700  text-black dark:text-white dark:shadow-2xl bg-zinc-500'
                }`}
              >
                {updatingId === user.id ? (
                  <Loader2 className="h-3 w-3 animate-spin " />
                ) : user.status === 'UNSUBSCRIBED' ? (
                  'Resubscribe'
                ) : (
                  'Unsubscribe'
                )}
              </button>
            </div>
            {/* <div className="text-start">
              <label className="mb-0.5 text-base font-normal text-gray-500" htmlFor="">
                Referral id
              </label>
              <input
                type="text"
                defaultValue=""
                placeholder="Referral id"
                className="rounded-lg border border-gray-200 py-2 text-center text-base outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div> */}

            {/* <div className="">
              <button
                className={`sm:text-base} flex w-full items-center justify-center gap-1 bg-[#7C3AED] px-4 py-2 text-center text-sm font-medium text-[#fff] shadow-lg`}
              >
                Referral now
              </button>
            </div> */}

            {/* Edit Section */}
            <div className="block w-full text-left">
              {/* <button
                onClick={() => setIsModalOpen(true)}
                className="text-start font-medium text-gray-700 hover:underline"
              >
                Edit User
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {/* {isModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          closeEditModal={closeEditModal}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
        >
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit User</h2>
            </div>

            <form className="flex flex-col gap-3">
              <input
                type="text"
                defaultValue={user.name}
                placeholder="Name"
                className="rounded border p-2"
              />

              <input
                type="text"
                defaultValue={user.location}
                placeholder="Location"
                className="rounded border p-2"
              />

              <input
                type="tel"
                defaultValue={user.mobile}
                placeholder="Mobile Number"
                className="rounded border p-2"
              />

              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:opacity-90"
              >
                Save
              </button>
            </form>
          </div>
        </EditModal>
      )} */}
    </div>
  );
};

export default ThreeDot;
