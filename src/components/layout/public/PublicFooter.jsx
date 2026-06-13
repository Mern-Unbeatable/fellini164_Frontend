import React from 'react';

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'Roadmap', href: '/roadmap', purple: true },
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

/* Stripe "S" icon — circle with stylised S path */
const StripeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="4" fill="#F0EFFF" />
    <path
      d="M9.74 8.57c-1.54-.4-2.04-.8-2.04-1.43 0-.72.67-1.22 1.79-1.22 1.18 0 1.62.56 1.66 1.39h1.47c-.05-1.14-.74-2.18-2.13-2.52V3.33H9.07v1.44C7.78 5.04 6.75 5.87 6.75 7.16c0 1.54 1.27 2.3 3.13 2.75 1.7.4 2.04.99 2.04 1.6 0 .46-.33 1.19-1.79 1.19-1.37 0-1.9-.61-1.98-1.39H6.68c.09 1.45 1.17 2.26 2.39 2.52v1.44h1.46v-1.42c1.3-.25 2.32-1 2.32-2.36 0-1.89-1.61-2.53-3.11-2.92z"
      fill="#635BFF"
    />
  </svg>
);

/* Apple Pay — apple logo + "Pay" text */
const ApplePayIcon = () => (
  <div className="flex items-center gap-1">
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.56 8.78c-.02-1.78 1.46-2.64 1.52-2.68-0.83-1.21-2.12-1.38-2.57-1.4-1.09-.11-2.13.64-2.69.64-.56 0-1.42-.63-2.34-.61-1.2.02-2.31.7-2.93 1.77C1.1 8.68 1.9 12.3 3.3 14.27c.69.99 1.51 2.1 2.59 2.06 1.04-.04 1.43-.67 2.69-.67 1.26 0 1.61.67 2.7.65 1.12-.02 1.83-1.01 2.51-2 .8-1.14 1.12-2.25 1.14-2.31-.03-.01-2.35-.9-2.37-3.22zM9.7 3.12c.57-.69.95-1.65.85-2.61-.82.03-1.81.55-2.4 1.23-.52.6-.99 1.57-.86 2.5.91.07 1.85-.46 2.41-1.12z"
        fill="#181818"
      />
    </svg>
    <span
      className="font-['Inter',sans-serif] text-[14px] font-semibold leading-none text-[#181818]"
    >
      Pay
    </span>
  </div>
);

const PublicFooter = () => {
  return (
    <footer className="w-full border-t border-[#f2f2f2] bg-[#fcfcfc]">
      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-20">

        {/* Main row: left brand block + right columns */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-stretch lg:justify-between">

          {/* ── Left: logo top, payment bottom ── */}
          <div className="flex flex-col items-start justify-between gap-8 lg:gap-0">
            {/* Logo + copyright */}
            <div className="flex flex-col gap-5">
              <a href="/" className="inline-flex items-center no-underline">
                <img src="/logo.png" alt="Elyxa.Ai" className="h-8.25 w-auto" />
              </a>
              <p className="font-['Inter',sans-serif] text-[14px] font-normal leading-normal text-[#c2c2c2]">
                © 2026 Elyxa AI LLC.{' '}
                <br />
                All rights reserved.
              </p>
            </div>

            {/* Payment icons */}
            <div className="flex items-center gap-3">
              <StripeIcon />
              <ApplePayIcon />
            </div>
          </div>

          {/* ── Right: 4 link columns ── */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:flex sm:flex-row sm:gap-15 lg:gap-25">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-7.5">
                {/* Column heading */}
                <p className="font-['Inter',sans-serif] text-[14px] font-normal leading-none text-[#c2c2c2]">
                  {col.heading}
                </p>
                {/* Links */}
                <div className="flex flex-col gap-5">
                  {col.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className={`font-['Inter',sans-serif] text-[14px] font-semibold leading-none no-underline transition-colors hover:text-[#8022fe] hover:no-underline ${
                        link.purple ? 'text-[#8022fe]' : 'text-[#181818]'
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
      </div>
    </footer>
  );
};

export default PublicFooter;
