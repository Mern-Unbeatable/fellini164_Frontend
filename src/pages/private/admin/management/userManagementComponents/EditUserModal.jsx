import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPlan(user.plan || 'FREE');
      setStatus(user.status || 'Active');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, email, plan, status });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-800 border border-[#f2f2f2] dark:border-zinc-700">
        <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-[#181818] dark:text-white">Edit User</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#a3a3a3] hover:bg-[#f2f2f2] dark:hover:bg-zinc-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5d5d5d] uppercase dark:text-gray-300">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#f2f2f2] bg-white px-3 py-2 text-sm text-[#181818] outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5d5d5d] uppercase dark:text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#f2f2f2] bg-white px-3 py-2 text-sm text-[#181818] outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5d5d5d] uppercase dark:text-gray-300">Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#f2f2f2] bg-white px-3 py-2 text-sm text-[#181818] outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              >
                <option value="FREE">FREE</option>
                <option value="STARTER">STARTER</option>
                <option value="PRO">PRO</option>
                <option value="ULTIMATE">ULTIMATE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5d5d5d] uppercase dark:text-gray-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#f2f2f2] bg-white px-3 py-2 text-sm text-[#181818] outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
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
            type="submit"
            className="rounded-lg bg-[#8022fe] px-4 py-2 text-sm font-medium text-white hover:bg-[#6b1bd4] transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
