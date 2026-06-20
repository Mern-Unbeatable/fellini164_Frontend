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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      <PrivateSidebar
        pathname={pathname}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <PrivateNavbar
          pathname={pathname}
          user={user}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto bg-[#fcfcfc] px-4 sm:px-6 lg:px-[30px] dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
