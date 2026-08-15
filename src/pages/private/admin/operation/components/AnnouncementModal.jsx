import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { POST } from '../../../../../services/httpMethods';
import { toast } from 'react-toastify';

const AnnouncementModal = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('INFO');
  const [targetType, setTargetType] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setType('INFO');
    setTargetType('');
    setScheduledAt('');
    setExpiresAt('');
    setIsPinned(false);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    const payload = {
      title: title.trim(),
      message: message.trim(),
      type,
    };

    if (targetType) {
      payload.targetType = targetType;
    }

    // Always include isPinned as requested (can be true or false)
    payload.isPinned = isPinned;

    if (scheduledAt) payload.scheduledAt = new Date(scheduledAt).toISOString();
    if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();

    try {
      setLoading(true);
      const response = await POST('/api/v1/admin/announcements', payload);
      const created = response?.data?.announcement || response?.announcement || response?.data || response;
      toast.success(response?.message);
      if (onSave) onSave(created);
      resetForm();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full rounded-lg border border-[#f2f2f2] bg-white px-3 py-2 text-[12px] text-[#181818] outline-none focus:border-[#8022fe] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white';

  return (
    <div
      onClick={() => { resetForm(); onClose && onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-112.5 flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
          <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Create Announcement
          </p>
          <button
            type="button"
            onClick={() => { resetForm(); onClose && onClose(); }}
            className="text-[#5d5d5d] dark:text-gray-300"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col gap-4 overflow-y-auto p-3 flex-1">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Title</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="e.g. New feature launch"
              className={inputClasses}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Content</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Announcement Details"
              className={`${inputClasses} resize-none`}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Status</p>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`${inputClasses} appearance-none cursor-pointer pr-10`}
              >
                <option value="INFO">INFO</option>
                <option value="FEATURE">FEATURE</option>
                <option value="ALERT">ALERT</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c2c2c2] pointer-events-none" size={14} />
            </div>
          </div>

          {/* Target */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Target</p>
            <div className="relative">
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className={`${inputClasses} appearance-none cursor-pointer pr-10`}
              >
                <option value="">Default (Omit targetType)</option>
                <option value="ALL_USERS">All users (ALL_USERS)</option>
                <option value="ALL_INCLUDING_WAITLIST">All including waitlist (ALL_INCLUDING_WAITLIST)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c2c2c2] pointer-events-none" size={14} />
            </div>
          </div>

          {/* Schedule */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Schedule</p>
            <input
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              type="datetime-local"
              className={inputClasses}
            />
          </div>

          {/* Expires */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Expires</p>
            <input
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              type="datetime-local"
              className={inputClasses}
            />
          </div>

          {/* Pin Announcement */}
          <div className="flex items-center gap-2 py-1">
            <input
              id="pin"
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
            />
            <label
              htmlFor="pin"
              className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300 cursor-pointer"
            >
              Pin announcement
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 border-t border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => { resetForm(); onClose && onClose(); }}
            className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex flex-1 items-center justify-center rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;