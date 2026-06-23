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
        className="w-full max-w-[500px] rounded-[24px] bg-white p-7 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5">
          <h2 className="text-[17px] font-medium text-zinc-700">New Plan</h2>
          <button 
            onClick={onClose} 
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Input Field Section */}
        <div className="mb-5">
          <label className="mb-2.5 block text-[13px] font-medium text-[#C2C2C2]">
            What do you want to plan?
          </label>
          <textarea
            value={planText}
            onChange={(e) => setPlanText(e.target.value)}
            placeholder="Need to updating my portfolio..."
            rows="5"
            className="w-full resize-none rounded-[18px] border border-zinc-200 p-4 text-[15px] text-zinc-800 placeholder-zinc-300/90 outline-none focus:border-zinc-300"
          />
        </div>

        {/* Date Range Options */}
        <div className="mb-6">
          <label className="mb-2.5 block text-[13px] font-medium text-[#C2C2C2]">
            Date range
          </label>
          <div className="flex flex-wrap gap-2">
            {dateOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDateRange(option)}
                className={`rounded-[14px] border px-4.5 py-2 text-[14px] font-medium transition-colors ${
                  dateRange === option
                    ? ' text-white bg-primary' 
                    : 'border-zinc-200 text-zinc-800 hover:bg-zinc-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex gap-3.5">
          <button
            onClick={onClose}
            className="flex-1 rounded-[16px] bg-[#F5F5F7] py-3.5 text-[15px] font-medium text-zinc-700 hover:bg-zinc-200/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!planText.trim()}
            className={`flex-1 rounded-[16px] py-3.5 text-[15px] font-medium transition-colors ${
              planText.trim()
                ? 'bg-primary text-white ' 
                : 'bg-[#F5F5F7] text-zinc-300 cursor-not-allowed'
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}