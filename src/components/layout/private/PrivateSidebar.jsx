import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  RotateCcw,
  Target,
  Calendar,
  PanelLeft,
  PanelLeftClose,
  PenSquare,
  LayoutDashboard,
  Megaphone,
  Bot,
  Activity,
  Bell,
} from 'lucide-react';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Dashboard has a real page, so it's a working link. Announcements has no page yet —
// stays visible per Figma but inert (see docs/dashboard.md).
const MAIN_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', match: ['/dashboard'] },
  { label: 'Announcements', icon: Megaphone },
];

const ORGANIZATION_ITEMS = [
  { label: 'Planner', icon: Calendar, path: '/user/daily-plan', match: ['/user/daily-plan', '/user/weekly-plan', '/user/monthly-plan'] },
];

const WORK_ITEMS = [
  { label: 'Tasks', icon: CheckSquare, path: '/user/tasks', match: ['/user/tasks'] },
  { label: 'Habits', icon: RotateCcw, path: '/user/habits', match: ['/user/habits'] },
  { label: 'Goals', icon: Target, path: '/user/goals', match: ['/user/goals'] },
];

// Visible in Figma for context only — not functional in MVP (see docs/dashboard.md).
const TOOLS_ITEMS = [
  { label: 'AI Coach', icon: Bot },
  { label: 'Activity', icon: Activity },
  { label: 'Notification', icon: Bell, badge: '+2' },
];

