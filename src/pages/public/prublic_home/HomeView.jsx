import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import WhyStruggleSection from './components/WhyStruggleSection';
import SmartCoachSection from './components/SmartCoachSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import WhatMakesItDiffrent from './components/WhatMakesItDiffrent';

const HomeView = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === '#how-it-works') {
      navigate('/how-it-works', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="w-full">
      <HeroSection />
      <WhyStruggleSection />
      <SmartCoachSection />
      <FeaturesSection />
      <TestimonialsSection />
      <WhatMakesItDiffrent />
      <CTASection />
    </div>
  );
};

export default HomeView;
