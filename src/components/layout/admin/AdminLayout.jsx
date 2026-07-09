import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../../features/auth/authSlice';
import { useState, useRef, useEffect } from 'react';
import Sidebar from '../Sidebar';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  MessageSquare,
  List,
  Settings as SettingsIcon,
  PanelLeft,
  LogOut,
  Activity,
} from 'lucide-react';

const BREADCRUMBS = [
  { prefix: '/admin/dashboard', section: 'Main', page: 'Dashboard' },
  { prefix: '/admin/users', section: 'Management', page: 'User Management' },
  { prefix: '/admin/waiting-list', section: 'Management', page: 'Waiting List' },
  { prefix: '/admin/finance', section: 'Management', page: 'Finance & Subs' },
  { prefix: '/admin/activity', section: 'Management', page: 'Activity Logs' },
  { prefix: '/admin/content', section: 'Operations', page: 'Content (CMS)' },
  { prefix: '/admin/support', section: 'Operations', page: 'Support & Feedback' },
  { prefix: '/admin/settings', section: 'System', page: 'Settings & Team' },
];

function getBreadcrumb(pathname) {
  return BREADCRUMBS.find((b) => pathname.startsWith(b.prefix)) || { page: 'Overview' };
}

function getInitials(user) {
  const name =
    user?.name || user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  if (!name) return 'AD';
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
  return initials.toUpperCase();
}

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector(selectUser);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { section, page } = getBreadcrumb(pathname);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      section: 'Main',
      items: [{ icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' }],
    },
    {
      section: 'Management',
      items: [
        { icon: Users, label: 'User Management', path: '/admin/users' },
        { icon: List, label: 'Waiting List', path: '/admin/waiting-list' },
        { icon: DollarSign, label: 'Finance & Subs', path: '/admin/finance' },
        { icon: Activity, label: 'Activity Logs', path: '/admin/activity' },
      ],
    },
    {
      section: 'Operations',
      items: [
        { icon: FileText, label: 'Content', path: '/admin/content' },
        // { icon: MessageSquare, label: 'Support & Feedback', path: '/admin/support' },
      ],
    },
    // {
    //   section: 'System',
    //   items: [{ icon: SettingsIcon, label: 'Settings & Team', path: '/admin/settings' }],
    // },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        menuItems={menuItems}
        user={user}
        onLogout={handleLogout}
        showLogout={false}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-13 w-full shrink-0 items-center justify-between gap-3 border-b border-[#f2f2f2] bg-white px-10 max-lg:px-4 max-lg:sm:px-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
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
              <p className="truncate text-[12px] font-medium whitespace-nowrap text-[#c2c2c2] dark:text-zinc-500">
                {page}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-5">
            {/* Settings button */}
            {/* <button
              type="button"
              onClick={() => navigate('/admin/settings')}
              className="flex items-center justify-center p-1 rounded-full text-[#5d5d5d] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition"
              aria-label="Settings"
            >
              <SettingsIcon size={18} strokeWidth={1.75} />
            </button>

            <div className="h-4 w-px bg-[#f2f2f2] dark:bg-zinc-700" /> */}

            {/* Profile Dropdown */}
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
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-600 hover:bg-[#fcfcfc] dark:text-gray-200 dark:hover:bg-zinc-700"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-[#fcfcfc] px-10 max-lg:px-4 max-lg:sm:px-6 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
