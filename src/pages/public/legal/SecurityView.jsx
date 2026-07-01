import React from 'react';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const SecurityView = () => {
  return (
    <div className="w-full bg-[#fcfcfc] dark:bg-zinc-900 pt-10 pb-20 md:pt-16 md:pb-24">
      <div className="mx-auto max-w-325 px-5 md:px-10 lg:px-20">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-4 mb-12 md:mb-16">
          <span className="rounded-full bg-[rgba(128,34,254,0.08)] px-4 py-1.5 text-xs font-semibold text-[#8022fe] tracking-wider uppercase">
            Legal & Security
          </span>
          <h1 className="font-['Inter',sans-serif] text-[36px] md:text-[48px] leading-[1.2] font-bold text-[#181818] dark:text-white">
            Security <span className="text-[#8022fe]">Practices</span>
          </h1>
          <p className="font-['Inter',sans-serif] text-[14px] font-medium text-[#c2c2c2] dark:text-zinc-500">
            Effective Date: July 1, 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-[24px] border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 md:p-12 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] mb-16 md:mb-20">
          <div className="prose dark:prose-invert max-w-none font-['Inter',sans-serif] text-[15px] leading-relaxed text-[#5d5d5d] dark:text-gray-300">
            <p className="mb-6 font-medium text-[#181818] dark:text-white text-base">
              At Elyxa, we take security seriously and aim to protect user data with responsible technical and operational practices.
            </p>

            <div className="space-y-8 mt-6">
              {/* Section 1 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">How We Protect Data</h2>
                <p className="mb-3">
                  Elyxa uses reasonable security measures to help protect account information, planning data, and user content.
                </p>
                <p className="font-semibold mb-2 text-[#181818] dark:text-white">These may include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Secure authentication practices</li>
                  <li>Encrypted connections where applicable</li>
                  <li>Access controls</li>
                  <li>Secure third-party infrastructure</li>
                  <li>Monitoring for suspicious activity</li>
                  <li>Limited internal access to user data</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">Payment Security</h2>
                <p>
                  Payments are processed through trusted third-party payment providers such as Stripe or PayPal. Elyxa does not directly store full credit card details.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">AI and Data Handling</h2>
                <p>
                  Elyxa may process user-provided tasks, habits, goals, and planning preferences to generate AI-powered suggestions. We aim to use this data only to provide and improve the service.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">User Responsibility</h2>
                <p className="mb-3">Users are responsible for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Keeping login credentials secure</li>
                  <li>Using a strong password</li>
                  <li>Not sharing account access</li>
                  <li>Reporting suspicious activity</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">Reporting Security Issues</h2>
                <p>
                  If you discover a security issue or believe your account may be compromised, please contact us immediately at:{' '}
                  <a href="mailto:support@elyxaai.com" className="text-[#8022fe] font-semibold hover:underline">
                    support@elyxaai.com
                  </a>
                </p>
                <p>Please include as much detail as possible so we can investigate quickly.</p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">Ongoing Improvements</h2>
                <p>
                  Elyxa is currently in soft launch, and we will continue improving security, privacy, and reliability as the product grows.
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

export default SecurityView;
