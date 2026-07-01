import React from 'react';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const AboutView = () => {
  return (
    <div className="w-full bg-white pt-12.5 pb-20 md:pt-22.5 md:pb-24">
      <div className="mx-auto max-w-385 px-5 md:px-20">
        
        {/* Header Section */}
        <div className="flex flex-col gap-3.5 md:gap-5 mb-10 md:mb-14">
          <h1 className="font-['Inter',sans-serif] text-[28px] leading-[1.3] font-bold text-[#181818] md:text-[42px]">
            About <span className="text-[#8022fe]">Elyxa</span>
            <span className="text-[#14f1d9]">.</span>
          </h1>
        </div>

        {/* Content Body */}
        <div className="max-w-240 font-['Inter',sans-serif] text-[15px] leading-relaxed text-[#5d5d5d] dark:text-gray-300 space-y-6 md:text-[16px]">
          <p>
            Elyxa is an AI-powered adaptive planning platform built to help people organize their tasks, habits, goals, and daily plans in one place.
          </p>
          
          <p>
            Most productivity tools help users create plans, but they often fail when real life changes. Elyxa is designed to help users adapt when they fall behind, reduce overload, and stay focused on what matters most.
          </p>

          <div className="border-l-2 border-[#8022fe] pl-4 my-8">
            <p className="font-semibold text-[#181818] dark:text-white uppercase tracking-wider text-[12px] mb-1">
              Our core belief is simple:
            </p>
            <p className="text-[18px] md:text-[20px] font-bold text-[#181818] dark:text-white leading-snug">
              Your plans should adapt to your life — not the other way around.
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#181818] dark:text-white mb-3">
              Elyxa helps users manage:
            </p>
            <ul className="space-y-2.5 list-none pl-0">
              <li className="flex items-start gap-2.5">
                <span className="text-[#8022fe] mt-1">●</span>
                <span><strong>Tasks:</strong> one-time actions</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#8022fe] mt-1">●</span>
                <span><strong>Habits:</strong> repeating actions</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#8022fe] mt-1">●</span>
                <span><strong>Goals:</strong> grouped outcomes</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#8022fe] mt-1">●</span>
                <span><strong>Planner:</strong> daily, weekly, and monthly planning</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#8022fe] mt-1">●</span>
                <span><strong>AI Assistant:</strong> guidance, suggestions, and recalibration support</span>
              </li>
            </ul>
          </div>

          <p>
            Our goal is to build a planning system that feels supportive, flexible, and realistic — not overwhelming or rigid.
          </p>

          <p className="pt-2">
            Elyxa is currently in soft launch, and we are actively collecting feedback from early users to improve the product.
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

export default AboutView;
