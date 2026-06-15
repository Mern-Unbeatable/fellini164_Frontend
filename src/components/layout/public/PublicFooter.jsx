import React from 'react';
import { useLocation } from 'react-router-dom';

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Roadmap', href: '/roadmap', accent: true },
      { label: 'Early Access', href: '/early-access' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Refund Policy', href: '/refund' },
      { label: 'Security', href: '/security' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact Support', href: '/contact' },
    ],
  },
];

const PublicFooter = () => {
  const { pathname } = useLocation();
  const showFinalCTA = pathname === '/' || pathname === '/how-it-works';

  return (
    <div className="w-full bg-white px-3 pb-3 lg:px-5 lg:pb-5">
      <footer
        className={`relative z-10 w-full rounded-[20px] border border-[#f2f2f2] bg-[#fcfcfc] lg:rounded-[30px] ${
          showFinalCTA
            ? '-mt-62.5 pt-70 pb-7.5 lg:-mt-57.25 lg:pt-57.5 lg:pb-17.5'
            : 'py-7.5 lg:py-17.5'
        }`}
      >
        <div className="mx-auto max-w-325 px-3 md:px-5 lg:px-0">
          {/* Mobile / tablet footer */}
          <div className="flex flex-col gap-7.5 lg:hidden">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <a href="/" className="inline-flex no-underline">
                  <img src="/logo.png" alt="Elyxa.Ai" className="h-6.5 w-auto" />
                </a>
                <div className="flex items-center gap-3">
                  <a
                    href="https://stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex no-underline"
                  >
                    <img src="/stripe.png" alt="Stripe" className="h-4.5 w-auto" />
                  </a>
                  <a
                    href="https://apple.com/apple-pay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex no-underline"
                  >
                    <img src="/applePay.png" alt="Apple Pay" className="h-4.5 w-auto" />
                  </a>
                </div>
              </div>
              <p className="font-['Inter',sans-serif] text-xs leading-none font-normal text-[#c2c2c2]">
                © 2026 Elyxa AI LLC.
                <br />
                All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-12.5 gap-y-7.5">
              {COLUMNS.map((col) => (
                <div key={col.heading} className="w-30">
                  <p className="mb-5 font-['Inter',sans-serif] text-xs leading-none font-normal text-[#c2c2c2]">
                    {col.heading}
                  </p>
                  <div className="flex flex-col gap-4">
                    {col.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className={`font-['Inter',sans-serif] text-xs leading-none font-semibold text-[#181818] no-underline transition-colors hover:text-[#8022fe] ${
                          link.accent ? 'lg:text-[#8022fe]' : ''
                        }`}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop footer */}
          <div className="hidden items-start justify-between lg:flex">
            <div className="flex min-h-45 flex-col justify-between self-stretch">
              <div className="flex flex-col gap-5">
                <a href="/" className="inline-flex no-underline">
                  <img src="/logo.png" alt="Elyxa.Ai" className="h-11 w-auto" />
                </a>
                <p className="font-['Inter',sans-serif] text-sm leading-none font-normal text-[#c2c2c2]">
                  © 2026 Elyxa AI LLC.
                  <br />
                  All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="https://stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex no-underline"
                >
                  <img src="/stripe.png" alt="Stripe" className="h-5 w-auto" />
                </a>
                <a
                  href="https://apple.com/apple-pay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex no-underline"
                >
                  <img src="/applePay.png" alt="Apple Pay" className="h-5 w-auto" />
                </a>
              </div>
            </div>

            <div className="flex gap-25">
              {COLUMNS.map((col) => (
                <div key={col.heading} className="flex flex-col gap-7.5">
                  <p className="font-['Inter',sans-serif] text-sm leading-none font-normal text-[#c2c2c2]">
                    {col.heading}
                  </p>
                  <div className="flex flex-col gap-5">
                    {col.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="font-['Inter',sans-serif] text-sm leading-none font-semibold text-[#181818] no-underline transition-colors hover:text-[#8022fe]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicFooter;
