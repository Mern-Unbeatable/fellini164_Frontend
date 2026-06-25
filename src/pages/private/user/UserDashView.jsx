// import { useSelector } from 'react-redux';
// import { selectUser } from '../../../features/auth/authSlice';
import { Check, Flame, MessageSquareDot } from 'lucide-react';
import { useState } from 'react';

const UserDashView = () => {
  // const user = useSelector(selectUser);

  const [checked, setChecked] = useState({});

  const tasks = [
    ['Morning Meditation', '07:00 • Wellness'],
    ['Deep Work Session', '09:03 • Work'],
    ['Team Sync', '13:00 • Work'],
    ['Review Goals', '17:00 • Personal'],
  ];
  const toggleCheck = (index) => {
    setChecked((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-6 py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      {/* Welcome Header */}
      <div className="rounded-xl bg-gradient-to-r from-[#8141EE] to-[#cdc0fe] px-6 py-12 text-white shadow-lg md:px-12 md:py-16 dark:from-[#6C3ADC] dark:to-[#4E2C9D]">
        <h1 className="mb-2 text-2xl font-bold md:text-4xl">Good Morning Alex !</h1>
        <p className="text-sm text-purple-100 opacity-90 md:text-base">
          You have 5 tasks scheduled for today. Let's make it a productive one.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Coach Chat Section */}
        <div className="rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#181818] md:text-[20px] dark:text-white">
              AI Coach Chat
            </h2>
            <span className="text-[12px] font-medium text-[#a3a3a3] dark:text-zinc-400">
              2025-12-14
            </span>
          </div>

          <div className="space-y-4">
            {tasks.map(([title, meta], i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b border-[#f2f2f2] pb-3 last:border-b-0 last:pb-0 dark:border-zinc-700/50"
              >
                {/* real checkbox */}
                <input
                  type="checkbox"
                  checked={!!checked[i]}
                  onChange={() => toggleCheck(i)}
                  className="mt-1 h-4.5 w-4.5 cursor-pointer rounded border-gray-300 accent-[#8022fe] dark:border-zinc-600"
                />

                <div className="min-w-0 flex-1">
                  <h3
                    className={`truncate text-left text-[15px] font-medium transition duration-150 md:text-[16px] dark:text-gray-200 ${
                      checked[i]
                        ? 'text-gray-400 line-through dark:text-gray-500'
                        : 'text-[#181818]'
                    }`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`mt-0.5 text-[12px] ${checked[i] ? 'text-gray-300 dark:text-zinc-600' : 'text-[#a3a3a3]'}`}
                  >
                    {meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Quote & AI Coach */}
        <div className="space-y-6">
          {/* Daily Quote */}
          <div className="flex items-start gap-4 rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-6 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f9f4ff] text-[#8022fe] dark:bg-zinc-700 dark:text-gray-300">
              <MessageSquareDot size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="mb-2 text-[18px] font-semibold text-[#181818] md:text-[20px] dark:text-white">
                Daily Quote
              </h2>
              <p className="text-[15px] leading-relaxed text-gray-600 italic dark:text-gray-300">
                "The only way to do great work is to love what you do."
              </p>
            </div>
          </div>

          {/* AI Coach Chat List */}
          <div className="rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-6 dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="mb-6 text-[18px] font-semibold text-[#181818] md:text-[20px] dark:text-white">
              AI Coach Chat
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-xl border border-[#f2f2f2] bg-white p-3.5 transition hover:shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] dark:border-zinc-700/50 dark:bg-zinc-900/50"
                >
                  <span className="text-[15px] font-medium text-[#181818] dark:text-gray-200">
                    Drink 2L Water
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">
                      08
                    </span>
                    <span className="text-yellow-500">
                      <Flame size={16} />
                    </span>
                    <span className="text-green-500">
                      <Check size={16} strokeWidth={3} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
    </div>
  );
};

export default UserDashView;