function buildCalendarGrid(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  // Convert Sunday(0)-based getDay() to Monday-first index (0=Mon ... 6=Sun)
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
    <div className="w-full rounded-[10px] border border-gray-100 bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex w-full items-center justify-between border-b border-gray-100 px-2.5 py-1.5 dark:border-zinc-700">
        <p className="text-[12px] font-medium whitespace-nowrap text-gray-400 dark:text-gray-300">
          {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrevMonth}
            aria-label="Previous month"
            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            type="button"
            onClick={goNextMonth}
            aria-label="Next month"
            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-y-1 p-[8px]">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="flex size-[20px] shrink-0 items-center justify-center rounded-[5px] text-[10px] font-medium text-gray-400 dark:text-gray-300"
          >
            {wd}
          </div>
        ))}
        {cells.map((cell, i) => {
          const isToday = isCurrentMonth && !cell.faded && cell.day === today.getDate();
          return (
            <div
              key={i}
              className={`flex size-[20px] shrink-0 items-center justify-center rounded-[5px] text-[10px] font-medium ${
                isToday
                  ? 'bg-[#f9f4ff] text-[#8022fe] dark:bg-purple-950 dark:text-purple-300'
                  : cell.faded
                    ? 'text-gray-200 dark:text-zinc-600'
                    : 'text-gray-400 dark:text-gray-300'
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
      <p className="text-[12px] font-medium text-gray-200 dark:text-zinc-500">{children}</p>
    </div>
  );
}

function NavItem({ item, isActive, collapsed, onNavigate }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={`relative flex h-8.25 w-full items-center gap-2 rounded-[10px] px-2.5 py-1.5 ${
        isActive
          ? 'bg-[#f9f4ff] text-[#8022fe] dark:bg-purple-950 dark:text-purple-300'
          : 'text-gray-400 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800'
      } ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? item.label : undefined}
    >
      {isActive && (
        <span className="absolute left-0 top-[9px] h-[15px] w-[2px] rounded-full bg-[#8022fe]" />
      )}
      <Icon size={18} className="shrink-0" />
      {!collapsed && (
        <p className="min-w-px flex-1 text-[14px] font-medium whitespace-nowrap">{item.label}</p>
      )}
    </Link>
  );
}

// Visual-only match for Figma elements flagged non-functional in MVP (see docs/dashboard.md).
function InertNavItem({ item, collapsed }) {
  const Icon = item.icon;
  return (
    <div
      className={`flex h-8.25 w-full items-center gap-2 rounded-[10px] bg-white px-2.5 py-1.5 text-gray-400 dark:bg-zinc-900 dark:text-gray-300 ${
        collapsed ? 'justify-center' : ''
      }`}
      title={collapsed ? item.label : undefined}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && (
        <>
          <p className="min-w-px flex-1 text-[14px] font-medium whitespace-nowrap">{item.label}</p>
          {item.badge && (
            <span className="shrink-0 rounded-md bg-[rgba(220,38,38,0.05)] px-1.5 py-0.5 text-[12px] font-medium text-[#dc2626]">
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

  const isItemActive = (item) => item.match.some((p) => pathname.startsWith(p));

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-y-auto border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out dark:border-zinc-700 dark:bg-zinc-900 lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-[72px]' : 'w-[200px]'}`}
      >
        {/* Logo / collapse */}
        <div className="flex w-full items-center justify-between border-b border-gray-100 p-[12px] dark:border-zinc-700">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center">
              <img src="/logo.png" alt="Elyxa.Ai" className="h-[18px] w-auto object-contain" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden shrink-0 rounded p-0.5 text-gray-400 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 lg:flex"
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {!collapsed && (
          <div className="flex w-full flex-col items-start gap-2 p-[8px]">
            <MiniCalendar />

            {/* Create — visual only, non-functional in MVP */}
            <div
              className={`flex h-8.25 w-full items-center gap-2 rounded-[10px] border border-gray-100 bg-gray-50 px-2.5 py-1.5 dark:border-zinc-700 dark:bg-zinc-800 ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <PenSquare size={18} className="shrink-0 text-gray-400 dark:text-gray-300" />
              <p className="min-w-px flex-1 text-[14px] font-medium whitespace-nowrap text-gray-400 dark:text-gray-300">
                Create
              </p>
              <p className="shrink-0 text-[10px] font-medium whitespace-nowrap text-gray-200 dark:text-zinc-500">
                Ctrl + Shift + C
              </p>
            </div>
          </div>
        )}

        {/* Main — Dashboard is a working link, Announcements is visual-only (no page yet) */}
        <div className="flex w-full flex-col items-start gap-1.5 px-2 py-3">
          {!collapsed && <SectionSubtitle>Main</SectionSubtitle>}
          <div className="flex w-full flex-col items-start gap-1">
            {MAIN_ITEMS.map((item) =>
              item.path ? (
                <NavItem
                  key={item.label}
                  item={item}
                  collapsed={collapsed}
                  isActive={isItemActive(item)}
                  onNavigate={onCloseMobile}
                />
              ) : (
                <InertNavItem key={item.label} item={item} collapsed={collapsed} />
              )
            )}
          </div>
        </div>

        {/* Organization */}
        <div className="flex w-full flex-col items-start gap-1.5 px-2 py-3">
          {!collapsed && <SectionSubtitle>Organization</SectionSubtitle>}
          {ORGANIZATION_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              collapsed={collapsed}
              isActive={isItemActive(item)}
              onNavigate={onCloseMobile}
            />
          ))}
        </div>

        {/* Work */}
        <div className="flex w-full flex-col items-start gap-1.5 px-2 py-3">
          {!collapsed && <SectionSubtitle>Work</SectionSubtitle>}
          <div className="flex w-full flex-col items-start gap-1">
            {WORK_ITEMS.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                collapsed={collapsed}
                isActive={isItemActive(item)}
                onNavigate={onCloseMobile}
              />
            ))}
          </div>
        </div>

        {/* Tools — visual only, non-functional in MVP */}
        <div className="flex w-full flex-col items-start gap-1.5 px-2 py-3">
          {!collapsed && <SectionSubtitle>Tools</SectionSubtitle>}
          <div className="flex w-full flex-col items-start gap-1">
            {TOOLS_ITEMS.map((item) => (
              <InertNavItem key={item.label} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
