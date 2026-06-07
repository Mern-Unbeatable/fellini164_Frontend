import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectUser, logout } from '../../../features/auth/authSlice';

const PublicNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-[#f5f5f5]">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <a href="/" className="flex items-center no-underline hover:no-underline">
            <img src="/logo.png" alt="Elyxa.Ai" className="h-8 md:h-9" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center justify-start gap-10 lg:flex xl:gap-16">
            <div className="flex items-center justify-start gap-6 xl:gap-8">
              <a
                href="/pricing"
                className={`cursor-pointer font-['Inter'] text-sm no-underline transition-colors hover:text-violet-600 hover:no-underline lg:text-base ${
                  location.pathname === '/pricing'
                    ? 'font-semibold text-violet-600'
                    : 'font-normal text-black'
                }`}
              >
                Pricing
              </a>
              <a
                href="/#how-it-works"
                className={`cursor-pointer font-['Inter'] text-sm no-underline transition-colors hover:text-violet-600 hover:no-underline lg:text-base ${
                  location.pathname === '/' && activeHash === '#how-it-works'
                    ? 'font-semibold text-violet-600'
                    : 'font-normal text-black'
                }`}
              >
                How it Works
              </a>
              <a
                href="/faq"
                className={`cursor-pointer font-['Inter'] text-sm no-underline transition-colors hover:text-violet-600 hover:no-underline lg:text-base ${
                  location.pathname === '/faq'
                    ? 'font-semibold text-violet-600'
                    : 'font-normal text-black'
                }`}
              >
                FAQ
              </a>
              <a
                href="/contact"
                className={`cursor-pointer font-['Inter'] text-sm no-underline transition-colors hover:text-violet-600 hover:no-underline lg:text-base ${
                  location.pathname === '/contact'
                    ? 'font-semibold text-violet-600'
                    : 'font-normal text-black'
                }`}
              >
                Contact Us
              </a>
            </div>
            {!isAuthenticated ? (
              <>
                <a
                  href="/signup"
                  className="flex cursor-pointer items-center justify-center rounded-lg bg-violet-600 px-6 py-2.5 no-underline transition-colors hover:bg-violet-700 hover:no-underline"
                >
                  <span className="font-['Inter'] text-sm font-medium text-white lg:text-base">
                    Sign Up
                  </span>
                </a>
                <a
                  href="/login"
                  className={`cursor-pointer font-['Inter'] text-sm no-underline transition-colors hover:text-violet-600 hover:no-underline lg:text-base ${
                    location.pathname === '/login'
                      ? 'font-semibold text-violet-600'
                      : 'font-normal text-black'
                  }`}
                >
                  Log In
                </a>
              </>
            ) : (
              <>
                <a
                  href={getDashboardPath()}
                  className="cursor-pointer font-['Inter'] text-sm font-medium text-black no-underline hover:text-violet-600 hover:no-underline lg:text-base"
                >
                  Dashboard
                </a>
                <button
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center justify-center rounded-lg bg-violet-600 px-6 py-2.5 transition-colors hover:bg-violet-700"
                >
                  <span className="font-['Inter'] text-sm font-medium text-white lg:text-base">
                    Logout
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="relative flex h-6 w-6 flex-col justify-center gap-1.5"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <>
                  <span className="absolute h-0.5 w-6 rotate-45 transform bg-black"></span>
                  <span className="absolute h-0.5 w-6 -rotate-45 transform bg-black"></span>
                </>
              ) : (
                <>
                  <span className="h-0.5 w-6 bg-black"></span>
                  <span className="h-0.5 w-6 bg-black"></span>
                  <span className="h-0.5 w-6 bg-black"></span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 left-0 flex flex-col gap-4 border-t border-gray-100 bg-white p-6 shadow-lg lg:hidden">
            <a
              href="/pricing"
              className={`cursor-pointer font-['Inter'] text-base no-underline transition-colors hover:text-violet-600 hover:no-underline ${
                location.pathname === '/pricing'
                  ? 'font-semibold text-violet-600'
                  : 'font-normal text-black'
              }`}
              onClick={toggleMobileMenu}
            >
              Pricing
            </a>
            <a
              href="/#how-it-works"
              className={`cursor-pointer font-['Inter'] text-base no-underline transition-colors hover:text-violet-600 hover:no-underline ${
                location.pathname === '/' && activeHash === '#how-it-works'
                  ? 'font-semibold text-violet-600'
                  : 'font-normal text-black'
              }`}
              onClick={toggleMobileMenu}
            >
              How it Works
            </a>
            <a
              href="/faq"
              className={`cursor-pointer font-['Inter'] text-base no-underline transition-colors hover:text-violet-600 hover:no-underline ${
                location.pathname === '/faq'
                  ? 'font-semibold text-violet-600'
                  : 'font-normal text-black'
              }`}
              onClick={toggleMobileMenu}
            >
              FAQ
            </a>
            <a
              href="/contact"
              className={`cursor-pointer font-['Inter'] text-base no-underline transition-colors hover:text-violet-600 hover:no-underline ${
                location.pathname === '/contact'
                  ? 'font-semibold text-violet-600'
                  : 'font-normal text-black'
              }`}
              onClick={toggleMobileMenu}
            >
              Contact Us
            </a>
            {!isAuthenticated ? (
              <>
                <a
                  href="/signup"
                  className="flex cursor-pointer items-center justify-center rounded-lg bg-violet-600 px-6 py-3 no-underline transition-colors hover:bg-violet-700 hover:no-underline"
                  onClick={toggleMobileMenu}
                >
                  <span className="font-['Inter'] text-sm font-medium text-white">Sign Up</span>
                </a>
                <a
                  href="/login"
                  className={`cursor-pointer font-['Inter'] text-base no-underline transition-colors hover:text-violet-600 hover:no-underline ${
                    location.pathname === '/login'
                      ? 'font-semibold text-violet-600'
                      : 'font-normal text-black'
                  }`}
                  onClick={toggleMobileMenu}
                >
                  Log In
                </a>
              </>
            ) : (
              <>
                <a
                  href={getDashboardPath()}
                  className="cursor-pointer font-['Inter'] text-base font-medium text-black no-underline hover:text-violet-600 hover:no-underline"
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </a>
                <button
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center justify-center rounded-lg bg-violet-600 px-6 py-3 transition-colors hover:bg-violet-700"
                >
                  <span className="font-['Inter'] text-sm font-medium text-white">Logout</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
