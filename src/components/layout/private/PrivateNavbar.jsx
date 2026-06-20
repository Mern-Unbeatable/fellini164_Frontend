import { useEffect, useRef, useState } from 'react';
import { Menu, LogOut, Bell, Settings } from 'lucide-react';

const BREADCRUMBS = [
  { prefix: '/user/tasks', section: 'Work', page: 'Tasks' },
  { prefix: '/user/habits', section: 'Work', page: 'Habits' },
  { prefix: '/user/goals', section: 'Work', page: 'Goals' },
  { prefix: '/user/daily-plan', section: 'Organization', page: 'Planner' },
  { prefix: '/user/weekly-plan', section: 'Organization', page: 'Planner' },
  { prefix: '/user/monthly-plan', section: 'Organization', page: 'Planner' },
  { prefix: '/dashboard', page: 'Dashboard' },
  { prefix: '/settings', page: 'Settings' },
  { prefix: '/user/profile', page: 'Profile' },
  { prefix: '/user/subscription', page: 'Subscription' },
  { prefix: '/user/refer', page: 'Refer a Friend' },
  { prefix: '/user/ai-coach', page: 'AI Coach Chat' },
  { prefix: '/user/analytics', page: 'Analytics' },
];

function getBreadcrumb(pathname) {
  return BREADCRUMBS.find((b) => pathname.startsWith(b.prefix)) || { page: '' };
}

function getInitials(user) {
  const name = user?.name || user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
  return initials.toUpperCase();
}

export default function PrivateNavbar({ pathname, user, onOpenMobileSidebar, onLogout }) {
  const { section, page } = getBreadcrumb(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-[42px] w-full shrink-0 items-center justify-between border-b border-[#f2f2f2] bg-white px-[30px] dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
          className="text-[#5d5d5d] hover:text-gray-600 dark:text-gray-300 dark:hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2.5">
          {section && (
            <>
              <p className="text-[12px] font-medium whitespace-nowrap text-[#5d5d5d] dark:text-gray-300">
                {section}
              </p>
              <span className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-600">/</span>
            </>
          )}
          <p className="text-[12px] font-medium whitespace-nowrap text-[#c2c2c2] dark:text-zinc-500">
            {page}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-5">
          {/* Go to — visible per Figma, non-functional in MVP */}
          <div className="flex w-[105px] shrink-0 items-center gap-1.5 rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] px-2.5 py-[5px] dark:border-zinc-700 dark:bg-zinc-800">
            <p className="min-w-0 flex-1 text-[12px] font-medium whitespace-nowrap text-[#5d5d5d] dark:text-gray-300">
              Go to...
            </p>
            <p className="shrink-0 text-[10px] font-medium whitespace-nowrap text-[#c2c2c2] dark:text-zinc-500">
              Ctrl + K
            </p>
          </div>

          <div className="flex w-[51px] items-center justify-between">
            {/* Notifications — visible per Figma, non-functional in MVP */}
            <div className="relative text-[#5d5d5d] dark:text-gray-300">
              <Bell size={18} strokeWidth={1.75} />
              <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-red-500" />
            </div>
            {/* Settings — visible per Figma, non-functional in MVP */}
            <Settings size={18} className="text-[#5d5d5d] dark:text-gray-300" strokeWidth={1.75} />
          </div>
        </div>

        <div className="h-4 w-px bg-[#f2f2f2] dark:bg-zinc-700" />

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
            <div className="absolute right-0 top-8 z-50 w-36 rounded-lg border border-[#f2f2f2] bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
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
