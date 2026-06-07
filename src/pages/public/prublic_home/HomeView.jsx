import React from 'react';
import HeroSection from './components/HeroSection';
import WhyStruggleSection from './components/WhyStruggleSection';
import SmartCoachSection from './components/SmartCoachSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import WhatMakesItDiffrent from './components/WhatMakesItDiffrent';

const HomeView = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <WhyStruggleSection />
      <SmartCoachSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <WhatMakesItDiffrent />
      <CTASection />
    </div>
  );
};

export default HomeView;
