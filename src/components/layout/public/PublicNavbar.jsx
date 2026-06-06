import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectUser, logout } from '../../../features/auth/authSlice';
import { selectTheme, toggleTheme } from '../../../features/theme/themeSlice';
import { Sun, Moon } from 'lucide-react';

const PublicNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector(selectTheme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Theme toggled to:', newTheme);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveHash(window.location.hash);
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    return user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
  };

  return (
    <nav className="w-full border-gray-100 sticky top-0 z-50 bg-white dark:bg-black dark:text-white shadow-xs">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 relative">
        <div className="flex items-center justify-between py-2 md:py-6 ">
          {/* Logo */}
          <a href="/" className="flex items-center no-underline hover:no-underline">
            <img
              src={theme === 'dark' ? '/WhiteLogo.png' : '/logo.png'}
              alt="Elyxa.Ai"
              className={theme === 'dark' ? 'h-5 md:h-8 ' : 'h-10 lg:h-16'}
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center justify-start gap-12 lg:flex xl:gap-20">
            <div className="flex items-center justify-start gap-6 xl:gap-8">
              <a
                href="/#how-it-works"
                className={`cursor-pointer font-['Inter'] text-sm lg:text-base hover:text-violet-600 transition-colors no-underline hover:no-underline ${activeHash === '#how-it-works' ? 'text-violet-600 font-semibold' : 'text-black dark:text-white font-normal'
                  }`}
              >
                How it Works
              </a>
              {/* <a
                href="/#features"
                className={`cursor-pointer font-['Inter'] text-sm lg:text-base hover:text-violet-600 transition-colors no-underline hover:no-underline ${activeHash === '#features' ? 'text-violet-600 font-semibold' : 'text-black dark:text-white font-normal'
                  }`}
              >
                Features
              </a> */}

              {/* <a
                href="/#pricing"
                className={`cursor-pointer font-['Inter'] text-sm lg:text-base hover:text-violet-600 transition-colors no-underline hover:no-underline ${activeHash === '#pricing' ? 'text-violet-600 font-semibold' : 'text-black dark:text-white font-normal'
                  }`}
              >
                Pricing
              </a> */}
              <a
                href="/early-access"
                className={`cursor-pointer font-['Inter'] text-sm lg:text-base hover:text-violet-600 transition-colors no-underline hover:no-underline ${location.pathname === '/early-access' ? 'text-violet-600 font-semibold' : 'text-black dark:text-white font-normal'
                  }`}
              >
                Early Access
              </a>
              {!isAuthenticated ? (
                <a
                  href="/login"
                  className={`cursor-pointer font-['Inter'] text-sm lg:text-base hover:text-violet-600 transition-colors no-underline hover:no-underline ${location.pathname === '/login' ? 'text-violet-600 font-semibold' : 'text-black dark:text-white font-normal'
                    }`}
                >
                  Login
                </a>
              ) : (
                <a
                  href={getDashboardPath()}
                  className="cursor-pointer font-['Inter'] text-sm font-normal text-black dark:text-white hover:text-violet-600 lg:text-base no-underline hover:no-underline"
                >
                  Dashboard
                </a>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleToggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-slate-700">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            {!isAuthenticated ? (
              <a
                href="/early-access"
                className="flex cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-violet-600 px-6 py-3 shadow-[0px_20px_37px_0px_rgba(188,150,255,1.00)] dark:shadow-[0px_10px_20px_0px_rgba(139,92,246,0.3)] transition-all hover:bg-violet-700 lg:px-8 lg:py-4 no-underline hover:no-underline"
              >
                <span className="font-['Inter'] text-sm font-medium text-white lg:text-base">
                  Early Access
                </span>
              </a>
            ) : (
              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-violet-600 px-6 py-3 shadow-[0px_20px_37px_0px_rgba(188,150,255,0.4)] transition-all hover:bg-violet-700 lg:px-8 lg:py-4"
              >
                <span className="font-['Inter'] text-sm font-medium text-white lg:text-base">
                  Logout
                </span>
              </button>
            )}
          </div>

          {/* Mobile Theme Toggle and Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="flex flex-col gap-1.5 relative w-6 h-6 justify-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <>
                  <span className="absolute h-0.5 w-6 bg-black dark:bg-white transform rotate-45"></span>
                  <span className="absolute h-0.5 w-6 bg-black dark:bg-white transform -rotate-45"></span>
                </>
              ) : (
                <>
                  <span className="h-0.5 w-6 bg-black dark:bg-white"></span>
                  <span className="h-0.5 w-6 bg-black dark:bg-white"></span>
                  <span className="h-0.5 w-6 bg-black dark:bg-white"></span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-black shadow-lg border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4 p-6 lg:hidden">
            <a
              href="/#how-it-works"
              className={`cursor-pointer font-['Inter'] text-base hover:text-violet-600 transition-colors no-underline hover:no-underline ${activeHash === '#how-it-works' ? 'text-violet-600 font-semibold' : 'text-black dark:text-white font-normal'
                }`}
              onClick={toggleMobileMenu}
            >
              How it Works
            </a>
            <a
              href="/#features"
              className={`cursor-pointer font-['Inter'] text-base hover:text-violet-600 transition-colors no-underline hover:no-underline ${activeHash === '#features' ? 'text-violet-600 font-semibold' : 'text-black dark:text-white font-normal'
                }`}
              onClick={toggleMobileMenu}
            >
              Features
            </a>

            {/* <a
              href="/#pricing"
              className={`cursor-pointer font-['Inter'] text-base hover:text-violet-600 transition-colors no-underline hover:no-underline ${activeHash === '#pricing' ? 'text-violet-600 font-semibold' : 'text-black dark:text-white  font-normal'
                }`}
              onClick={toggleMobileMenu}
            >
              Pricing
            </a> */}
            <a
              href="/early-access"
              className={`cursor-pointer font-['Inter'] text-base hover:text-violet-600 transition-colors no-underline hover:no-underline ${location.pathname === '/early-access' ? 'text-violet-600 font-semibold' : 'text-black dark:text-white  font-normal'
                }`}
              onClick={toggleMobileMenu}
            >
              Early Access
            </a>
            {!isAuthenticated ? (
              <a
                href="/login"
                className={`cursor-pointer font-['Inter'] text-base hover:text-violet-600 transition-colors no-underline hover:no-underline ${location.pathname === '/login' ? 'text-violet-600 font-semibold' : 'text-black dark:text-white font-normal'
                  }`}
                onClick={toggleMobileMenu}
              >
                Login
              </a>
            ) : (
              <a
                href={getDashboardPath()}
                className="cursor-pointer font-['Inter'] text-base font-normal text-black dark:text-white hover:text-violet-600 no-underline hover:no-underline"
                onClick={toggleMobileMenu}
              >
                Dashboard
              </a>
            )}
            {!isAuthenticated ? (
              <a
                href="/early-access"
                className="flex cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-violet-600 px-6 py-3 shadow-[0px_10px_20px_0px_rgba(188,150,255,0.4)] dark:shadow-[0px_10px_20px_0px_rgba(139,92,246,0.3)] transition-all hover:bg-violet-700 no-underline hover:no-underline"
                onClick={toggleMobileMenu}
              >
                <span className="font-['Inter'] text-sm font-medium text-white lg:text-base">
                  Early Access
                </span>
              </a>
            ) : (
              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-violet-600 px-6 py-3 transition-all hover:bg-violet-700"
              >
                <span className="font-['Inter'] text-sm font-medium text-white">Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
