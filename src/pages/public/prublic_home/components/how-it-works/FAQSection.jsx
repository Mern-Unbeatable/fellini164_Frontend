import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: 'Does this replace my calendar?',
    a: 'No. Elyxa is a layer that sits on top of your existing tools to make them smarter.',
  },
  {
    q: 'What makes this "Adaptive"?',
    a: 'Most tools just nag you to "catch up." Elyxa actually changes the plan to match your current reality.',
  },
  {
    q: 'Is this just another AI buzzword?',
    a: "We focus on execution, not hype. The AI is used specifically to rerun the math on your day so you don't have to.",
  },
  {
    q: 'How is this different from a "Smart" to-do list?',
    a: 'To-do lists just collect tasks. Elyxa focuses on execution by continuously recalculating your best next move based on real-world constraints.',
  },
  {
    q: 'What happens if I fall behind by a lot?',
    a: "That's where Elyxa shines. Instead of overwhelming you with a backlog, it helps you ruthlessly reprioritize so you can start fresh with a plan that actually works.",
  },
  {
    q: 'What is the "Early Access" phase?',
    a: 'We are currently in pre-launch. Joining the waitlist means you get to help shape the product and secure early-adopter benefits.',
  },
];

const FAQItem = ({ faq, animRef }) => {
  const [open, setOpen] = useState(false);
  return (
    <div ref={animRef} className="overflow-hidden rounded-2xl border border-[#f0f0f0] bg-white">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-5 py-4 text-left lg:px-7 lg:py-5"
      >
        <p className={`font-['Inter',sans-serif] text-[16px] font-semibold ${open ? 'text-[#8022fe]' : 'text-[#181818]'}`}>
          {faq.q}
        </p>
        <div className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center ${open ? 'text-[#8022fe]' : 'text-[#181818]'}`}>
          {open ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H12M7 2V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </button>
      <div
        className="transition-all duration-300 ease-out"
        style={{ maxHeight: open ? '300px' : '0px', overflow: 'hidden' }}
      >
        <p className="px-5 pb-5 font-['Inter',sans-serif] text-[15px] leading-relaxed font-medium text-[#888] lg:px-7 lg:pb-6">
          {faq.a}
        </p>
      </div>
    </div>
  );
};

const FAQHIWSection = () => {
  const secRef = useRef(null);
  const headRef = useRef(null);
  const f0 = useRef(null);
  const f1 = useRef(null);
  const f2 = useRef(null);
  const f3 = useRef(null);
  const f4 = useRef(null);
  const f5 = useRef(null);
  const faqRefs = [f0, f1, f2, f3, f4, f5];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true },
      });
      faqRefs.forEach((r, i) => {
        gsap.from(r.current, {
          opacity: 0, y: 14, duration: 0.45, ease: 'power2.out', delay: i * 0.07,
          scrollTrigger: { trigger: r.current, start: 'top 92%', once: true },
        });
      });
    }, secRef);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={secRef} className="w-full bg-[#fcfcfc] py-12.5 lg:py-20">
      <div className="mx-auto max-w-385 px-5 lg:px-20">
        <div className="mx-auto max-w-225">
          <div ref={headRef} className="mb-6 text-center">
            <h2 className="font-['Inter',sans-serif] text-[26px] font-bold text-[#181818] sm:text-[34px]">
              Frequently Asked <span className="text-[#8022fe]">Questions</span>
              <span className="text-[#14f1d9]">.</span>
            </h2>
            <p className="mt-3 font-['Inter',sans-serif] text-[15px] font-medium text-[#888]">
              Everything you need to know before getting started.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={faq.q} faq={faq} animRef={faqRefs[i]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQHIWSection;
