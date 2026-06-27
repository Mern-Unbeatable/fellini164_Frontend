import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';
import { 
  Check, 
  Flame, 
  MessageSquareDot, 
  Sparkles, 
  Clock, 
  Target, 
  Zap, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Award 
} from 'lucide-react';
import { useState } from 'react';

const UserDashView = () => {
  const user = useSelector(selectUser);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [checkedHabits, setCheckedHabits] = useState({});

  const tasks = [
    { id: 1, title: 'Morning Meditation', time: '07:00', category: 'Wellness', duration: '15 Min' },
    { id: 2, title: 'Deep Work Session', time: '09:30', category: 'Work', duration: '90 Min' },
    { id: 3, title: 'Team Sync & Retrospective', time: '13:00', category: 'Work', duration: '45 Min' },
    { id: 4, title: 'Review Goals & Plan Tomorrow', time: '17:00', category: 'Personal', duration: '20 Min' },
  ];

  const habits = [
    { id: 'h1', title: 'Drink 2L Water', streak: 8 },
    { id: 'h2', title: 'Read 10 Pages', streak: 12 },
    { id: 'h3', title: 'Stretch / Exercise', streak: 4 },
  ];

  const toggleTask = (id) => {
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHabit = (id) => {
    setCheckedHabits((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const completedTasksCount = Object.values(checkedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedTasksCount / tasks.length) * 100) || 0;

  return (
    <div className="space-y-6 py-6 max-lg:py-4 max-lg:sm:py-6">
      
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] px-6 py-10 text-white shadow-md md:px-10 md:py-12 dark:from-[#6C3ADC] dark:to-[#4E2C9D]">
        {/* Subtle Decorative Circles */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-black/10 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles size={12} /> Today's Focus
            </span>
            <h1 className="text-2xl font-bold md:text-3.5xl">
              {getGreeting()}, {(user?.fullName || user?.firstName || user?.name || 'Achiever').split(' ')[0]}!
            </h1>
            <p className="text-sm text-purple-100/90 max-w-xl">
              You have {tasks.length} core tasks planned for today. Let's aim to unlock your best productivity state.
            </p>
          </div>
          
          {/* Quick Progress Badge */}
          <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15">
              <span className="text-sm font-bold">{progressPercent}%</span>
            </div>
            <div>
              <div className="text-xs font-medium text-purple-200">Daily progress</div>
              <div className="text-sm font-bold text-white">
                {completedTasksCount} of {tasks.length} Completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column: Today's Tasks & AI Coach Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Tasks */}
          <div className="rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-[#181818] lg:text-[14px] dark:text-white flex items-center gap-2">
                  <Target size={16} className="text-[#8022fe]" /> Today's Focus Tasks
                </h2>
                <p className="text-[11px] text-[#a3a3a3] dark:text-zinc-400 mt-0.5">High-priority tasks scheduled for today</p>
              </div>
              <span className="text-[12px] font-medium text-[#8022fe] bg-[#f9f4ff] px-2 py-0.75 rounded-md dark:bg-zinc-700 dark:text-gray-300">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                    checkedTasks[task.id]
                      ? 'border-[#f2f2f2] bg-white opacity-60 dark:border-zinc-700/30 dark:bg-zinc-900/30'
                      : 'border-[#f2f2f2] bg-white hover:border-[#8022fe]/30 hover:shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] dark:border-zinc-700/50 dark:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition duration-150 ${
                      checkedTasks[task.id]
                        ? 'border-[#8022fe] bg-[#8022fe] text-white'
                        : 'border-gray-300 dark:border-zinc-600'
                    }`}>
                      {checkedTasks[task.id] && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div className="min-w-0">
                      <h3
                        className={`truncate text-[14px] font-medium transition duration-150 lg:text-[13px] dark:text-gray-200 ${
                          checkedTasks[task.id]
                            ? 'text-gray-400 line-through dark:text-gray-500'
                            : 'text-[#181818]'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[11px] text-[#a3a3a3] dark:text-zinc-500">
                          <Clock size={10} /> {task.time} ({task.duration})
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-[6px] ${
                    task.category === 'Wellness' 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : task.category === 'Work'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                      : 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400'
                  }`}>
                    {task.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Coach Suggestion / Insight Box */}
          <div className="rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f9f4ff] text-[#8022fe] dark:bg-zinc-700 dark:text-gray-300">
                <Sparkles size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-[#181818] lg:text-[13px] dark:text-white">
                    Coach Insight
                  </h3>
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded dark:bg-emerald-900/20 dark:text-emerald-400">
                    AI Active
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600 dark:text-gray-300">
                  You typically complete wellness tasks earlier in the morning. Try scheduling <strong className="text-[#181818] dark:text-white font-medium">Morning Meditation</strong> first thing to maintain your streak!
                </p>
                <div className="mt-3.5 flex items-center gap-3">
                  <button className="text-[12px] font-semibold text-[#8022fe] bg-[#f9f4ff] hover:bg-[#ebdcfc] px-3.5 py-1.5 rounded-lg transition dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600">
                    Apply Schedule
                  </button>
                  <button className="text-[12px] font-medium text-gray-500 hover:text-[#181818] transition dark:text-gray-400 dark:hover:text-white">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Daily Quote, Habits, Quick Stats */}
        <div className="space-y-6">
          
          {/* Daily Quote */}
          <div className="flex items-start gap-4 rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f9f4ff] text-[#8022fe] dark:bg-zinc-700 dark:text-gray-300">
              <MessageSquareDot size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="mb-1.5 text-[14px] font-semibold text-[#181818] lg:text-[13px] dark:text-white">
                Daily Quote
              </h2>
              <p className="text-[13px] leading-relaxed text-gray-600 italic dark:text-gray-300">
                "The only way to do great work is to love what you do."
              </p>
              <span className="block mt-1 text-[11px] text-gray-400 font-medium">— Steve Jobs</span>
            </div>
          </div>

          {/* Quick Metrics Widget */}
          <div className="rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5 dark:border-zinc-700 dark:bg-zinc-800">
            <h2 className="mb-4 text-[14px] font-semibold text-[#181818] lg:text-[13px] dark:text-white flex items-center gap-2">
              <TrendingUp size={15} className="text-[#8022fe]" /> Focus Analytics
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-zinc-900/50 p-3 rounded-xl border border-[#f2f2f2] dark:border-zinc-700/50">
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Focus Streak</div>
                <div className="text-[18px] font-bold text-[#181818] dark:text-white mt-1 flex items-center gap-1.5">
                  <Flame size={16} className="text-orange-500 fill-orange-500" /> 14 Days
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900/50 p-3 rounded-xl border border-[#f2f2f2] dark:border-zinc-700/50">
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Goal Score</div>
                <div className="text-[18px] font-bold text-[#181818] dark:text-white mt-1 flex items-center gap-1.5">
                  <Award size={16} className="text-[#8022fe]" /> 98%
                </div>
              </div>
            </div>
          </div>

          {/* Habit Tracker */}
          <div className="rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-[14px] font-semibold text-[#181818] lg:text-[13px] dark:text-white">
                  Habit Tracker
                </h2>
                <p className="text-[11px] text-[#a3a3a3] dark:text-zinc-400 mt-0.5">Quick update today's habits</p>
              </div>
              <Zap size={14} className="text-yellow-500 fill-yellow-500" />
            </div>
            
            <div className="space-y-2.5">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="flex items-center justify-between rounded-xl border border-[#f2f2f2] bg-white p-3 transition hover:shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] cursor-pointer dark:border-zinc-700/50 dark:bg-zinc-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition duration-150 ${
                      checkedHabits[habit.id]
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-gray-300 dark:border-zinc-600'
                    }`}>
                      {checkedHabits[habit.id] && <Check size={10} strokeWidth={3.5} />}
                    </div>
                    <span className="text-[13px] font-medium text-[#181818] dark:text-gray-200">
                      {habit.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                      {habit.streak + (checkedHabits[habit.id] ? 1 : 0)}
                    </span>
                    <span className="text-yellow-500">
                      <Flame size={14} className="fill-yellow-500/20" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default UserDashView;
