import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../../features/auth/authSlice';
import { selectTheme, toggleTheme } from '../../../features/theme/themeSlice';
import { useState } from 'react';
import Sidebar from '../Sidebar';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  MessageSquare,
  List,
  Settings as SettingsIcon,
  Menu,
  Search,
  Sun,
  Moon,
} from 'lucide-react';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    console.log('Theme changed to:', theme === 'dark' ? 'light' : 'dark');
  };

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
      ],
    },
    {
      section: 'Operations',
      items: [
        { icon: FileText, label: 'Content (CMS)', path: '/admin/content' },
        { icon: MessageSquare, label: 'Support & Feedback', path: '/admin/support' },
      ],
    },
    {
      section: 'System',
      items: [{ icon: SettingsIcon, label: 'Settings & Team', path: '/admin/settings' }],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        menuItems={menuItems}
        user={user}
        onLogout={handleLogout}
        userBadge="AD"
      />

      {/* Main Content */}
      <div className="flex  flex-1 flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="flex w-full items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 lg:px-4">
          <div className="flex items-center justify-center gap-2.5 py-2.5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mr-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 font-['Inter'] text-xl font-semibold text-black dark:text-white lg:text-2xl">
              Overview
            </div>
          </div>
          <div className="mr-8 flex items-center justify-center gap-3.5">
            <div className="hidden w-56 items-center justify-start gap-1.5 rounded-lg border border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3.5 py-1.5 md:flex">
              <Search className="h-4 w-4 text-gray-400 dark:text-white " />
              <input
                type="text"
                placeholder="Global Search"
                className="flex-1 border-none bg-transparent font-['Inter'] text-base font-normal text-gray-400 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-200 outline-none"
              />
            </div>
            <div className="flex items-center justify-start gap-3.5">
              <button
                onClick={handleToggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <div className="hidden h-8 w-px bg-gray-400 dark:bg-gray-600 md:block"></div>
              <div className="flex items-center justify-start">
                <div className="hidden h-7 w-16 flex-col items-center justify-center sm:flex">
                  <div className="font-['Inter'] text-xl font-medium text-black dark:text-white">Admin</div>
                  <div>
                    
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-[#EEEEEE] dark:bg-gray-900 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
