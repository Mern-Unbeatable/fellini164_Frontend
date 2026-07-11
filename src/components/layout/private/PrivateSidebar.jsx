import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUnreadNotificationCount } from '../../../features/notifications/notificationsSlice';
import {
  ChevronLeft,
  ChevronRight,
  ListTodo,
  RotateCcw,
  Target,
  Calendar,
  PanelLeft,
  PanelLeftClose,
  PenSquare,
  LayoutDashboard,
  Megaphone,
  Sparkles,
  Activity,
  Bell,
  X,
} from 'lucide-react';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MAIN_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', match: ['/dashboard'] },
  { label: 'Announcements', icon: Megaphone, path: '/user/announcements', match: ['/user/announcements'] },
];

const ORGANIZATION_ITEMS = [
  { label: 'Planner', icon: Calendar, path: '/user/daily-plan', match: ['/user/daily-plan', '/user/weekly-plan', '/user/monthly-plan'] },
];

const WORK_ITEMS = [
  { label: 'Tasks', icon: ListTodo, path: '/user/tasks', match: ['/user/tasks'] },
  { label: 'Habits', icon: RotateCcw, path: '/user/habits', match: ['/user/habits'] },
  { label: 'Goals', icon: Target, path: '/user/goals', match: ['/user/goals'] },
];

const TOOLS_ITEMS = [
  { label: 'AI Coach', icon: Sparkles,path: '/user/ai-coach', match: ['/user/ai-coach'] },
  { label: 'Activity', icon: Activity, path: '/user/activity-log', match: ['/user/activity-log'] },
  { label: 'Notification', icon: Bell, path: '/user/notifications', match: ['/user/notifications'] },
];

function buildCalendarGrid(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const leadingBlank = (firstOfMonth.getDay() + 6) % 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = leadingBlank - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, faded: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, faded: false });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay++, faded: true });
  }
  return cells;
}

function MiniCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const cells = buildCalendarGrid(viewDate);
  const isCurrentMonth =
    viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();

  const goPrevMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNextMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className="w-full rounded-[10px] border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex w-full items-center justify-between border-b border-[#f2f2f2] px-2.5 py-1.5 dark:border-zinc-700">
        <p className="text-[12px] font-medium whitespace-nowrap text-[#5d5d5d] dark:text-gray-300">
          {SHORT_MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrevMonth}
            aria-label="Previous month"
            className="rounded p-0.5 text-[#5d5d5d] hover:bg-[#f2f2f2] dark:text-gray-300 dark:hover:bg-zinc-700"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            type="button"
            onClick={goNextMonth}
            aria-label="Next month"
            className="rounded p-0.5 text-[#5d5d5d] hover:bg-[#f2f2f2] dark:text-gray-300 dark:hover:bg-zinc-700"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-x-[4.66px] gap-y-1 p-2">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="mx-auto flex size-[20px] items-center justify-center rounded-[5px] text-[10px] font-medium text-[#5d5d5d] dark:text-gray-300"
          >
            {wd}
          </div>
        ))}
        {cells.map((cell, i) => {
          const isToday = isCurrentMonth && !cell.faded && cell.day === today.getDate();
          return (
            <div
              key={i}
              className={`mx-auto flex size-[20px] items-center justify-center rounded-[5px] text-[10px] font-medium ${
                isToday
                  ? 'bg-[#f9f4ff] text-[#8022fe] dark:bg-purple-950 dark:text-purple-300'
                  : cell.faded
                    ? 'text-[#c2c2c2] dark:text-zinc-600'
                    : 'text-[#5d5d5d] dark:text-gray-300'
              }`}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionSubtitle({ children }) {
  return (
    <div className="flex w-full items-center px-2.5">
      <p className="flex-1 text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">{children}</p>
    </div>
  );
}

function NavItem({ item, isActive, collapsed, onNavigate }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={`relative flex h-[33px] w-full items-center gap-2 rounded-[10px] px-2.5 py-1.5 no-underline ${
        isActive
          ? 'bg-[#f9f4ff] text-[#8022fe] dark:bg-purple-950 dark:text-purple-300'
          : 'bg-white text-[#5d5d5d] hover:bg-[#fcfcfc] dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800'
      } ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? item.label : undefined}
    >
      {isActive && (
        <span className="absolute left-0 top-[9px] h-[15px] w-[2px] rounded-r-xl bg-[#8022fe]" />
      )}
      <Icon size={18} className="shrink-0" strokeWidth={1.75} />
      {!collapsed && (
        <>
          <p className="min-w-0 flex-1 text-[14px] font-medium whitespace-nowrap">{item.label}</p>
          {item.badge && (
            <span className="shrink-0 rounded-md bg-[rgba(220,38,38,0.05)] px-1.5 py-0.5 text-[12px] font-medium uppercase leading-normal text-[#dc2626]">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

function InertNavItem({ item, collapsed }) {
  const Icon = item.icon;
  return (
    <div
      className={`flex h-[33px] w-full items-center gap-2 rounded-[10px] bg-white px-2.5 py-1.5 text-[#5d5d5d] dark:bg-zinc-900 dark:text-gray-300 ${
        collapsed ? 'justify-center' : ''
      }`}
      title={collapsed ? item.label : undefined}
    >
      <Icon size={18} className="shrink-0" strokeWidth={1.75} />
      {!collapsed && (
        <>
          <p className="min-w-0 flex-1 text-[14px] font-medium whitespace-nowrap">{item.label}</p>
          {item.badge && (
            <span className="shrink-0 rounded-md bg-[rgba(220,38,38,0.05)] px-1.5 py-0.5 text-[12px] font-medium uppercase leading-normal text-[#dc2626]">
              {item.badge}
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default function PrivateSidebar({ pathname, isMobileOpen, onCloseMobile }) {
  const [collapsed, setCollapsed] = useState(false);
  const showExpanded = !collapsed || isMobileOpen;
  const unreadCount = useSelector(selectUnreadNotificationCount);

  const isItemActive = (item) => item.match.some((p) => pathname.startsWith(p));
  const withUnreadBadge = (item) =>
    item.path === '/user/notifications' && unreadCount > 0
      ? { ...item, badge: `+${unreadCount}` }
      : item;

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-lg lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`scrollbar-hidden fixed inset-y-0 left-0 z-50 flex h-screen w-[220px] flex-col overflow-y-auto border-r border-[#f2f2f2] bg-white transition-transform duration-300 ease-in-out dark:border-zinc-700 dark:bg-zinc-900 lg:static lg:translate-x-0 max-lg:w-[75%] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-[72px]' : ''}`}
      >
        <div
          className={`flex h-[52px] w-full shrink-0 items-center border-b border-[#f2f2f2] px-[12px] dark:border-zinc-700 ${
            showExpanded ? 'justify-between' : 'justify-center'
          }`}
        >
          {showExpanded && (
            <Link to="/" onClick={onCloseMobile} className="flex h-[30px] w-[133px] shrink-0 items-center no-underline">
              <img
                src="/logo.png"
                alt="Elyxa.Ai"
                width={133}
                height={30}
                className="h-[30px] w-[133px] shrink-0 object-contain object-left"
              />
            </Link>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="inline-flex shrink-0 items-center justify-center rounded-lg p-1.5 text-[#5d5d5d] hover:bg-[#f2f2f2] lg:hidden dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden shrink-0 text-[#c2c2c2] hover:text-[#5d5d5d] dark:text-zinc-500 dark:hover:text-gray-300 lg:flex"
          >
            {collapsed ? (
              <PanelLeft size={18} strokeWidth={1.5} />
            ) : (
              <PanelLeftClose size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {showExpanded && (
          <div className="flex w-full flex-col items-start gap-2 p-[8px]">
            <MiniCalendar />

            {/* Create — visible per Figma, non-functional in MVP */}
            <div className="flex h-[33px] w-full items-center gap-2 rounded-[10px] border border-[#f2f2f2] bg-[#fcfcfc] px-2.5 py-1.5 dark:border-zinc-700 dark:bg-zinc-800">
              <PenSquare size={18} className="shrink-0 text-[#5d5d5d] dark:text-gray-300" strokeWidth={1.75} />
              <p className="min-w-0 flex-1 text-[14px] font-medium whitespace-nowrap text-[#5d5d5d] dark:text-gray-300">
                Create
              </p>
              <p className="shrink-0 text-[10px] font-medium whitespace-nowrap text-[#c2c2c2] dark:text-zinc-500">
                Ctrl + Shift + C
              </p>
            </div>
          </div>
        )}

        <div className="flex w-full flex-col gap-1.5 px-2 py-3">
          {showExpanded && <SectionSubtitle>Main</SectionSubtitle>}
          <div className="flex w-full flex-col gap-1">
            {MAIN_ITEMS.map((item) =>
              item.path ? (
                <NavItem
                  key={item.label}
                  item={item}
                  collapsed={!showExpanded}
                  isActive={isItemActive(item)}
                  onNavigate={onCloseMobile}
                />
              ) : (
                <InertNavItem key={item.label} item={item} collapsed={!showExpanded} />
              )
            )}
          </div>
        </div>

        <div className="flex w-full flex-col gap-1.5 px-2 py-3">
          {showExpanded && <SectionSubtitle>Organization</SectionSubtitle>}
          {ORGANIZATION_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              collapsed={!showExpanded}
              isActive={isItemActive(item)}
              onNavigate={onCloseMobile}
            />
          ))}
        </div>

        <div className="flex w-full flex-col gap-1.5 px-2 py-3">
          {showExpanded && <SectionSubtitle>Work</SectionSubtitle>}
          <div className="flex w-full flex-col gap-1">
            {WORK_ITEMS.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                collapsed={!showExpanded}
                isActive={isItemActive(item)}
                onNavigate={onCloseMobile}
              />
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-1.5 px-2 py-3">
          {showExpanded && <SectionSubtitle>Tools</SectionSubtitle>}
          <div className="flex w-full flex-col gap-1">
            {TOOLS_ITEMS.map((rawItem) => {
              const item = withUnreadBadge(rawItem);
              return item.path ? (
                <NavItem
                  key={item.label}
                  item={item}
                  collapsed={!showExpanded}
                  isActive={isItemActive(item)}
                  onNavigate={onCloseMobile}
                />
              ) : (
                <InertNavItem key={item.label} item={item} collapsed={!showExpanded} />
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
