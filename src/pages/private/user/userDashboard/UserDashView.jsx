import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import WelcomeHeader from './components/WelcomeHeader';
import DashboardStats from './components/DashboardStats';
import TodayFocusTasks from './components/TodayFocusTasks';
import WeeklyFocus from './components/WeeklyFocus';
import HabitTracker from './components/HabitTracker';
import AiInsights from './components/AiInsights';
import DashboardGoals from './components/DashboardGoals';
import FocusTimeToday from './components/FocusTimeToday';
import {
  fetchDashboard,
  selectDashboardData,
  selectDashboardFocusTime,
  selectDashboardGoals,
  selectDashboardGreeting,
  selectDashboardHabits,
  selectDashboardHabitsMeta,
  selectDashboardInsights,
  selectDashboardLoading,
  selectDashboardProgress,
  selectDashboardSchedule,
  selectDashboardScheduleMeta,
  selectDashboardStats,
  selectDashboardWeeklyFocus,
} from '../../../../features/dashboard/dashboardSlice';
import {
  completeHabitTodayApi,
  undoHabitCompletionApi,
} from '../../../../features/habits/habitsAPI';

const UserDashView = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectDashboardLoading);
  const data = useSelector(selectDashboardData);
  const greeting = useSelector(selectDashboardGreeting);
  const dailyProgress = useSelector(selectDashboardProgress);
  const stats = useSelector(selectDashboardStats);
  const schedule = useSelector(selectDashboardSchedule);
  const scheduleMeta = useSelector(selectDashboardScheduleMeta);
  const weeklyFocus = useSelector(selectDashboardWeeklyFocus);
  const habits = useSelector(selectDashboardHabits);
  const habitsMeta = useSelector(selectDashboardHabitsMeta);
  const insights = useSelector(selectDashboardInsights);
  const goals = useSelector(selectDashboardGoals);
  const focusTimeToday = useSelector(selectDashboardFocusTime);

  const [checkedTasks, setCheckedTasks] = useState({});
  const [checkedHabits, setCheckedHabits] = useState({});
  // Habits with a complete/undo request in flight: their button is disabled and a dashboard
  // refetch must not overwrite their optimistic tick.
  const [pendingHabitIds, setPendingHabitIds] = useState(() => new Set());
  const pendingHabitIdsRef = useRef(new Set());

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (!schedule.length) {
      setCheckedTasks({});
      return;
    }
    const next = {};
    schedule.forEach((item) => {
      next[item.id] = Boolean(item.isCompleted);
    });
    setCheckedTasks(next);
  }, [schedule]);

  useEffect(() => {
    if (!habits.length) {
      setCheckedHabits({});
      return;
    }
    setCheckedHabits((prev) => {
      const next = {};
      habits.forEach((habit) => {
        next[habit.id] = pendingHabitIdsRef.current.has(habit.id)
          ? Boolean(prev[habit.id])
          : Boolean(habit.completedToday);
      });
      return next;
    });
  }, [habits]);

  const toggleTask = (id) => {
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setHabitPending = (id, isPending) => {
    if (isPending) pendingHabitIdsRef.current.add(id);
    else pendingHabitIdsRef.current.delete(id);
    setPendingHabitIds(new Set(pendingHabitIdsRef.current));
  };

  const toggleHabit = async (id) => {
    if (pendingHabitIdsRef.current.has(id)) return;
    const wasDone = Boolean(checkedHabits[id]);
    setHabitPending(id, true);
    setCheckedHabits((prev) => ({ ...prev, [id]: !wasDone }));
    try {
      if (wasDone) await undoHabitCompletionApi(id);
      else await completeHabitTodayApi(id);
      setHabitPending(id, false);
      dispatch(fetchDashboard());
    } catch (error) {
      setHabitPending(id, false);
      setCheckedHabits((prev) => ({ ...prev, [id]: wasDone }));
      toast.error(error?.response?.data?.message || 'Failed to update habit');
    }
  };

  const doneCount = useMemo(
    () => Object.values(checkedTasks).filter(Boolean).length,
    [checkedTasks]
  );

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-6">
        <p className="text-[14px] font-medium text-[#5d5d5d] dark:text-gray-300">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-6 max-lg:py-4 max-lg:sm:py-6">
      <WelcomeHeader
        greeting={greeting}
        dailyProgress={dailyProgress}
        date={data?.date}
      />

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <TodayFocusTasks
            tasks={schedule}
            checkedTasks={checkedTasks}
            toggleTask={toggleTask}
            doneCount={doneCount}
            plannedLabel={scheduleMeta.plannedLabel}
          />
          <WeeklyFocus
            weekLabel={weeklyFocus.weekLabel}
            weekTotal={weeklyFocus.weekTotal}
            days={weeklyFocus.days}
          />
          <HabitTracker
            habits={habits}
            checkedHabits={checkedHabits}
            toggleHabit={toggleHabit}
            pendingHabitIds={pendingHabitIds}
            shownOf={habitsMeta.shownOf}
            todayPercent={habitsMeta.todayPercent}
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-1">
          <AiInsights insights={insights} />
          <DashboardGoals activeGoals={goals.activeGoals} label={goals.label} />
          <FocusTimeToday
            loggedLabel={focusTimeToday.loggedLabel}
            footer={focusTimeToday.footer}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashView;
