import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../../features/auth/authSlice';
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
} from 'lucide-react';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-2 lg:px-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-center gap-2.5 py-2.5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mr-2 text-gray-600 hover:text-gray-800 lg:hidden dark:text-gray-300 dark:hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 font-['Inter'] text-xl font-semibold text-black lg:text-2xl dark:text-white">
              Overview
            </div>
          </div>
          <div className="mr-8 flex items-center justify-center gap-3.5">
            <div className="hidden w-56 items-center justify-start gap-1.5 rounded-lg border border-gray-400 bg-gray-50 px-3.5 py-1.5 md:flex dark:border-gray-600 dark:bg-gray-700">
              <Search className="h-4 w-4 text-gray-400 dark:text-white" />
              <input
                type="text"
                placeholder="Global Search"
                className="flex-1 border-none bg-transparent font-['Inter'] text-base font-normal text-gray-400 placeholder-gray-400 outline-none dark:text-gray-300 dark:placeholder-gray-200"
              />
            </div>
            <div className="flex items-center justify-start gap-3.5">
              <div className="hidden h-8 w-px bg-gray-400 md:block dark:bg-gray-600"></div>
              <div className="flex items-center justify-start">
                <div className="hidden h-7 w-16 flex-col items-center justify-center sm:flex">
                  <div className="font-['Inter'] text-xl font-medium text-black dark:text-white">
                    Admin
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#EEEEEE] dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
