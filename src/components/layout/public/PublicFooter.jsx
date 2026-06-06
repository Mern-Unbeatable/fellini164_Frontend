

import React from 'react';

const PublicFooter = () => {
  return (
    <footer className="mt-0 w-full ">
      {/* Main Footer Content */}
      <div className="w-full bg-violet-900 dark:bg-black py-10 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          
        
          <div className="flex flex-wrap gap-y-10 gap-x-4 justify-between md:flex-nowrap">
            
         
            <div className="flex flex-col items-start justify-start gap-4 w-[calc(50%-1rem)] md:w-auto">
              <div className="font-['Inter'] text-lg font-medium text-white md:text-xl">
                Product
              </div>
              <div className="flex flex-col gap-2">
                <a href="#features" className="text-base text-white hover:text-violet-200">Features</a>
                <a href="#pricing" className="text-base text-white hover:text-violet-200">Pricing</a>
                <a href="#how-it-works" className="text-base text-white hover:text-violet-200">How It Works</a>
                <a href="#roadmap" className="text-base text-white hover:text-violet-200">Roadmap</a>
                <a href="/early-access" className="text-base text-white hover:text-violet-200">Early Access</a>
              </div>
            </div>

            {/* Company Column */}
            <div className="flex flex-col items-start justify-start gap-4 w-[calc(50%-1rem)] md:w-auto">
              <div className="font-['Inter'] text-lg font-medium text-white md:text-xl">
                Company
              </div>
              <div className="flex flex-col gap-2">
                <a href="#about" className="text-base text-white hover:text-violet-200">About Us</a>
                <a href="#contact" className="text-base text-white hover:text-violet-200">Contact Us</a>
                <a href="#blog" className="text-base text-white hover:text-violet-200">Blog</a>
                <a href="#careers" className="text-base text-white hover:text-violet-200">Careers</a>
              </div>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col items-start justify-start gap-4 w-[calc(50%-1rem)] md:w-auto">
              <div className="font-['Inter'] text-lg font-medium text-white md:text-xl">
                Legal
              </div>
              <div className="flex flex-col gap-2">
                <a href="#terms" className="text-base text-white hover:text-violet-200">Terms of Service</a>
                <a href="#privacy" className="text-base text-white hover:text-violet-200">Privacy Policy</a>
                <a href="#refund" className="text-base text-white hover:text-violet-200">Refund Policy</a>
                <a href="#security" className="text-base text-white hover:text-violet-200">Security</a>
              </div>
            </div>

            {/* Support Column */}
            <div className="flex flex-col items-start justify-start gap-4 w-[calc(50%-1rem)] md:w-auto">
              <div className="font-['Inter'] text-lg font-medium text-white md:text-xl">
                Support
              </div>
              <div className="flex flex-col gap-2">
                <a href="#help" className="text-base text-white hover:text-violet-200">Help Center</a>
                <a href="#faq" className="text-base text-white hover:text-violet-200">FAQ</a>
                <a href="#support" className="text-base text-white hover:text-violet-200">Contact Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="w-full border-t border-stone-300 bg-gray-200 dark:bg-zinc-900 py-4 md:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center font-['Inter'] text-xs text-black dark:text-white md:text-left md:text-sm">
             © 2026 Elyxa AI LLC. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {['Stripe', 'PayPal', 'Apple Pay', 'Google Pay'].map((pay) => (
                <div key={pay} className="cursor-pointer text-xs text-black dark:text-white hover:text-violet-600 md:text-sm">
                  {pay}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;