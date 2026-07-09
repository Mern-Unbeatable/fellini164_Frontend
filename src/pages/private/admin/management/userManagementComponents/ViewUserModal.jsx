import React from 'react';
import { X } from 'lucide-react';

export default function ViewUserModal({
  isOpen,
  onClose,
  user,
  getInitials,
  getPlanColor,
  getStatusColor,
  getStatusDot,
}) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-800 border border-[#f2f2f2] dark:border-zinc-700">
        <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-[#181818] dark:text-white">User Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#a3a3a3] hover:bg-[#f2f2f2] dark:hover:bg-zinc-700"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3 border-b border-dashed border-[#f2f2f2] pb-3 dark:border-zinc-700">
            <div className="h-10 w-10 rounded-full bg-[#f9f4ff] flex items-center justify-center text-sm font-bold text-[#8022fe]">
              {getInitials(user.name)}
            </div>
            <div>
              <div className="text-base font-semibold text-[#181818] dark:text-white">{user.name}</div>
              <div className="text-xs text-[#c2c2c2] dark:text-zinc-500">{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs text-[#c2c2c2] uppercase">Plan</span>
              <span className={`inline-flex rounded-[6px] px-2 py-0.75 mt-1 font-medium ${getPlanColor(user.plan)}`}>
                {user.plan}
              </span>
            </div>
            <div>
              <span className="block text-xs text-[#c2c2c2] uppercase">Status</span>
              <span className={`inline-flex items-center gap-1.5 mt-1 rounded-[6px] px-2 py-0.75 font-medium ${getStatusColor(user.status)}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(user.status)}`} />
                {user.status}
              </span>
            </div>
            <div>
              <span className="block text-xs text-[#c2c2c2] uppercase">Joined Date</span>
              <span className="font-medium text-[#5d5d5d] dark:text-gray-300">{user.joined}</span>
            </div>
            <div>
              <span className="block text-xs text-[#c2c2c2] uppercase">Last Active</span>
              <span className="font-medium text-[#5d5d5d] dark:text-gray-300">{user.lastActive}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#8022fe] px-4 py-2 text-sm font-medium text-white hover:bg-[#6b1bd4] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
