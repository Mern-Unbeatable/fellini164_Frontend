import { useState } from 'react';
import { X } from 'lucide-react';

export default function NewPlanModal({ open, onClose, onSave }) {
  const [planText, setPlanText] = useState('');
  const [dateRange, setDateRange] = useState('Today'); // Default selected date range

  if (!open) return null;

  const handleCreate = () => {
    onSave({
      plan: planText,
      dateRange: dateRange,
    });
    onClose();
  };

  const dateOptions = ['Today', 'This Week', 'This Month', 'Custom'];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-[24px] bg-white p-6 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-sm font-medium text-gray-700">New Plan</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Input Field Section */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-medium text-[#C2C2C2]">
            What do you want to plan?
          </label>
          <textarea
            value={planText}
            onChange={(e) => setPlanText(e.target.value)}
            placeholder="Need to updating my portfolio..."
            rows="5"
            className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-gray-700 outline-none focus:border-gray-300 placeholder:text-gray-300"
          />
        </div>

        {/* Date Range Options */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium text-[#C2C2C2]">
            Date range
          </label>
          <div className="flex flex-wrap gap-2">
            {dateOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDateRange(option)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                  dateRange === option
                    ? 'border-primary bg-primary text-white' // Active state (optional tweak)
                    : 'border-gray-200 text-gray-800 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-100 py-3 font-medium text-gray-600 hover:bg-gray-200/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!planText.trim()}
            className={`flex-1 rounded-xl py-3 font-medium transition-colors ${
              planText.trim()
                ? 'bg-primary text-white hover:bg-gray-200/80' 
                : 'bg-gray-200 text-white cursor-not-allowed'
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}