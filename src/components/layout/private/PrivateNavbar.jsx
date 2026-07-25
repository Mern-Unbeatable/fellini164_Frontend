import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, Bell, Settings, PanelLeft } from 'lucide-react';
import {
  selectNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../../features/notifications/notificationsSlice';
import { selectCurrentGoal, selectGoals } from '../../../features/goals/goalsSlice';
import NotificationPanel from './NotificationPanel';

const BREADCRUMBS = [
  { prefix: '/user/tasks', section: 'Work', page: 'Tasks' },
  { prefix: '/user/habits', section: 'Work', page: 'Habits' },
  { prefix: '/user/goals', section: 'Work', page: 'Goals' },
  { prefix: '/user/daily-plan', section: 'Organization', page: 'Planner' },
  { prefix: '/user/weekly-plan', section: 'Organization', page: 'Planner' },
  { prefix: '/user/monthly-plan', section: 'Organization', page: 'Planner' },
  { prefix: '/dashboard', section: 'Main', page: 'Dashboard' },
  { prefix: '/settings', page: 'Settings' },
  { prefix: '/user/profile', page: 'Profile' },
  { prefix: '/user/subscription', page: 'Subscription' },
  { prefix: '/user/refer', page: 'Refer a Friend' },
  { prefix: '/user/ai-coach', section: 'Tools', page: 'AI Coach' },
  { prefix: '/user/activity-log', section: 'Tools', page: 'Activity' },
  { prefix: '/user/notifications', section: 'Tools', page: 'Notification' },
  { prefix: '/user/announcements', section: 'Main', page: 'Announcements' },
  { prefix: '/user/analytics', page: 'Analytics' },
];

function getBreadcrumb(pathname, goals = [], currentGoal = null) {
  const goalDetailMatch = pathname.match(/^\/user\/goals\/([^/]+)$/);
  if (goalDetailMatch) {
    const goalId = goalDetailMatch[1];
    const goal =
      (currentGoal && String(currentGoal.id) === String(goalId) ? currentGoal : null) ||
      goals.find((g) => String(g.id) === String(goalId));
    return {
      section: 'Work',
      page: 'Goals',
      detail: goal?.title ?? 'Goal',
    };
  }
  return BREADCRUMBS.find((b) => pathname.startsWith(b.prefix)) || { page: '' };
}

function getInitials(user) {
  const name =
    user?.name || user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
  return initials.toUpperCase();
}

export default function PrivateNavbar({
  pathname,
  user,
  onOpenMobileSidebar,
  onLogout,
  taskDetail,
  onBackToTasksBoard,
}) {
  const goals = useSelector(selectGoals);
  const currentGoal = useSelector(selectCurrentGoal);
  const { section, page, detail: routeDetail } = getBreadcrumb(pathname, goals, currentGoal);
  const detail = pathname.startsWith('/user/tasks') ? taskDetail : routeDetail;
  const canBackToTasks = pathname.startsWith('/user/tasks') && Boolean(detail);
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const notificationRefMobile = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (
        notificationRef.current && !notificationRef.current.contains(e.target) &&
        notificationRefMobile.current && !notificationRefMobile.current.contains(e.target)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-13 w-full shrink-0 items-center justify-between gap-3 border-b border-[#f2f2f2] bg-white px-10 max-lg:px-4 max-lg:sm:px-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
          className="hidden shrink-0 items-center justify-center rounded-lg p-1.5 text-[#5d5d5d] hover:bg-[#f2f2f2] max-lg:inline-flex dark:text-gray-300 dark:hover:bg-zinc-800"
        >
          <PanelLeft size={20} strokeWidth={1.75} />
        </button>
        <div className="flex min-w-0 items-center gap-2.5">
          {section && (
            <>
              <p className="truncate text-[12px] font-medium whitespace-nowrap text-[#5d5d5d] dark:text-gray-300">
                {section}
              </p>
              <span className="shrink-0 text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-600">
                /
              </span>
            </>
          )}
          {canBackToTasks ? (
            <button
              type="button"
              onClick={onBackToTasksBoard}
              className="truncate text-[12px] font-medium whitespace-nowrap text-[#5d5d5d] hover:text-[#8022fe] dark:text-gray-300"
            >
              {page}
            </button>
          ) : (
            <p
              className={`truncate text-[12px] font-medium whitespace-nowrap ${
                detail ? 'text-[#5d5d5d] dark:text-gray-300' : 'text-[#c2c2c2] dark:text-zinc-500'
              }`}
            >
              {page}
            </p>
          )}
          {detail && (
            <>
              <span className="shrink-0 text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-600">
                /
              </span>
              <p className="truncate text-[12px] font-medium whitespace-nowrap text-[#c2c2c2] dark:text-zinc-500">
                {detail}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-5">
        <div className="flex items-center gap-5 max-lg:hidden">
          {/* Go to — visible per Figma, non-functional in MVP */}
          <div className="flex w-26.25 shrink-0 items-center gap-1.5 rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] px-2.5 py-1.25 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="min-w-0 flex-1 text-[12px] font-medium whitespace-nowrap text-[#5d5d5d] dark:text-gray-300">
              Go to...
            </p>
            <p className="shrink-0 text-[10px] font-medium whitespace-nowrap text-[#c2c2c2] dark:text-zinc-500">
              Ctrl + K
            </p>
          </div>

          <div className="flex w-12.75 items-center justify-between">
            {/* Notifications */}
            <div ref={notificationRef} className="relative text-[#5d5d5d] dark:text-gray-300">
              <button 
                onClick={() => setIsNotificationOpen((o) => !o)}
                className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                <Bell size={18} strokeWidth={1.75} />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-red-500" />
                )}
              </button>
              <NotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                notifications={notifications}
                onMarkAllRead={() => dispatch(markAllNotificationsAsRead())}
                onMarkOneRead={(id) => dispatch(markNotificationAsRead(id))}
              />
            </div>
            {/* Settings — visible per Figma, non-functional in MVP */}
            <Settings size={18} className="text-[#5d5d5d] dark:text-gray-300 cursor-pointer" strokeWidth={1.75} />
          </div>
        </div>

        <div className="h-4 w-px bg-[#f2f2f2] max-lg:hidden dark:bg-zinc-700" />

        {/* Mobile only */}
        <div className="hidden items-center gap-1.5 max-lg:flex">
          <div className="flex w-[105px] shrink-0 items-center gap-1 rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] px-2 py-[5px] dark:border-zinc-700 dark:bg-zinc-800">
            <p className="min-w-0 flex-1 truncate text-[11px] font-medium whitespace-nowrap text-[#5d5d5d] dark:text-gray-300">
              Go to...
            </p>
            <p className="shrink-0 text-[9px] font-medium whitespace-nowrap text-[#c2c2c2] dark:text-zinc-500">
              Ctrl + K
            </p>
          </div>
          <div ref={notificationRefMobile} className="relative text-[#5d5d5d] dark:text-gray-300">
            <button 
              onClick={() => setIsNotificationOpen((o) => !o)}
              className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <Bell size={18} strokeWidth={1.75} />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-red-500" />
              )}
            </button>
            <NotificationPanel
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              notifications={notifications}
              onMarkAllRead={() => dispatch(markAllNotificationsAsRead())}
              onMarkOneRead={(id) => dispatch(markNotificationAsRead(id))}
            />
          </div>
          <Settings size={18} className="text-[#5d5d5d] dark:text-gray-300 cursor-pointer" strokeWidth={1.75} />
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-label="Account menu"
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#8022fe]"
          >
            <p className="text-[10px] font-bold text-white">{getInitials(user)}</p>
          </button>

          {isMenuOpen && (
            <div className="absolute top-8 right-0 z-50 w-36 rounded-lg border border-[#f2f2f2] bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-600 hover:bg-[#fcfcfc] dark:text-gray-200 dark:hover:bg-zinc-700"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
