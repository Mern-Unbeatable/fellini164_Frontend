import React from 'react';
import FAQHIWSection from '../prublic_home/components/how-it-works/FAQSection';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';

const FAQView = () => {
  return (
    <div className="w-full">
      <FAQHIWSection />
      <div className="mx-auto max-w-385 px-5 pb-12.5 lg:px-20 lg:pb-22.5">
        <FinalCTASection />
      </div>
    </div>
  );
};

export default FAQView;
