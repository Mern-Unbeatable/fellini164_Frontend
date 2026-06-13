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

const StripeIcon = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f0f0]">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.2 5.4C7.2 4.96 7.56 4.68 8.12 4.68C9.04 4.68 9.96 5.04 10.76 5.64L11.64 3.6C10.76 3 9.56 2.6 8.12 2.6C5.96 2.6 4.44 3.84 4.44 5.56C4.44 8.76 8.96 8.24 8.96 9.68C8.96 10.2 8.52 10.48 7.88 10.48C6.84 10.48 5.72 10.04 4.84 9.32L3.92 11.36C4.88 12.12 6.24 12.6 7.8 12.6C10.08 12.6 11.68 11.4 11.68 9.6C11.72 6.12 7.2 6.76 7.2 5.4Z"
        fill="#635BFF"
      />
    </svg>
  </div>
);

const ApplePayIcon = () => (
  <div className="flex items-center gap-1">
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.5 11.4C14.5 9.3 15.9 8.2 16 8.1C15 6.7 13.5 6.5 12.9 6.5C11.6 6.4 10.4 7.3 9.7 7.3C9 7.3 8 6.5 6.9 6.5C5.4 6.5 4 7.4 3.2 8.8C1.6 11.6 2.8 15.6 4.3 17.8C5.1 18.9 6 20.1 7.3 20C8.6 19.9 9.1 19.2 10.4 19.2C11.7 19.2 12.2 20 13.5 20C14.8 20 15.6 18.9 16.4 17.8C17.1 16.8 17.4 15.8 17.4 15.7C17.4 15.7 14.5 14.6 14.5 11.4Z"
        fill="#181818"
      />
      <path
        d="M12 4.8C12.7 3.9 13.1 2.8 13 1.6C12 1.7 10.8 2.3 10 3.2C9.3 4 8.8 5.1 8.9 6.2C9.9 6.3 11 5.7 12 4.8Z"
        fill="#181818"
      />
    </svg>
    <span className="font-['Inter',sans-serif] text-[14px] font-semibold text-[#181818]">Pay</span>
  </div>
);

const PublicFooter = () => {
  return (
    <footer className="w-full border-t border-[#f0f0f0] bg-[#fcfcfc]">
      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">

          {/* Left: Logo + copyright + payment icons */}
          <div className="flex flex-col gap-6 lg:w-60 lg:shrink-0">
            <a href="/" className="inline-flex items-center no-underline">
              <img src="/logo.png" alt="Elyxa.Ai" className="h-8 w-auto" />
            </a>

            <p className="font-['Inter',sans-serif] text-[13px] font-medium leading-[1.7] text-[#c2c2c2]">
              © 2026 Elyxa AI LLC.<br />All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              <StripeIcon />
              <ApplePayIcon />
            </div>
          </div>

          {/* Right: 4 link columns */}
          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-4">
                <p className="font-['Inter',sans-serif] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#c2c2c2]">
                  {col.heading}
                </p>
                <div className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className={`font-['Inter',sans-serif] text-[14px] font-medium no-underline transition-colors hover:text-[#8022fe] hover:no-underline ${
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
