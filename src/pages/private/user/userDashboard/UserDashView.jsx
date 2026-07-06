import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/auth/authSlice';
import { useState } from 'react';
import WelcomeHeader from './components/WelcomeHeader';
import FocusAnalytics from './components/FocusAnalytics';
import DailyQuote from './components/DailyQuote';
import TodayFocusTasks from './components/TodayFocusTasks';
import HabitTracker from './components/HabitTracker';

const UserDashView = () => {
  const user = useSelector(selectUser);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [checkedHabits, setCheckedHabits] = useState({});

  const tasks = [
    { id: 1, title: 'Morning Meditation', time: '07:00', category: 'Wellness', duration: '15 Min' },
    { id: 2, title: 'Deep Work Session', time: '09:30', category: 'Work', duration: '90 Min' },
    {
      id: 3,
      title: 'Team Sync & Retrospective',
      time: '13:00',
      category: 'Work',
      duration: '45 Min',
    },
    {
      id: 4,
      title: 'Review Goals & Plan Tomorrow',
      time: '17:00',
      category: 'Personal',
      duration: '20 Min',
    },
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

  const completedTasksCount = Object.values(checkedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedTasksCount / tasks.length) * 100) || 0;

  return (
    <div className="space-y-6 py-6 max-lg:py-4 max-lg:sm:py-6">
      {/* Welcome Header */}
      <WelcomeHeader
        user={user}
        tasksCount={tasks.length}
        completedTasksCount={completedTasksCount}
        progressPercent={progressPercent}
      />

      {/* Row 1: Focus Analytics & Daily Quote */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Focus Analytics */}
        <div className="lg:col-span-2">
          <FocusAnalytics />
        </div>

        {/* Daily Quote */}
        <div className="lg:col-span-1">
          <DailyQuote />
        </div>
      </div>

      {/* Row 2: Today's Focus Tasks & Habits */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Focus Tasks */}
        <div className="lg:col-span-2">
          <TodayFocusTasks
            tasks={tasks}
            checkedTasks={checkedTasks}
            toggleTask={toggleTask}
          />
        </div>

        {/* Habits Tracker */}
        <div className="flex h-full flex-col gap-6 lg:col-span-1">
          <HabitTracker
            habits={habits}
            checkedHabits={checkedHabits}
            toggleHabit={toggleHabit}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashView;
