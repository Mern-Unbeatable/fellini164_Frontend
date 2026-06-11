import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { selectIsAuthenticated, selectUser, logout } from '../../../features/auth/authSlice';

const NAV_LINKS = [
  { label: 'Pricing', href: '/pricing', path: '/pricing' },
  { label: 'How It Works', href: '/#how-it-works', path: '/', hash: '#how-it-works' },
  { label: 'FAQ', href: '/faq', path: '/faq' },
  { label: 'Contact Us', href: '/contact', path: '/contact' },
];

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
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [location]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getDashboardPath = () => (user?.role === 'admin' ? '/admin/dashboard' : '/dashboard');

  const isActive = (link) => {
    if (link.hash) return location.pathname === link.path && activeHash === link.hash;
    return location.pathname === link.path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(24,24,24,0.5)] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="sticky top-0 z-50 mx-5 pt-5">
        {/* Navbar bar — full width of the mx-5 area */}
        <nav className="relative rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] shadow-[0px_5px_12.5px_rgba(0,0,0,0.05)] lg:rounded-2xl">
          {/* Header row — full width, no container max-width override */}
          <div className="flex h-11 w-full items-center justify-between px-4 lg:h-13.25 lg:px-8">
            {/* Logo */}
            <a href="/" className="flex shrink-0 items-center no-underline hover:no-underline">
              <img src="/logo.png" alt="Elyxa.Ai" className="h-[26px] w-auto lg:h-[33px]" />
            </a>

            {/* Desktop nav links */}
            <div className="hidden items-center gap-[50px] lg:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-['Inter',sans-serif] text-[14px] font-semibold no-underline transition-colors hover:text-[#8022fe] hover:no-underline ${
                    isActive(link) ? 'text-[#8022fe]' : 'text-[#181818]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop action links */}
            <div className="hidden items-center gap-[30px] lg:flex">
              {!isAuthenticated ? (
                <>
                  <a
                    href="/signup"
                    className="flex items-center justify-center rounded-[8px] bg-[#8022fe] px-[16px] py-[8px] font-['Inter',sans-serif] text-[14px] font-semibold text-white no-underline transition-colors hover:bg-[#6b1bdb] hover:no-underline"
                  >
                    Sign Up
                  </a>
                  <a
                    href="/login"
                    className={`font-['Inter',sans-serif] text-[14px] font-semibold no-underline transition-colors hover:text-[#8022fe] hover:no-underline ${
                      location.pathname === '/login' ? 'text-[#8022fe]' : 'text-[#181818]'
                    }`}
                  >
                    Log In
                  </a>
                </>
              ) : (
                <>
                  <a
                    href={getDashboardPath()}
                    className="font-['Inter',sans-serif] text-[14px] font-semibold text-[#181818] no-underline hover:text-[#8022fe] hover:no-underline"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center rounded-[8px] bg-[#8022fe] px-[16px] py-[8px] font-['Inter',sans-serif] text-[14px] font-semibold text-white transition-colors hover:bg-[#6b1bdb]"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile right side */}
            <div className="flex items-center gap-5 lg:hidden">
              {!isAuthenticated && (
                <div className="flex items-center gap-4">
                  <a
                    href="/signup"
                    className="flex items-center justify-center rounded-[6px] bg-[#8022fe] px-3 py-1.5 font-['Inter',sans-serif] text-[12px] font-semibold text-white no-underline transition-colors hover:bg-[#6b1bdb] hover:no-underline"
                  >
                    Sign Up
                  </a>
                  <a
                    href="/login"
                    className="font-['Inter',sans-serif] text-[12px] font-semibold text-[#181818] no-underline hover:text-[#8022fe] hover:no-underline"
                  >
                    Log In
                  </a>
                </div>
              )}
              <button
                onClick={toggleMobileMenu}
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[#f9f4ff] transition-colors hover:bg-[#f0e8ff]"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4 text-[#8022fe]" />
                ) : (
                  <Menu className="h-4 w-4 text-[#8022fe]" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile dropdown — absolute card below the nav pill */}
          {isMobileMenuOpen && (
            <div className="absolute top-[calc(100%+10px)] -right-px -left-px z-50 overflow-hidden rounded-[14px] border border-[#f2f2f2] bg-[#fcfcfc] shadow-[0px_5.667px_11.334px_rgba(0,0,0,0.05)] lg:hidden">
              <div className="flex flex-col items-center gap-7.5 p-5">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-['Inter',sans-serif] text-[14px] font-semibold no-underline transition-colors hover:text-[#8022fe] hover:no-underline ${
                      isActive(link) ? 'text-[#8022fe]' : 'text-[#181818]'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="border-t border-[#f2f2f2] p-4">
                {!isAuthenticated ? (
                  <a
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-[10px] border-2 border-[#8022fe] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold text-[#8022fe] no-underline transition-colors hover:bg-[#f9f4ff] hover:no-underline"
                  >
                    Get Your First Plan
                  </a>
                ) : (
                  <div className="flex flex-col gap-3">
                    <a
                      href={getDashboardPath()}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-[10px] bg-[#8022fe] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold text-white no-underline hover:bg-[#6b1bdb] hover:no-underline"
                    >
                      Dashboard
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center rounded-[10px] border-2 border-[#8022fe] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold text-[#8022fe] transition-colors hover:bg-[#f9f4ff]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default PublicNavbar;
