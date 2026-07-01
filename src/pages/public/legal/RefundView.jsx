import React from 'react';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const RefundView = () => {
  return (
    <div className="w-full bg-[#fcfcfc] dark:bg-zinc-900 pt-10 pb-20 md:pt-16 md:pb-24">
      <div className="mx-auto max-w-325 px-5 md:px-10 lg:px-20">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-4 mb-12 md:mb-16">
          <span className="rounded-full bg-[rgba(128,34,254,0.08)] px-4 py-1.5 text-xs font-semibold text-[#8022fe] tracking-wider uppercase">
            Legal
          </span>
          <h1 className="font-['Inter',sans-serif] text-[36px] md:text-[48px] leading-[1.2] font-bold text-[#181818] dark:text-white">
            Refund <span className="text-[#8022fe]">Policy</span>
          </h1>
          <p className="font-['Inter',sans-serif] text-[14px] font-medium text-[#c2c2c2] dark:text-zinc-500">
            Effective Date: July 1, 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-[24px] border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 md:p-12 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] mb-16 md:mb-20">
          <div className="prose dark:prose-invert max-w-none font-['Inter',sans-serif] text-[15px] leading-relaxed text-[#5d5d5d] dark:text-gray-300">
            <p className="mb-6 font-medium text-[#181818] dark:text-white text-base">
              This Refund Policy explains how refunds are handled for Elyxa subscriptions and purchases.
            </p>

            <div className="space-y-8 mt-6">
              {/* Section 1 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">1. Soft Launch / Beta Period</h2>
                <p>
                  During soft launch, Elyxa may offer free access, trial access, or discounted founding user pricing. Features may still be in development and may change over time.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">2. Subscription Payments</h2>
                <p>
                  If Elyxa offers paid subscriptions, users will be billed according to the plan selected at checkout. Subscription payments are generally non-refundable once a billing period has started, except where required by law or approved by Elyxa at our discretion.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">3. Free Trials</h2>
                <p>
                  If a free trial is offered, you may cancel before the trial ends to avoid being charged. Once the trial ends and billing begins, the payment is subject to this Refund Policy.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">4. Refund Requests</h2>
                <p className="mb-3">Refund requests may be reviewed on a case-by-case basis.</p>
                <p className="font-semibold mb-2 text-[#181818] dark:text-white">We may consider refunds for:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Duplicate charges</li>
                  <li>Billing errors</li>
                  <li>Accidental purchases</li>
                  <li>Technical issues that prevent reasonable use of the service</li>
                </ul>
                <p className="mb-3">
                  To request a refund, contact:{' '}
                  <a href="mailto:support@elyxaai.com" className="text-[#8022fe] font-semibold hover:underline">
                    support@elyxaai.com
                  </a>
                </p>
                <p className="font-semibold mb-2 text-[#181818] dark:text-white">Please include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your account email</li>
                  <li>Date of purchase</li>
                  <li>Reason for the request</li>
                  <li>Any relevant screenshots or billing details</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">5. Cancellations</h2>
                <p>
                  Canceling your subscription stops future billing but does not automatically refund previous payments. You will generally retain access until the end of the current billing period unless otherwise stated.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-lg font-bold text-[#181818] dark:text-white mb-3">6. Changes to This Policy</h2>
                <p>
                  We may update this Refund Policy from time to time.
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

export default RefundView;
