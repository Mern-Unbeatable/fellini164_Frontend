import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/auth/authSlice';
import { useMemo, useState } from 'react';
import WelcomeHeader from './components/WelcomeHeader';
import DashboardStats from './components/DashboardStats';
import TodayFocusTasks from './components/TodayFocusTasks';
import WeeklyFocus from './components/WeeklyFocus';
import HabitTracker from './components/HabitTracker';
import AiInsights from './components/AiInsights';
import DashboardGoals from './components/DashboardGoals';
import FocusTimeToday from './components/FocusTimeToday';

function getWeekLabel() {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

const UserDashView = () => {
  const user = useSelector(selectUser);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [checkedHabits, setCheckedHabits] = useState({});

  const tasks = [
    {
      id: 1,
      title: 'Interview preparation',
      time: '8:00 AM',
      duration: '30m',
      category: 'Work',
      extra: 'habit',
    },
    {
      id: 2,
      title: 'Research online courses for learning TypeScript',
      time: '9:00 AM',
      duration: '1h',
      category: 'Education',
      extra: 'low priority',
      extraIsPriority: true,
    },
  ];

  const habits = [
    {
      id: 'h1',
      title: 'Morning stretch routine',
      category: 'Personal',
      progress: '0/10',
      streak: 0,
    },
    { id: 'h2', title: 'Evening stretch routine', category: 'Health', progress: '0/7', streak: 0 },
    { id: 'h3', title: 'Mindful breathing breaks', category: 'Health', progress: '0/4', streak: 0 },
  ];

  const toggleTask = (id) => {
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHabit = (id) => {
    setCheckedHabits((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedTasksCount = Object.values(checkedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedTasksCount / Math.max(tasks.length, 1)) * 100) || 0;
  const completedHabits = Object.values(checkedHabits).filter(Boolean).length;
  const habitPercent = Math.round((completedHabits / 6) * 100) || 0;

  const stats = useMemo(
    () => ({
      tasksValue: `${completedTasksCount}/${tasks.length}`,
      tasksSubtitle: `${progressPercent}% completed`,
      focusValue: '0m',
      focusSubtitle: 'Today · nothing logged yet',
      habitValue: `${habitPercent}%`,
      habitSubtitle: `Start today · 6 active habits`,
      goalValue: '0%',
      goalSubtitle: 'No active goals · 3 tracked',
    }),
    [completedTasksCount, habitPercent, progressPercent, tasks.length]
  );

  return (
    <div className="flex flex-col gap-4 py-6 max-lg:py-4 max-lg:sm:py-6">
      <WelcomeHeader
        user={user}
        tasksCount={tasks.length}
        completedTasksCount={completedTasksCount}
        progressPercent={progressPercent}
        firstTask={tasks[0]}
      />

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <TodayFocusTasks
            tasks={tasks}
            checkedTasks={checkedTasks}
            toggleTask={toggleTask}
            doneCount={completedTasksCount}
            plannedLabel="1h 30m planned"
          />
          <WeeklyFocus weekLabel={getWeekLabel()} weekTotal="0h 15m" />
          <HabitTracker
            habits={habits}
            checkedHabits={checkedHabits}
            toggleHabit={toggleHabit}
            shownOf={6}
            todayPercent={habitPercent}
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-1">
          <AiInsights />
          <DashboardGoals />
          <FocusTimeToday loggedLabel="0m logged" footer="plan starts at 8:00 AM" />
        </div>
      </div>
    </div>
  );
};

export default UserDashView;
