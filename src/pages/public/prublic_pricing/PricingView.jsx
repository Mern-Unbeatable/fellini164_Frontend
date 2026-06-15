import React from 'react';
import PricingHIW from '../prublic_home/components/how-it-works/PricingSection';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const PricingView = () => {
  return (
    <div className="w-full">
      <PricingHIW />
      <div className="mx-auto max-w-385 px-5 pb-12.5 md:px-20 md:pb-22.5">
        <FinalCTASection />
      </div>
    </div>
  );
};

export default PricingView;
