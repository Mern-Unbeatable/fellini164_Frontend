import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../../features/auth/authSlice';
import { useState } from 'react';
import Sidebar from '../Sidebar';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  CalendarRange,
  CheckSquare,
  RotateCcw,
  Target,
  Bot,
  TrendingUp,
  Settings,
  User,
  CreditCard,
  Menu,
  Bell,
  UserPlus,
} from 'lucide-react';

const UserLayout = () => {
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
      section: 'MAIN',
      items: [{ icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }],
    },
    {
      section: 'PLANNING',
      items: [
        { icon: Calendar, label: 'Daily Plan', path: '/user/daily-plan' },
        { icon: CalendarDays, label: 'Weekly Plan', path: '/user/weekly-plan' },
        { icon: CalendarRange, label: 'Monthly Plan', path: '/user/monthly-plan' },
      ],
    },
    {
      section: 'FOCUS',
      items: [
        { icon: CheckSquare, label: 'Tasks', path: '/user/tasks' },
        { icon: RotateCcw, label: 'Habits', path: '/user/habits' },
        { icon: Target, label: 'Goals', path: '/user/goals' },
      ],
    },
    {
      section: 'GROWTH',
      items: [
        { icon: Bot, label: 'AI Coach Chat', path: '/user/ai-coach' },
        { icon: TrendingUp, label: 'Analytics', path: '/user/analytics' },
      ],
    },
    {
      section: 'ACCOUNT',
      items: [
        { icon: Settings, label: 'Settings', path: '/settings' },
        { icon: User, label: 'Profile', path: '/user/profile' },
        { icon: CreditCard, label: 'Subscription', path: '/user/subscription' },
        { icon: UserPlus, label: 'Refer a Friend', path: '/user/refer' },
      ],
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
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-4 py-3.5 shadow-sm lg:px-8 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-800 lg:hidden dark:text-gray-300 dark:hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-800 lg:text-2xl dark:text-white">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
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

export default UserLayout;
