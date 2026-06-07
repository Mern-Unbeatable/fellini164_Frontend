import React from 'react';
import HeroSection from './components/HeroSection';
import WhyStruggleSection from './components/WhyStruggleSection';
import SmartCoachSection from './components/SmartCoachSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import WhatMakesItDiffrent from './components/WhatMakesItDiffrent';

const HomeView = () => {
  return (
    <div className="w-full dark:bg-black dark:text-white">
      <HeroSection />
      <WhyStruggleSection />
      <SmartCoachSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <WhatMakesItDiffrent />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default HomeView;
