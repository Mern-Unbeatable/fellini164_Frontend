import { useEffect, useRef, useState } from 'react';
import { Menu, ChevronRight, LogOut } from 'lucide-react';

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
    <div className="flex h-[42px] w-full shrink-0 items-center justify-between border-b border-gray-100 bg-white px-[12px] dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
          className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-[10px]">
          {section && (
            <>
              <p className="text-[12px] font-medium whitespace-nowrap text-gray-400 dark:text-gray-300">
                {section}
              </p>
              <ChevronRight size={12} className="text-gray-200 dark:text-zinc-600" />
            </>
          )}
          <p className="text-[12px] font-medium whitespace-nowrap text-gray-200 dark:text-zinc-500">
            {page}
          </p>
        </div>
      </div>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen((o) => !o)}
          aria-label="Account menu"
          className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#8022fe]"
        >
          <p className="text-[10px] font-bold text-white">{getInitials(user)}</p>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-[32px] z-50 w-36 rounded-lg border border-gray-100 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-700"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
