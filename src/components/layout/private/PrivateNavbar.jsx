import { Menu, ChevronRight } from 'lucide-react';

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

export default function PrivateNavbar({ pathname, onOpenMobileSidebar }) {
  const { section, page } = getBreadcrumb(pathname);

  return (
    <div className="flex h-[42px] w-full shrink-0 items-center justify-between border-b border-[#f2f2f2] bg-white px-[12px] dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar"
          className="text-[#5d5d5d] hover:text-gray-600 dark:text-gray-300 dark:hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-[10px]">
          {section && (
            <>
              <p className="text-[12px] font-medium whitespace-nowrap text-[#5d5d5d] dark:text-gray-300">
                {section}
              </p>
              <ChevronRight size={12} className="text-[#c2c2c2] dark:text-zinc-600" />
            </>
          )}
          <p className="text-[12px] font-medium whitespace-nowrap text-[#c2c2c2] dark:text-zinc-500">
            {page}
          </p>
        </div>
      </div>
    </div>
  );
}
