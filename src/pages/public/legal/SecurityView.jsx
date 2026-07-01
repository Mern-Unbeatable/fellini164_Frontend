import React, { useState, useEffect, useRef } from 'react';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const SECTIONS = [
  { id: 'protect', title: '1. How We Protect Data' },
  { id: 'payment', title: '2. Payment Security' },
  { id: 'ai', title: '3. AI & Data Handling' },
  { id: 'responsibility', title: '4. User Responsibility' },
  { id: 'report', title: '5. Reporting Issues' },
  { id: 'improvements', title: '6. Ongoing Improvements' },
];

const SecurityView = () => {
  const [activeSection, setActiveSection] = useState('protect');
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
            Security <span className="text-[#8022fe]">Practices</span>
            <span className="text-[#14f1d9]">.</span>
          </h1>
          <div>
            <p className="mb-4 font-semibold text-[#181818] dark:text-white">
              At Elyxa, we take security seriously and aim to protect user data with responsible technical and operational practices.
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
            <div id="protect" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'protect' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                1. How We Protect Data
              </h2>
              <p className="mb-3">
                Elyxa uses reasonable security measures to help protect account information, planning data, and user content.
              </p>
              <p className="font-semibold mb-2 text-[#181818] dark:text-white">These may include:</p>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Secure authentication practices</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Encrypted connections where applicable</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Access controls</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Secure third-party infrastructure</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Monitoring for suspicious activity</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Limited internal access to user data</span>
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div id="payment" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'payment' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                2. Payment Security
              </h2>
              <p>
                Payments are processed through trusted third-party payment providers such as Stripe or PayPal. Elyxa does not directly store full credit card details.
              </p>
            </div>

            {/* Section 3 */}
            <div id="ai" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'ai' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                3. AI and Data Handling
              </h2>
              <p>
                Elyxa may process user-provided tasks, habits, goals, and planning preferences to generate AI-powered suggestions. We aim to use this data only to provide and improve the service.
              </p>
            </div>

            {/* Section 4 */}
            <div id="responsibility" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'responsibility' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                4. User Responsibility
              </h2>
              <p className="mb-3">Users are responsible for:</p>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Keeping login credentials secure</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Using a strong password</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Not sharing account access</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Reporting suspicious activity</span>
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div id="report" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'report' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                5. Reporting Security Issues
              </h2>
              <p className="mb-3">
                If you discover a security issue or believe your account may be compromised, please contact us immediately at:{' '}
                <a href="mailto:support@elyxaai.com" className="text-[#8022fe] font-semibold hover:underline">
                  support@elyxaai.com
                </a>
              </p>
              <p>Please include as much detail as possible so we can investigate quickly.</p>
            </div>

            {/* Section 6 */}
            <div id="improvements" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'improvements' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                6. Ongoing Improvements
              </h2>
              <p>
                Elyxa is currently in soft launch, and we will continue improving security, privacy, and reliability as the product grows.
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

export default SecurityView;
