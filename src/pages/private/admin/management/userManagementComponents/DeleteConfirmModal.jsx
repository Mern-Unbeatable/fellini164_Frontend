import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, userName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-800 border border-[#f2f2f2] dark:border-zinc-700">
        <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3 dark:border-zinc-700">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle size={20} />
            <h3 className="text-lg font-semibold dark:text-white">Delete User</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#a3a3a3] hover:bg-[#f2f2f2] dark:hover:bg-zinc-700"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-[#5d5d5d] dark:text-gray-300">
            Are you sure you want to delete <span className="font-semibold text-[#181818] dark:text-white">{userName}</span>? This action cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#f2f2f2] bg-white px-4 py-2 text-sm font-medium text-[#5d5d5d] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
