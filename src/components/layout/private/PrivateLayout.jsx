import { useCallback, useRef, useState } from 'react';
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
  const [goalDetail, setGoalDetail] = useState(null);
  const backToTasksBoardRef = useRef(null);
  const backToGoalsBoardRef = useRef(null);

  const setBackToTasksBoard = useCallback((fn) => {
    backToTasksBoardRef.current = typeof fn === 'function' ? fn : null;
  }, []);

  const setBackToGoalsBoard = useCallback((fn) => {
    backToGoalsBoardRef.current = typeof fn === 'function' ? fn : null;
  }, []);

  const handleBackToTasksBoard = useCallback(() => {
    if (pathname.match(/^\/user\/tasks\/[^/]+$/)) {
      navigate('/user/tasks');
      setTaskDetail(null);
      return;
    }
    backToTasksBoardRef.current?.();
    setTaskDetail(null);
  }, [pathname, navigate]);

  const handleBackToGoalsBoard = useCallback(() => {
    if (pathname.match(/^\/user\/goals\/[^/]+$/)) {
      navigate('/user/goals');
      setGoalDetail(null);
      return;
    }
    backToGoalsBoardRef.current?.();
    setGoalDetail(null);
  }, [pathname, navigate]);

  const hasTaskDetail =
    Boolean(taskDetail) || Boolean(pathname.match(/^\/user\/tasks\/[^/]+$/));

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
        onBackToTasksBoard={handleBackToTasksBoard}
        hasTaskDetail={hasTaskDetail}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <PrivateNavbar
          pathname={pathname}
          user={user}
          taskDetail={taskDetail}
          goalDetail={goalDetail}
          onBackToTasksBoard={handleBackToTasksBoard}
          onBackToGoalsBoard={handleBackToGoalsBoard}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={handleLogout}
        />
        <main className="scrollbar-white flex flex-1 flex-col overflow-y-auto bg-[#fcfcfc] px-10 max-lg:px-4 max-lg:sm:px-6 dark:bg-gray-900">
          <Outlet
            context={{
              setTaskDetail,
              setBackToTasksBoard,
              setGoalDetail,
              setBackToGoalsBoard,
            }}
          />
        </main>
      </div>
    </div>
  );
}
