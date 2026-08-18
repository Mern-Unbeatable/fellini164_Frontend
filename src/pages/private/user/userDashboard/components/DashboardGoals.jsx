import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const DashboardGoals = ({ hasGoals = false }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-[#f2f2f2] bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800 sm:p-5">
      <h2 className="text-[15px] font-semibold text-[#181818] dark:text-white">Goals</h2>

      {hasGoals ? null : (
        <div className="mt-6 flex flex-col items-start gap-3">
          <p className="text-[13px] font-medium text-[#8a8a8a] dark:text-zinc-400">
            No active goals yet.
          </p>
          <button
            type="button"
            onClick={() => navigate('/user/goals')}
            className="inline-flex items-center gap-1 rounded-lg bg-[#8022fe] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:opacity-90"
          >
            <Plus size={13} strokeWidth={2.5} />
            Create a goal
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardGoals;
