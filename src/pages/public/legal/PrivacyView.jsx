import React from 'react';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const PrivacyView = () => {
  return (
    <div className="w-full bg-[#fcfcfc] dark:bg-zinc-900 pt-10 pb-20 md:pt-16 md:pb-24">
      <div className="mx-auto max-w-325 px-5 md:px-10 lg:px-20">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-4 mb-12 md:mb-16">
          <span className="rounded-full bg-[rgba(128,34,254,0.08)] px-4 py-1.5 text-xs font-semibold text-[#8022fe] tracking-wider uppercase">
            Legal
          </span>
          <h1 className="font-['Inter',sans-serif] text-[36px] md:text-[48px] leading-[1.2] font-bold text-[#181818] dark:text-white">
            Privacy <span className="text-[#8022fe]">Policy</span>
          </h1>
          <p className="font-['Inter',sans-serif] text-[14px] font-medium text-[#c2c2c2] dark:text-zinc-500">
            Effective Date: July 1, 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-[24px] border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 md:p-12 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] mb-16 md:mb-20">
          <div className="prose dark:prose-invert max-w-none font-['Inter',sans-serif] text-[15px] leading-relaxed text-[#5d5d5d] dark:text-gray-300">
            <p className="mb-6 font-medium text-[#181818] dark:text-white text-base">
              Elyxa respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website, platform, and services.
            </p>

            <div className="space-y-8 mt-6">
              {/* Section 1 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">1. Information We Collect</h2>
                <p className="mb-3">We may collect the following information:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Name and email address</li>
                  <li>Account login information</li>
                  <li>Tasks, habits, goals, preferences, and planning data</li>
                  <li>Usage activity inside the platform</li>
                  <li>Payment and subscription information through third-party payment processors</li>
                  <li>Device, browser, and analytics information</li>
                  <li>Feedback, support messages, or bug reports you submit</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">2. How We Use Your Information</h2>
                <p className="mb-3">We use your information to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provide and improve Elyxa</li>
                  <li>Generate AI-powered planning suggestions</li>
                  <li>Personalize your experience</li>
                  <li>Manage accounts and subscriptions</li>
                  <li>Respond to support requests</li>
                  <li>Improve product performance and usability</li>
                  <li>Monitor security and prevent abuse</li>
                  <li>Communicate product updates and important notices</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">3. AI Processing</h2>
                <p>
                  Elyxa may process your tasks, habits, goals, preferences, and planning information to generate AI-powered recommendations, schedules, and suggestions. We use this data only to provide and improve the service.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">4. Payments</h2>
                <p>
                  Payments may be processed through third-party providers such as Stripe or PayPal. Elyxa does not directly store full credit card details. Payment providers may collect and process payment information according to their own privacy policies.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">5. Cookies and Analytics</h2>
                <p>
                  We may use cookies and analytics tools to understand website traffic, product usage, and user behavior. This helps us improve Elyxa and measure performance.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">6. How We Share Information</h2>
                <p className="mb-3">We do not sell your personal information.</p>
                <p className="mb-3">
                  We may share limited information with trusted service providers that help us operate Elyxa, such as hosting providers, analytics tools, email tools, payment processors, and AI service providers.
                </p>
                <p>
                  We may also share information if required by law or to protect the rights, safety, and security of Elyxa and its users.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">7. Data Security</h2>
                <p>
                  We use reasonable technical and organizational measures to protect your information. However, no system is completely secure, and we cannot guarantee absolute security.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">8. Data Retention</h2>
                <p>
                  We retain your information as long as needed to provide the service, comply with legal obligations, resolve disputes, and improve Elyxa.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">9. Your Choices</h2>
                <p>
                  You may request to update, access, or delete your account information by contacting us. You may also unsubscribe from marketing emails at any time.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">10. Children’s Privacy</h2>
                <p>
                  Elyxa is not intended for children under 13. We do not knowingly collect personal information from children under 13.
                </p>
              </div>

              {/* Section 11 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">11. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised effective date.
                </p>
              </div>

              {/* Section 12 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">12. Contact</h2>
                <p>
                  For privacy questions, contact us at:{' '}
                  <a href="mailto:support@elyxaai.com" className="text-[#8022fe] font-semibold hover:underline">
                    support@elyxaai.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div>
          <FinalCTASection />
        </div>

      </div>
    </div>
  );
};

export default PrivacyView;
