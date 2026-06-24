import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../../features/auth/authSlice';
import PrivateSidebar from './PrivateSidebar';
import PrivateNavbar from './PrivateNavbar';

export default function PrivateLayout() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [taskDetail, setTaskDetail] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="dashboard-font flex h-screen bg-white dark:bg-zinc-900">
      <PrivateSidebar
        pathname={pathname}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <PrivateNavbar
          pathname={pathname}
          user={user}
          taskDetail={taskDetail}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto bg-[#fcfcfc] px-10 max-lg:px-4 max-lg:sm:px-6 dark:bg-gray-900">
          <Outlet context={{ setTaskDetail }} />
        </main>
      </div>
    </div>
  );
}
