import React from 'react';
import { Sparkles, ListTodo, RefreshCw, Target, Calendar, HelpCircle } from 'lucide-react';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const AboutView = () => {
  return (
    <div className="w-full bg-[#fcfcfc] dark:bg-zinc-900 pt-10 pb-20 md:pt-16 md:pb-24">
      <div className="mx-auto max-w-325 px-5 md:px-10 lg:px-20">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center gap-4 mb-16 md:mb-20">
          <span className="rounded-full bg-[rgba(128,34,254,0.08)] px-4 py-1.5 text-xs font-semibold text-[#8022fe] tracking-wider uppercase">
            About Us
          </span>
          <h1 className="font-['Inter',sans-serif] text-[36px] md:text-[48px] leading-[1.2] font-bold text-[#181818] dark:text-white">
            About <span className="text-[#8022fe]">Elyxa</span>
          </h1>
          <p className="max-w-2xl font-['Inter',sans-serif] text-[16px] md:text-[18px] leading-relaxed text-[#5d5d5d] dark:text-gray-300 font-medium">
            Elyxa is an AI-powered adaptive planning platform built to help people organize their tasks, habits, goals, and daily plans in one place.
          </p>
        </div>

        {/* Core Belief Callout Card */}
        <div className="relative overflow-hidden rounded-[20px] border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-8 md:p-12 mb-16 md:mb-20 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)]">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#8022fe]" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-[14px] font-semibold text-[#8022fe] uppercase tracking-wider mb-2">Our Core Belief</h2>
              <p className="font-['Inter',sans-serif] text-[22px] md:text-[28px] leading-snug font-bold text-[#181818] dark:text-white">
                "Your plans should adapt to your life — not the other way around."
              </p>
            </div>
            <div className="flex-1 font-['Inter',sans-serif] text-[15px] leading-relaxed text-[#5d5d5d] dark:text-gray-300">
              Most productivity tools help users create plans, but they often fail when real life changes. Elyxa is designed to help users adapt when they fall behind, reduce overload, and stay focused on what matters most.
            </div>
          </div>
        </div>

        {/* Feature Grid: What Elyxa Helps Manage */}
        <div className="mb-16 md:mb-20">
          <h3 className="text-center font-['Inter',sans-serif] text-[24px] md:text-[30px] font-bold text-[#181818] dark:text-white mb-10">
            What Elyxa Helps You Manage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Tasks */}
            <div className="rounded-[16px] border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.01)] hover:shadow-[0px_8px_24px_0px_rgba(0,0,0,0.04)] transition-all">
              <div className="w-10 h-10 rounded-lg bg-[rgba(128,34,254,0.08)] flex items-center justify-center mb-4">
                <ListTodo className="h-5 w-5 text-[#8022fe]" />
              </div>
              <h4 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#181818] dark:text-white mb-2">Tasks</h4>
              <p className="font-['Inter',sans-serif] text-[14px] text-[#5d5d5d] dark:text-gray-300">
                Manage one-time actions with ease. Stay organized and ensure nothing slips through the cracks.
              </p>
            </div>

            {/* Habits */}
            <div className="rounded-[16px] border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.01)] hover:shadow-[0px_8px_24px_0px_rgba(0,0,0,0.04)] transition-all">
              <div className="w-10 h-10 rounded-lg bg-[rgba(20,241,217,0.08)] flex items-center justify-center mb-4">
                <RefreshCw className="h-5 w-5 text-[#10c4b0]" />
              </div>
              <h4 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#181818] dark:text-white mb-2">Habits</h4>
              <p className="font-['Inter',sans-serif] text-[14px] text-[#5d5d5d] dark:text-gray-300">
                Track repeating actions to build consistency over time and form lasting routines.
              </p>
            </div>

            {/* Goals */}
            <div className="rounded-[16px] border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.01)] hover:shadow-[0px_8px_24px_0px_rgba(0,0,0,0.04)] transition-all">
              <div className="w-10 h-10 rounded-lg bg-[rgba(249,115,22,0.08)] flex items-center justify-center mb-4">
                <Target className="h-5 w-5 text-[#f97316]" />
              </div>
              <h4 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#181818] dark:text-white mb-2">Goals</h4>
              <p className="font-['Inter',sans-serif] text-[14px] text-[#5d5d5d] dark:text-gray-300">
                Define grouped outcomes to align your daily efforts with your long-term ambitions.
              </p>
            </div>

            {/* Planner */}
            <div className="rounded-[16px] border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.01)] hover:shadow-[0px_8px_24px_0px_rgba(0,0,0,0.04)] transition-all">
              <div className="w-10 h-10 rounded-lg bg-[rgba(59,130,246,0.08)] flex items-center justify-center mb-4">
                <Calendar className="h-5 w-5 text-[#3b82f6]" />
              </div>
              <h4 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#181818] dark:text-white mb-2">Planner</h4>
              <p className="font-['Inter',sans-serif] text-[14px] text-[#5d5d5d] dark:text-gray-300">
                Structure your time across daily, weekly, and monthly views to keep your schedule organized.
              </p>
            </div>

            {/* AI Assistant */}
            <div className="rounded-[16px] border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.01)] hover:shadow-[0px_8px_24px_0px_rgba(0,0,0,0.04)] transition-all md:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-lg bg-[rgba(236,72,153,0.08)] flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5 text-[#ec4899]" />
              </div>
              <h4 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#181818] dark:text-white mb-2">AI Assistant</h4>
              <p className="font-['Inter',sans-serif] text-[14px] text-[#5d5d5d] dark:text-gray-300">
                Receive proactive guidance, personalized suggestions, and smart recalibration support when life happens.
              </p>
            </div>

          </div>
        </div>

        {/* Soft Launch & Feedback Banner */}
        <div className="rounded-[20px] bg-gradient-to-r from-[rgba(128,34,254,0.03)] to-[rgba(20,241,217,0.03)] border border-[rgba(128,34,254,0.1)] p-8 md:p-10 text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h3 className="font-['Inter',sans-serif] text-[20px] font-bold text-[#181818] dark:text-white mb-3">
            Our Mission & Soft Launch
          </h3>
          <p className="font-['Inter',sans-serif] text-[15px] leading-relaxed text-[#5d5d5d] dark:text-gray-300 mb-4">
            Our goal is to build a planning system that feels supportive, flexible, and realistic — not overwhelming or rigid. Elyxa is currently in soft launch, and we are actively collecting feedback from early users to improve the product.
          </p>
          <div className="inline-flex items-center gap-1.5 text-[#8022fe] font-semibold text-sm hover:underline cursor-pointer">
            <HelpCircle className="h-4 w-4" /> Reach out with your ideas & feedback
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="pt-10">
          <FinalCTASection />
        </div>

      </div>
    </div>
  );
};

export default AboutView;
