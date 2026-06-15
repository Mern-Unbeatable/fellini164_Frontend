import React from 'react';
import HeroHIW from './how-it-works/HeroSection';
import BreakingSection from './how-it-works/BreakingSection';
import AdaptsSection from './how-it-works/AdaptsSection';
import PricingHIW from './how-it-works/PricingSection';
import MissingLayerSection from './how-it-works/MissingLayerSection';
import FAQHIWSection from './how-it-works/FAQSection';
import { FinalCTASection } from './how-it-works/FinalCTASection';

export { FinalCTASection } from './how-it-works/FinalCTASection';

const HowItWorksSection = () => (
  <div className="w-full">
    <HeroHIW />
    <BreakingSection />
    <AdaptsSection />
    <PricingHIW />
    <MissingLayerSection />
    <FAQHIWSection />
    <div className="mx-auto max-w-385 px-5 pb-12.5 lg:px-20 lg:pb-22.5">
      <FinalCTASection />
    </div>
  </div>
);

export default HowItWorksSection;
