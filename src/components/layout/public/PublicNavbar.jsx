import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { selectIsAuthenticated, selectUser, logout } from '../../../features/auth/authSlice';

const NAV_LINKS = [
  { label: 'Pricing', href: '/pricing', path: '/pricing' },
  { label: 'How It Works', href: '/#adapts-section', path: '/', hash: '#adapts-section' },
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

  const dropdownRef = useRef(null);
  const linksContainerRef = useRef(null);
  const ctaSectionRef = useRef(null);

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

  // Animate dropdown when it opens
  useEffect(() => {
    if (!isMobileMenuOpen || !dropdownRef.current) return;

    const dropdown = dropdownRef.current;
    const links = linksContainerRef.current ? Array.from(linksContainerRef.current.children) : [];
    const cta = ctaSectionRef.current;

    gsap.set(dropdown, { opacity: 0, y: -10 });
    gsap.set(links, { opacity: 0, y: 8 });
    if (cta) gsap.set(cta, { opacity: 0, y: 8 });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.to(dropdown, { opacity: 1, y: 0, duration: 0.22 })
      .to(links, { opacity: 1, y: 0, duration: 0.28, stagger: 0.07 }, '-=0.1')
      .to(cta, { opacity: 1, y: 0, duration: 0.22 }, '-=0.1');

    return () => tl.kill();
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getDashboardPath = () => (user?.role === 'admin' ? '/admin/dashboard' : '/dashboard');

  const isActive = (link) => {
    if (link.label === 'How It Works') {
      return location.pathname === '/how-it-works' || (location.pathname === '/' && activeHash === '#adapts-section');
    }
    if (link.hash) return location.pathname === link.path && activeHash === link.hash;
    return location.pathname === link.path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(24,24,24,0.5)] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="sticky top-0 z-50 mx-5 pt-5">
        <nav className="relative rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] shadow-[0px_5px_12.5px_rgba(0,0,0,0.05)] md:rounded-2xl">
          <div className="container mx-auto flex h-11 items-center justify-between px-4 sm:px-6 md:h-13.25 md:px-8 lg:px-20">
            {/* Logo */}
            <a href="/" className="flex shrink-0 items-center no-underline hover:no-underline">
              <img src="/logo.png" alt="Elyxa.Ai" className="h-6.5 w-auto md:h-8.25" />
            </a>

            {/* Desktop/tablet nav links */}
            <div className="hidden items-center gap-6 md:flex lg:gap-12.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-['Inter',sans-serif] text-[14px] font-semibold whitespace-nowrap no-underline transition-colors hover:text-[#8022fe] hover:no-underline ${
                    isActive(link) ? 'text-[#8022fe]' : 'text-[#181818]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop/tablet action links */}
            <div className="hidden items-center gap-7.5 md:flex">
              {!isAuthenticated ? (
                <>
                  <a
                    href="/signup"
                    className="flex items-center justify-center rounded-lg bg-[#8022fe] px-4 py-2 font-['Inter',sans-serif] text-[14px] font-semibold text-white no-underline transition-colors hover:bg-[#6b1bdb] hover:no-underline"
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
                    className="flex items-center justify-center rounded-lg bg-[#8022fe] px-4 py-2 font-['Inter',sans-serif] text-[14px] font-semibold text-white transition-colors hover:bg-[#6b1bdb]"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile right side */}
            <div className="flex items-center gap-5 md:hidden">
              {!isAuthenticated && (
                <div className="flex items-center gap-4">
                  <a
                    href="/signup"
                    className="flex items-center justify-center rounded-md bg-[#8022fe] px-3 py-1.5 font-['Inter',sans-serif] text-[12px] font-semibold text-white no-underline transition-colors hover:bg-[#6b1bdb] hover:no-underline"
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
                className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-[#f9f4ff] transition-colors hover:bg-[#f0e8ff]"
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

          {/* Mobile dropdown */}
          {isMobileMenuOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-[calc(100%+10px)] -right-px -left-px z-50 overflow-hidden rounded-[14px] border border-[#f2f2f2] bg-[#fcfcfc] shadow-[0px_5.667px_11.334px_rgba(0,0,0,0.05)] md:hidden"
            >
              <div ref={linksContainerRef} className="flex flex-col items-center gap-7.5 p-5">
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
              <div ref={ctaSectionRef} className="border-t border-[#f2f2f2] p-4">
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
