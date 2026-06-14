import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Does this replace my calendar?',
      answer:
        'No. Elyxa is a layer that sits on top of your existing tools to make them smarter.',
    },
    {
      question: 'What makes this "Adaptive"?',
      answer:
        'Most tools just nag you to "catch up." Elyxa actually changes the plan to match your current reality.',
    },
    {
      question: 'Is this just another AI buzzword?',
      answer:
        " We focus on execution, not hype. The AI is used specifically to rerun the math on your day so you don't have to.",
    },
    {
      question: 'How is this different from a "Smart" to-do list?',
      answer:
        'To-do lists just collect tasks. Elyxa focuses on execution by continuously recalculating your best next move based on real-world constraints.',
    },
    
    {
      question: 'What happens if I fall behind by a lot?',
      answer:
        "That’s where Elyxa shines. Instead of overwhelming you with a backlog, it helps you ruthlessly reprioritize so you can start fresh with a plan that actually works.",
    },
    {
      question: 'What is the "Early Access" phase?',
      answer:
        ' We are currently in pre-launch. Joining the waitlist means you get to help shape the product and secure early-adopter benefits.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-white dark:bg-black">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center justify-start gap-8 md:gap-12">
          <div className="justify-start text-center">
            <span className="font-['Inter'] text-2xl font-semibold text-black dark:text-white md:text-3xl lg:text-4xl">
              Frequently Asked{' '}
            </span>
            <span className="font-['Inter'] text-2xl font-semibold text-indigo-600 dark:text-indigo-400 md:text-3xl lg:text-4xl">
              Questions
            </span>
          </div>
          <div className="flex w-full max-w-4xl flex-col items-center justify-start gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="w-full">
                <div
                  className="flex w-full cursor-pointer items-center justify-between rounded bg-gray-50 dark:bg-zinc-800 p-4 outline -outline-offset-1 outline-gray-100 dark:outline-zinc-700 md:p-6"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="justify-start text-left font-['Inter'] text-base font-medium text-black dark:text-white md:text-lg lg:text-xl">
                    {faq.question}
                  </div>
                  <ChevronDown
                    className={`ml-4 h-5 w-5 shrink-0 text-slate-900 dark:text-white transition-transform duration-200 md:h-6 md:w-6 ${openIndex === index ? 'rotate-180' : ''
                      }`}
                  />
                </div>
                {openIndex === index && (
                  <div className="mt-2 rounded bg-white dark:bg-zinc-900 p-4 text-left font-['Inter'] text-sm leading-6 font-normal text-zinc-600 dark:text-white md:p-6 md:text-base">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
