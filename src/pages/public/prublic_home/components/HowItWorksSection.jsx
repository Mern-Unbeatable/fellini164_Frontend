import React from 'react';
import HeroHIW from './how-it-works/HeroSection';
import BreakingSection from './how-it-works/BreakingSection';
import AdaptsSection from './how-it-works/AdaptsSection';
import PricingHIW from './how-it-works/PricingSection';
import MissingLayerSection from './how-it-works/MissingLayerSection';
import FAQHIWSection from './how-it-works/FAQSection';

export { FinalCTASection } from './how-it-works/FinalCTASection';

const HowItWorksSection = () => (
  <div className="w-full">
    <HeroHIW />
    <BreakingSection />
    <AdaptsSection />
    <PricingHIW />
    <MissingLayerSection />
    <FAQHIWSection />
  </div>
);

export default HowItWorksSection;
