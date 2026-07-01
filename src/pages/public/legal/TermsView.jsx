import React from 'react';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const SECTIONS = [
  { id: 'use', title: '1. Use of Elyxa' },
  { id: 'account', title: '2. Account Registration' },
  { id: 'ai', title: '3. AI-Generated Content' },
  { id: 'beta', title: '4. Soft Launch / Beta Access' },
  { id: 'payment', title: '5. Subscriptions and Payments' },
  { id: 'cancel', title: '6. Cancellations' },
  { id: 'content', title: '7. User Content' },
  { id: 'availability', title: '8. Service Availability' },
  { id: 'termination', title: '9. Termination' },
  { id: 'liability', title: '10. Limitation of Liability' },
  { id: 'changes', title: '11. Changes to These Terms' },
  { id: 'contact-section', title: '12. Contact' },
];

const TermsView = () => {
  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100; // offset to prevent heading being covered by sticky header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white pt-12.5 pb-20 md:pt-22.5 md:pb-24">
      <div className="mx-auto max-w-385 px-5 md:px-20">
        
        {/* Header Section */}
        <div className="flex flex-col gap-3.5 md:gap-5 mb-10 md:mb-14">
          <h1 className="font-['Inter',sans-serif] text-[28px] leading-[1.3] font-bold text-[#181818] md:text-[42px]">
            Terms of <span className="text-[#8022fe]">Service</span>
            <span className="text-[#14f1d9]">.</span>
          </h1>
          <p className="font-['Inter',sans-serif] text-[14px] font-medium text-[#888] md:text-[15px]">
            Effective Date: July 1, 2026
          </p>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          
          {/* Left option bar (sticky sidebar) */}
          <div className="w-full lg:w-72 lg:sticky lg:top-24 flex flex-col gap-1 shrink-0 bg-white dark:bg-zinc-800 border border-[#f2f2f2] dark:border-zinc-700 rounded-[20px] p-5 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)]">
            <p className="font-semibold text-[11px] text-[#c2c2c2] uppercase tracking-wider mb-2">
              Table of Contents
            </p>
            <div className="flex flex-wrap lg:flex-col gap-x-4 gap-y-1">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScroll(sec.id)}
                  className="text-left font-['Inter',sans-serif] text-[13px] font-semibold text-[#5d5d5d] hover:text-[#8022fe] transition-colors py-1.5 focus:outline-none"
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </div>

          {/* Right main content */}
          <div className="flex-1 font-['Inter',sans-serif] text-[15px] leading-relaxed text-[#5d5d5d] dark:text-gray-300 space-y-10 md:text-[16px]">
            <div>
              <p className="mb-4 font-semibold text-[#181818] dark:text-white">
                Welcome to Elyxa. These Terms of Service govern your access to and use of the Elyxa website, platform, software, and related services.
              </p>
              <p>
                By using Elyxa, you agree to these Terms. If you do not agree, please do not use the service.
              </p>
            </div>

            {/* Section 1 */}
            <div id="use" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">1. Use of Elyxa</h2>
              <p className="mb-3">
                Elyxa provides AI-powered planning, productivity, task, habit, goal, and scheduling tools. You may use Elyxa only for lawful purposes and in accordance with these Terms.
              </p>
              <p className="font-semibold mb-2 text-[#181818] dark:text-white">You agree not to:</p>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Use Elyxa for illegal or harmful activities</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Attempt to disrupt or damage the platform</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Reverse engineer or copy the software</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Misuse AI-generated outputs</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#8022fe] mt-1">●</span>
                  <span>Violate the rights of other users or third parties</span>
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div id="account" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">2. Account Registration</h2>
              <p>
                To use certain features, you may need to create an account. You are responsible for keeping your login information secure and for all activity under your account. You agree to provide accurate and up-to-date information when creating your account.
              </p>
            </div>

            {/* Section 3 */}
            <div id="ai" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">3. AI-Generated Content</h2>
              <p>
                Elyxa uses AI to help generate plans, suggestions, task recommendations, habit ideas, and productivity guidance. AI-generated output may not always be perfect, accurate, or suitable for every situation. You are responsible for reviewing and deciding whether to follow any suggestions provided by Elyxa. Elyxa does not provide medical, legal, financial, or professional advice.
              </p>
            </div>

            {/* Section 4 */}
            <div id="beta" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">4. Soft Launch / Beta Access</h2>
              <p>
                Elyxa may currently be offered as a soft launch or beta product. During this phase, some features may be incomplete, changed, removed, or updated at any time. You understand that the product may contain bugs, errors, or limitations during this early stage.
              </p>
            </div>

            {/* Section 5 */}
            <div id="payment" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">5. Subscriptions and Payments</h2>
              <p>
                Some Elyxa features may require a paid subscription. Pricing, billing cycles, and plan details will be shown before purchase. By subscribing, you authorize Elyxa or its payment processor to charge your selected payment method according to the selected plan.
              </p>
            </div>

            {/* Section 6 */}
            <div id="cancel" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">6. Cancellations</h2>
              <p>
                You may cancel your subscription according to the cancellation process made available through your account or billing portal. Cancellation prevents future billing but does not automatically refund past payments unless stated in our Refund Policy.
              </p>
            </div>

            {/* Section 7 */}
            <div id="content" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">7. User Content</h2>
              <p>
                You may input goals, tasks, habits, notes, preferences, and other information into Elyxa. You retain ownership of your content. By using Elyxa, you grant us permission to process your content only as necessary to provide and improve the service.
              </p>
            </div>

            {/* Section 8 */}
            <div id="availability" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">8. Service Availability</h2>
              <p>
                We aim to provide a stable and reliable service, but we do not guarantee that Elyxa will always be available, uninterrupted, or error-free.
              </p>
            </div>

            {/* Section 9 */}
            <div id="termination" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">9. Termination</h2>
              <p>
                We may suspend or terminate access to Elyxa if a user violates these Terms, misuses the platform, or creates risk for the service or other users.
              </p>
            </div>

            {/* Section 10 */}
            <div id="liability" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">10. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Elyxa is not liable for indirect, incidental, special, or consequential damages arising from your use of the service.
              </p>
            </div>

            {/* Section 11 */}
            <div id="changes" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">11. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. Continued use of Elyxa after changes means you accept the updated Terms.
              </p>
            </div>

            {/* Section 12 */}
            <div id="contact-section" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">12. Contact</h2>
              <p>
                For questions about these Terms, contact us at:{' '}
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

export default TermsView;
