// import { useSelector } from 'react-redux';
// import { selectUser } from '../../../features/auth/authSlice';
import { Check, Flame, MessageSquareDot } from 'lucide-react';
import { useState } from 'react';

const UserDashView = () => {
  // const user = useSelector(selectUser);

  const [checked, setChecked] = useState({});

  const tasks = [
    ["Morning Meditation", "07:00 • Wellness"],
    ["Deep Work Session", "09:03 • Work"],
    ["Team Sync", "13:00 • Work"],
    ["Review Goals", "17:00 • Personal"],
  ];
  const toggleCheck = (index) => {
    setChecked((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className=" mb-6 rounded-2xl bg-gradient-to-r from-[#8141EE] to-[#cdc0fe] dark:from-[#6C3ADC] dark:to-[#4E2C9D] px-4  md:px-15.5 text-white shadow-lg py-16 md:py-23">
        <h1 className="mb-2  text-2xl font-semibold md:text-4xl">
          Good Morning Alex !
        </h1>
        <p className="text-base text-purple-100 md:text-lg">
          You have 5 tasks scheduled for today. Let's make it a productive one.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Coach Chat Section */}
   <div className="rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">AI Coach Chat</h2>
        <span className="text-base text-gray-400 dark:text-gray-200 ">2025-12-14</span>
      </div>

      <div className="space-y-5">
        {tasks.map(([title, meta], i) => (
          <div
            key={i}
            className="flex items-center  gap-6 md:gap-10 pb-4 "
          >
            {/* real checkbox */}
            <input
              type="checkbox"
              checked={!!checked[i]}
              onChange={() => toggleCheck(i)}
              className="mt-1 h-4 w-4  accent-[#D9D9D9]"
            />

            <div>
              <h3
                className={`text-base md:text-lg text-center  transition  font-medium dark:text-gray-200 ${
                  checked[i]
                    ? "line-through text-gray-400 dark:text-gray-300"
                    : "text-gray-800"
                }`}
              >
                {title}
              </h3>
              <p
                className={`text-xs ${
                  checked[i] ? "text-gray-400 " : "text-gray-300"
                }`}
              >
                {meta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>


        {/* Daily Quote & AI Coach */}
        <div className="md::space-y-6 space-y-2">
          {/* Daily Quote */}
          <div className="mb-4 flex flex-row items-center gap-6 rounded-xl bg-white dark:bg-zinc-800 px-6 py-6 shadow-md sm:py-8 md:gap-16  md:py-16">
            <div className='px-2  md:px-7.5 dark:text-gray-300'>
              <MessageSquareDot size={28} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100">Daily Quote</h2>

              <p className="text-base text-gray-600 dark:text-gray-300 italic md:text-lg py-2">
                "The only way to do great work is to love what you do."
              </p>
            </div>
          </div>

          {/* AI Coach Chat List */}
          <div className="rounded-xl bg-white dark:bg-zinc-800  p-6 shadow-md">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">AI Coach Chat</h2>
            <div className="">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg p-3 transition"
                >
                  <span className="text-black dark:text-gray-200">Drink 2L Water</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">08</span>
                    <span className="text-yellow-500 text-sm">
                      {/* <Flame /> */}
                    </span>
                    <span className="text-green-500 text-sm">
                      <Check />
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
