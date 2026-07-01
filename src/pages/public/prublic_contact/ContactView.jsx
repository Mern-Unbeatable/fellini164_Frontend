
import React from 'react';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const ContactView = () => {
  return (
    <div className="w-full bg-white pt-12.5 pb-20 md:pt-22.5 md:pb-24">
      <div className="mx-auto max-w-385 px-5 md:px-20">
        
        {/* Header Section */}
        <div className="flex flex-col gap-3.5 md:gap-5 mb-10 md:mb-14">
          <h1 className="font-['Inter',sans-serif] text-[28px] leading-[1.3] font-bold text-[#181818] md:text-[42px]">
            Contact <span className="text-[#8022fe]">Us</span>
            <span className="text-[#14f1d9]">.</span>
          </h1>
        </div>

        {/* Content Body */}
        <div className="max-w-240 font-['Inter',sans-serif] text-[15px] leading-relaxed text-[#5d5d5d] dark:text-gray-300 space-y-6 md:text-[16px]">
          <p className="font-semibold text-[#181818] dark:text-white text-lg">
            Have a question, issue, or feedback? We’d love to hear from you.
          </p>
          
          <p>
            For general inquiries, support, feedback, or partnership questions, please contact us at:{' '}
            <a href="mailto:support@elyxaai.com" className="text-[#8022fe] font-semibold hover:underline">
              support@elyxaai.com
            </a>
          </p>

          <div className=" pl-4 my-8">
            <p className="font-semibold text-[#181818] dark:text-white uppercase tracking-wider text-[12px] mb-2">
              If you are reporting a bug, please include:
            </p>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-2.5">
                <span className="text-[#8022fe] mt-1">●</span>
                <span>A short description of the issue</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#8022fe] mt-1">●</span>
                <span>The page or feature where it happened</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#8022fe] mt-1">●</span>
                <span>Your device/browser</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#8022fe] mt-1">●</span>
                <span>A screenshot or screen recording if possible</span>
              </li>
            </ul>
          </div>

          <p className="pt-2">
            We are currently in soft launch, so user feedback is extremely valuable as we continue improving Elyxa.
          </p>
        </div>

        {/* Final CTA Section */}
        <div className="pt-16 md:pt-20">
          <FinalCTASection />
        </div>

      </div>
    </div>
  );
};

export default ContactView;
