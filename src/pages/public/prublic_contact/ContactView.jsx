import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FinalCTASection } from '../prublic_home/components/how-it-works/FinalCTASection';
import { GoMail } from 'react-icons/go';
import { PiMapPin } from 'react-icons/pi';
import { HiArrowRight } from 'react-icons/hi';

gsap.registerPlugin(ScrollTrigger);

const CONTACT_INFO = [
  {
    icon: GoMail,
    label: 'Email Us',
    value: 'support@elyxa.ai',
    sub: 'We reply within 24 hours',
    href: 'mailto:support@elyxa.ai',
  },
  {
    icon: PiMapPin,
    label: 'Office',
    value: 'San Francisco, CA',
    sub: 'United States',
    href: '#',
  },
];

const INPUT_BASE =
  "w-full rounded-[10px] border border-[#f2f2f2] bg-white px-4 py-3 font-['Inter',sans-serif] text-[14px] font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] transition-colors focus:border-[#8022fe] lg:text-[15px]";

const ContactView = () => {
  const secRef = useRef(null);
  const headRef = useRef(null);
  const formRef = useRef(null);
  const c0 = useRef(null);
  const c1 = useRef(null);
  const cardRefs = [c0, c1];

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0, y: 24, duration: 0.55, ease: 'power2.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true },
      });
      cardRefs.forEach((r, i) => {
        gsap.from(r.current, {
          opacity: 0, y: 16, duration: 0.45, ease: 'power2.out', delay: i * 0.08,
          scrollTrigger: { trigger: r.current, start: 'top 90%', once: true },
        });
      });
      gsap.from(formRef.current, {
        opacity: 0, y: 20, duration: 0.55, ease: 'power2.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 88%', once: true },
      });
    }, secRef);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div ref={secRef} className="w-full bg-white">
      {/* ── Hero ── */}
      <div className="mx-auto max-w-385 px-5 pt-12.5 pb-10 lg:px-20 lg:pt-22.5 lg:pb-15">
        <div ref={headRef} className="flex flex-col gap-3.5 lg:gap-5">
          <h1 className="font-['Inter',sans-serif] text-[28px] leading-[1.3] font-bold text-[#181818] lg:text-[42px]">
            Get in <span className="text-[#8022fe]">Touch</span>
            <span className="text-[#14f1d9]">.</span>
          </h1>
          <p className="max-w-160 font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#888] lg:text-[16px]">
            Have a question, feedback, or just want to say hi? We'd love to hear from you. Our team typically responds within 24 hours.
          </p>
        </div>
      </div>

      {/* ── Contact Info Cards ── */}
      <div className="mx-auto max-w-385 px-5 pb-10 lg:px-20 lg:pb-15">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CONTACT_INFO.map((item, i) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                ref={cardRefs[i]}
                href={item.href}
                className="group flex flex-col gap-3.5 rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5 no-underline transition-colors hover:border-[#8022fe]/30 lg:p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#f9f4ff]">
                  <Icon className="h-5 w-5 text-[#8022fe]" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-wider text-[#c2c2c2]">
                    {item.label}
                  </p>
                  <p className="font-['Inter',sans-serif] text-[15px] font-semibold text-[#181818] lg:text-[16px]">
                    {item.value}
                  </p>
                  <p className="font-['Inter',sans-serif] text-[13px] font-medium text-[#888]">
                    {item.sub}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Contact Form ── */}
      <div className="mx-auto max-w-385 px-5 pb-12.5 lg:px-20 lg:pb-22.5">
        <div
          ref={formRef}
          className="w-full rounded-[20px] border border-[#f2f2f2] bg-[#fcfcfc] p-5 lg:p-10"
        >
          <div className="mb-6 flex flex-col gap-1.5 lg:mb-8">
            <h2 className="font-['Inter',sans-serif] text-[20px] font-bold text-[#181818] lg:text-[26px]">
              Send us a message
            </h2>
            <p className="font-['Inter',sans-serif] text-[14px] font-medium text-[#888]">
              Fill out the form below and we'll get back to you shortly.
            </p>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#f9f4ff]">
                <GoMail className="h-7 w-7 text-[#8022fe]" />
              </div>
              <h3 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#181818]">
                Message sent!
              </h3>
              <p className="font-['Inter',sans-serif] text-[14px] font-medium text-[#888]">
                Thanks for reaching out. We'll reply within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-2 rounded-[10px] border-2 border-[#8022fe] bg-white px-5 py-2.5 font-['Inter',sans-serif] text-[14px] font-semibold text-[#8022fe] outline-none transition-colors hover:bg-[#f9f4ff] focus:outline-none"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#181818]">
                    Full Name <span className="text-[#8022fe]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className={INPUT_BASE}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#181818]">
                    Email Address <span className="text-[#8022fe]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className={INPUT_BASE}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#181818]">
                  Subject <span className="text-[#8022fe]">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                  className={INPUT_BASE}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter',sans-serif] text-[13px] font-semibold text-[#181818]">
                  Message <span className="text-[#8022fe]">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className={`${INPUT_BASE} resize-none`}
                />
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-['Inter',sans-serif] text-[12px] font-medium text-[#c2c2c2]">
                  We never share your information.
                </p>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#8022fe] px-6 py-3 font-['Inter',sans-serif] text-[14px] font-semibold text-white outline-none transition-colors hover:bg-[#6b1bdb] focus:outline-none focus-visible:outline-none sm:w-auto"
                >
                  Send Message
                  <HiArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div className="mx-auto max-w-385 px-5 pb-12.5 lg:px-20 lg:pb-22.5">
        <FinalCTASection />
      </div>
    </div>
  );
};

export default ContactView;
