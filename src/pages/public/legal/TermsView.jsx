import React from 'react';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const TermsView = () => {
  return (
    <div className="w-full bg-[#fcfcfc] dark:bg-zinc-900 pt-10 pb-20 md:pt-16 md:pb-24">
      <div className="mx-auto max-w-325 px-5 md:px-10 lg:px-20">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-4 mb-12 md:mb-16">
          <span className="rounded-full bg-[rgba(128,34,254,0.08)] px-4 py-1.5 text-xs font-semibold text-[#8022fe] tracking-wider uppercase">
            Legal
          </span>
          <h1 className="font-['Inter',sans-serif] text-[36px] md:text-[48px] leading-[1.2] font-bold text-[#181818] dark:text-white">
            Terms of <span className="text-[#8022fe]">Service</span>
          </h1>
          <p className="font-['Inter',sans-serif] text-[14px] font-medium text-[#c2c2c2] dark:text-zinc-500">
            Effective Date: July 1, 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-[24px] border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 md:p-12 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] mb-16 md:mb-20">
          <div className="prose dark:prose-invert max-w-none font-['Inter',sans-serif] text-[15px] leading-relaxed text-[#5d5d5d] dark:text-gray-300">
            <p className="mb-6 font-medium text-[#181818] dark:text-white text-base">
              Welcome to Elyxa. These Terms of Service govern your access to and use of the Elyxa website, platform, software, and related services.
            </p>
            <p className="mb-8">
              By using Elyxa, you agree to these Terms. If you do not agree, please do not use the service.
            </p>

            <div className="space-y-8">
              {/* Section 1 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">1. Use of Elyxa</h2>
                <p className="mb-3">
                  Elyxa provides AI-powered planning, productivity, task, habit, goal, and scheduling tools. You may use Elyxa only for lawful purposes and in accordance with these Terms.
                </p>
                <p className="font-semibold mb-2 text-[#181818] dark:text-white">You agree not to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use Elyxa for illegal or harmful activities</li>
                  <li>Attempt to disrupt or damage the platform</li>
                  <li>Reverse engineer or copy the software</li>
                  <li>Misuse AI-generated outputs</li>
                  <li>Violate the rights of other users or third parties</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">2. Account Registration</h2>
                <p>
                  To use certain features, you may need to create an account. You are responsible for keeping your login information secure and for all activity under your account. You agree to provide accurate and up-to-date information when creating your account.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">3. AI-Generated Content</h2>
                <p>
                  Elyxa uses AI to help generate plans, suggestions, task recommendations, habit ideas, and productivity guidance. AI-generated output may not always be perfect, accurate, or suitable for every situation. You are responsible for reviewing and deciding whether to follow any suggestions provided by Elyxa. Elyxa does not provide medical, legal, financial, or professional advice.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">4. Soft Launch / Beta Access</h2>
                <p>
                  Elyxa may currently be offered as a soft launch or beta product. During this phase, some features may be incomplete, changed, removed, or updated at any time. You understand that the product may contain bugs, errors, or limitations during this early stage.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">5. Subscriptions and Payments</h2>
                <p>
                  Some Elyxa features may require a paid subscription. Pricing, billing cycles, and plan details will be shown before purchase. By subscribing, you authorize Elyxa or its payment processor to charge your selected payment method according to the selected plan.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">6. Cancellations</h2>
                <p>
                  You may cancel your subscription according to the cancellation process made available through your account or billing portal. Cancellation prevents future billing but does not automatically refund past payments unless stated in our Refund Policy.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">7. User Content</h2>
                <p>
                  You may input goals, tasks, habits, notes, preferences, and other information into Elyxa. You retain ownership of your content. By using Elyxa, you grant us permission to process your content only as necessary to provide and improve the service.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">8. Service Availability</h2>
                <p>
                  We aim to provide a stable and reliable service, but we do not guarantee that Elyxa will always be available, uninterrupted, or error-free.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">9. Termination</h2>
                <p>
                  We may suspend or terminate access to Elyxa if a user violates these Terms, misuses the platform, or creates risk for the service or other users.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">10. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, Elyxa is not liable for indirect, incidental, special, or consequential damages arising from your use of the service.
                </p>
              </div>

              {/* Section 11 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">11. Changes to These Terms</h2>
                <p>
                  We may update these Terms from time to time. Continued use of Elyxa after changes means you accept the updated Terms.
                </p>
              </div>

              {/* Section 12 */}
              <div>
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
        </div>

        {/* Final CTA Section */}
        <div>
          <FinalCTASection />
        </div>

      </div>
    </div>
  );
};

export default TermsView;
