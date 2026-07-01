import React, { useState, useEffect, useRef } from 'react';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const SECTIONS = [
  { id: 'collect', title: '1. Information We Collect' },
  { id: 'use', title: '2. How We Use Your Info' },
  { id: 'ai', title: '3. AI Processing' },
  { id: 'payment', title: '4. Payments' },
  { id: 'cookies', title: '5. Cookies and Analytics' },
  { id: 'share', title: '6. How We Share Info' },
  { id: 'security', title: '7. Data Security' },
  { id: 'retention', title: '8. Data Retention' },
  { id: 'choices', title: '9. Your Choices' },
  { id: 'children', title: '10. Children’s Privacy' },
  { id: 'changes', title: '11. Changes to This Policy' },
  { id: 'contact-section', title: '12. Contact' },
];

const PrivacyView = () => {
  const [activeSection, setActiveSection] = useState('collect');
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
            Privacy <span className="text-[#8022fe]">Policy</span>
            <span className="text-[#14f1d9]">.</span>
          </h1>
          <div>
            <p className="mb-4 font-semibold text-[#181818] dark:text-white">
              Elyxa respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website, platform, and services.
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
            <div id="collect" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'collect' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                1. Information We Collect
              </h2>
              <p className="mb-3">We may collect the following information:</p>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Name and email address</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Account login information</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Tasks, habits, goals, preferences, and planning data</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Usage activity inside the platform</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Payment and subscription information through third-party payment processors</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Device, browser, and analytics information</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Feedback, support messages, or bug reports you submit</span>
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div id="use" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'use' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                2. How We Use Your Information
              </h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Provide and improve Elyxa</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Generate AI-powered planning suggestions</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Personalize your experience</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Manage accounts and subscriptions</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Respond to support requests</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Improve product performance and usability</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Monitor security and prevent abuse</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Communicate product updates and important notices</span>
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="ai" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'ai' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                3. AI Processing
              </h2>
              <p>
                Elyxa may process your tasks, habits, goals, preferences, and planning information to generate AI-powered recommendations, schedules, and suggestions. We use this data only to provide and improve the service.
              </p>
            </div>

            {/* Section 4 */}
            <div id="payment" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'payment' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                4. Payments
              </h2>
              <p>
                Payments may be processed through third-party providers such as Stripe or PayPal. Elyxa does not directly store full credit card details. Payment providers may collect and process payment information according to their own privacy policies.
              </p>
            </div>

            {/* Section 5 */}
            <div id="cookies" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'cookies' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                5. Cookies and Analytics
              </h2>
              <p>
                We may use cookies and analytics tools to understand website traffic, product usage, and user behavior. This helps us improve Elyxa and measure performance.
              </p>
            </div>

            {/* Section 6 */}
            <div id="share" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'share' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                6. How We Share Information
              </h2>
              <p className="mb-3">We do not sell your personal information.</p>
              <p className="mb-3">
                We may share limited information with trusted service providers that help us operate Elyxa, such as hosting providers, analytics tools, email tools, payment processors, and AI service providers.
              </p>
              <p>
                We may also share information if required by law or to protect the rights, safety, and security of Elyxa and its users.
              </p>
            </div>

            {/* Section 7 */}
            <div id="security" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'security' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                7. Data Security
              </h2>
              <p>
                We use reasonable technical and organizational measures to protect your information. However, no system is completely secure, and we cannot guarantee absolute security.
              </p>
            </div>

            {/* Section 8 */}
            <div id="retention" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'retention' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                8. Data Retention
              </h2>
              <p>
                We retain your information as long as needed to provide the service, comply with legal obligations, resolve disputes, and improve Elyxa.
              </p>
            </div>

            {/* Section 9 */}
            <div id="choices" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'choices' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                9. Your Choices
              </h2>
              <p>
                You may request to update, access, or delete your account information by contacting us. You may also unsubscribe from marketing emails at any time.
              </p>
            </div>

            {/* Section 10 */}
            <div id="children" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'children' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                10. Children’s Privacy
              </h2>
              <p>
                Elyxa is not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </div>

            {/* Section 11 */}
            <div id="changes" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'changes' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                11. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised effective date.
              </p>
            </div>

            {/* Section 12 */}
            <div id="contact-section" className="scroll-mt-24">
              <h2 className={`text-lg font-bold mb-3 transition-colors ${
                activeSection === 'contact-section' ? 'text-[#8022fe]' : 'text-[#181818] dark:text-white'
              }`}>
                12. Contact
              </h2>
              <p>
                For privacy questions, contact us at:{' '}
                <a href="mailto:support@elyxaai.com" className="text-[#8022fe] font-semibold hover:underline">
                  support@elyxaai.com
                </a>
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

export default PrivacyView;
