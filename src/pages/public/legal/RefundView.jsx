import React, { useState, useEffect, useRef } from 'react';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const SECTIONS = [
  { id: 'beta', title: '1. Soft Launch / Beta Period' },
  { id: 'payment', title: '2. Subscription Payments' },
  { id: 'trial', title: '3. Free Trials' },
  { id: 'request', title: '4. Refund Requests' },
  { id: 'cancel', title: '5. Cancellations' },
  { id: 'changes', title: '6. Changes to This Policy' },
];

const RefundView = () => {
  const [activeSection, setActiveSection] = useState('beta');
  const isManualScrolling = useRef(false);
  const timeoutRef = useRef(null);

  const handleScroll = (id) => {
    isManualScrolling.current = true;
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100; // offset to prevent heading being covered by sticky header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 800);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-15% 0px -70% 0px', // detects when section is in the top-middle part of viewport
      }
    );

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      SECTIONS.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="w-full bg-white pt-12.5 pb-20 md:pt-22.5 md:pb-24">
      <div className="mx-auto max-w-385 px-5 md:px-20">
        
        {/* Header Section */}
        <div className="flex flex-col gap-3.5 md:gap-5 mb-10 md:mb-14">
          <h1 className="font-['Inter',sans-serif] text-[28px] leading-[1.3] font-bold text-[#181818] md:text-[42px]">
            Refund <span className="text-[#8022fe]">Policy</span>
            <span className="text-[#14f1d9]">.</span>
          </h1>
          <div>
            <p className="mb-4 font-semibold text-[#181818] dark:text-white">
              This Refund Policy explains how refunds are handled for Elyxa subscriptions and purchases.
            </p>
          </div>
          <p className="font-['Inter',sans-serif] text-[14px] font-medium text-[#888] md:text-[15px]">
            Effective Date: July 1, 2026
          </p>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          
          {/* Left option bar (sticky sidebar) */}
          <div className="hidden lg:flex lg:w-72 lg:sticky lg:top-24 flex-col gap-1 shrink-0 bg-white dark:bg-zinc-800 border border-[#f2f2f2] dark:border-zinc-700 rounded-lg p-5 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)]">
            <p className="font-semibold text-[11px] text-[#c2c2c2] uppercase tracking-wider mb-2">
              Table of Contents
            </p>
            <div className="flex flex-wrap lg:flex-col gap-x-4 gap-y-1">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScroll(sec.id)}
                  className={`text-left font-['Inter',sans-serif] text-[13px] font-semibold transition-colors py-1.5 focus:outline-none ${
                    activeSection === sec.id ? 'text-[#8022fe]' : 'text-[#5d5d5d]'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </div>

          {/* Right main content */}
          <div className="flex-1 font-['Inter',sans-serif] text-[15px] leading-relaxed text-[#5d5d5d] dark:text-gray-300 space-y-10 md:text-[16px]">
            
            {/* Section 1 */}
            <div id="beta" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'beta' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                1. Soft Launch / Beta Period
              </h2>
              <p>
                During soft launch, Elyxa may offer free access, trial access, or discounted founding user pricing. Features may still be in development and may change over time.
              </p>
            </div>

            {/* Section 2 */}
            <div id="payment" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'payment' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                2. Subscription Payments
              </h2>
              <p>
                If Elyxa offers paid subscriptions, users will be billed according to the plan selected at checkout. Subscription payments are generally non-refundable once a billing period has started, except where required by law or approved by Elyxa at our discretion.
              </p>
            </div>

            {/* Section 3 */}
            <div id="trial" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'trial' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                3. Free Trials
              </h2>
              <p>
                If a free trial is offered, you may cancel before the trial ends to avoid being charged. Once the trial ends and billing begins, the payment is subject to this Refund Policy.
              </p>
            </div>

            {/* Section 4 */}
            <div id="request" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'request' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                4. Refund Requests
              </h2>
              <p className="mb-3">Refund requests may be reviewed on a case-by-case basis.</p>
              <p className="font-semibold mb-2 text-[#181818] dark:text-white">We may consider refunds for:</p>
              <ul className="space-y-2 list-none pl-0 mb-4">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Duplicate charges</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Billing errors</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Accidental purchases</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Technical issues that prevent reasonable use of the service</span>
                </li>
              </ul>
              <p className="mb-3">
                To request a refund, contact:{' '}
                <a href="mailto:support@elyxaai.com" className="text-[#8022fe] font-semibold hover:underline">
                  support@elyxaai.com
                </a>
              </p>
              <p className="font-semibold mb-2 text-[#181818] dark:text-white">Please include:</p>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Your account email</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Date of purchase</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Reason for the request</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Any relevant screenshots or billing details</span>
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div id="cancel" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'cancel' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                5. Cancellations
              </h2>
              <p>
                Canceling your subscription stops future billing but does not automatically refund previous payments. You will generally retain access until the end of the current billing period unless otherwise stated.
              </p>
            </div>

            {/* Section 6 */}
            <div id="changes" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'changes' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                6. Changes to This Policy
              </h2>
              <p>
                We may update this Refund Policy from time to time.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="pt-20">
          <FinalCTASection />
        </div>

      </div>
    </div>
  );
};

export default RefundView;
