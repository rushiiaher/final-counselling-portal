'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';
import MotionButton from '@/components/animations/MotionButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, MessageCircle, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react';

const faqs = [
  {
    q: 'Are the counselling services really free?',
    a: 'Yes, all counselling services provided by the District Counselling Center are completely free of charge for all district residents. This is a Government of India initiative.',
  },
  {
    q: 'How do I book an appointment?',
    a: 'You can book an appointment online through our website, call our helpline at 1800-XXX-XXXX, or visit any of our offices in person during working hours.',
  },
  {
    q: 'Is my information kept confidential?',
    a: 'Absolutely. All counselling sessions and personal information are strictly confidential. We adhere to the ethical guidelines of the Rehabilitation Council of India (RCI).',
  },
  {
    q: 'Can I request a counsellor of a specific gender?',
    a: 'Yes, you can specify your preference when booking an appointment. We will do our best to accommodate your request based on availability.',
  },
  {
    q: 'Are online counselling sessions available?',
    a: 'Yes, we offer both online (video call) and offline (in-person) counselling sessions. You can choose your preferred mode when booking.',
  },
  {
    q: 'What languages are the sessions available in?',
    a: 'Sessions are available in Hindi, English, Kashmiri, and Urdu. Please mention your language preference when booking.',
  },
];

type FormState = 'idle' | 'error' | 'success';

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const requiredOk =
      String(data.get('fullName') ?? '').trim() &&
      String(data.get('phone') ?? '').trim() &&
      String(data.get('subject') ?? '').trim() &&
      String(data.get('message') ?? '').trim();

    if (!requiredOk) {
      setFormState('error');
      return;
    }
    setFormState('success');
  };

  return (
    <div className="min-h-screen bg-page">
      <SiteNavbar />

      {/* HERO BANNER */}
      <section className="relative overflow-hidden h-56 md:h-64">
        <img
          src="/cnt.png"
          alt="Contact Us"
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="absolute inset-0 flex items-center">
          <div className="page-container">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[13px] mb-3">
              <Link href="/" className="hover:text-white underline-offset-4 hover:underline transition-colors duration-150">Home</Link>
              <span aria-hidden>/</span>
              <span className="text-white font-medium">Contact</span>
            </nav>
            <h1 className="font-display text-[28px] md:text-h1 font-bold text-white mb-2">Contact <em className="not-italic">Us</em></h1>
            <p className="text-white/85 text-[0.9375rem] md:text-base max-w-2xl leading-relaxed">
              Reach out through any channel below — our team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* GET IN TOUCH */}
      <section className="section">
        <div className="page-container">
          <div>
            <span className="eyebrow">Send a Message</span>
            <div className="text-left">
              <h2 className="section-heading mt-1 mb-8">Get <em className="not-italic text-navy">In Touch</em></h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6 lg:gap-8 items-start">

            {/* FORM — right column on desktop */}
            <div className="ui-card p-5 sm:p-8 lg:order-2">
              {formState === 'success' ? (
                <div
                  role="status"
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-16 h-16 rounded-full bg-action-tint flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-9 h-9 text-action" />
                  </div>
                  <h3 className="font-display text-h3 font-bold text-ink mb-2">Message Sent!</h3>
                  <p className="text-ink-2 text-[0.9375rem] max-w-xs mb-6">
                    Thank you for reaching out. Our team will get back to you within 1–2 business days.
                  </p>
                  <MotionButton
                    onClick={() => setFormState('idle')}
                    className="btn btn-primary px-8"
                  >
                    Send Another Message
                  </MotionButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-fullName" className="field-label">Full Name <span className="text-danger">*</span></label>
                        <input id="contact-fullName" name="fullName" type="text" placeholder="Your full name" autoComplete="name"
                          className="field" />
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="field-label">Phone Number <span className="text-danger">*</span></label>
                        <input id="contact-phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" autoComplete="tel"
                          className="field" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="field-label">Email Address <span className="text-ink-2 font-normal">(optional)</span></label>
                      <input id="contact-email" name="email" type="email" placeholder="your@email.com" autoComplete="email"
                        className="field" />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="field-label">Subject <span className="text-danger">*</span></label>
                      <select id="contact-subject" name="subject" className="field">
                        <option value="">Select a subject</option>
                        <option>Appointment Enquiry</option>
                        <option>Career Counselling</option>
                        <option>Mental Wellness Support</option>
                        <option>Educational Guidance</option>
                        <option>Family Counselling</option>
                        <option>Event Registration</option>
                        <option>Grievance / Complaint</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="field-label">Message <span className="text-danger">*</span></label>
                      <textarea id="contact-message" name="message" rows={5} placeholder="Please describe how we can help you..."
                        className="field resize-none" />
                    </div>
                    {formState === 'error' && (
                      <p
                        role="alert"
                        className="bg-danger-tint text-danger text-[13px] font-medium rounded-[8px] px-3 py-2.5"
                      >
                        Please fill in all required fields marked with *.
                      </p>
                    )}
                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="consent" className="mt-0.5 w-5 h-5 shrink-0 accent-[#1B3A6B]" />
                      <label htmlFor="consent" className="text-[13px] text-ink-2 leading-relaxed">
                        I consent to the District Counselling Center collecting and processing my personal information to respond to my enquiry. My information will be kept confidential.
                      </label>
                    </div>
                    <div>
                      <MotionButton
                        type="submit"
                        className="btn btn-primary w-full"
                      >
                        Send Message →
                      </MotionButton>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* CONTACT DETAILS — left column on desktop */}
            <div className="space-y-4 lg:order-1">

              {/* Quick contact */}
              <div className="ui-card p-5 sm:p-6">
                <h3 className="font-display font-bold text-ink text-h3 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-navy" /> Contact Details
                </h3>
                <ul className="divide-y divide-line text-sm">
                  {[
                    { icon: <Phone className="w-4 h-4" />, label: 'Helpline (Toll-free)', value: '1800-XXX-XXXX' },
                    { icon: <Phone className="w-4 h-4" />, label: 'Office Direct', value: '+91-XXXXX-XXXXX' },
                    { icon: <MessageCircle className="w-4 h-4" />, label: 'WhatsApp', value: '+91-XXXXX-XXXXX' },
                    { icon: <Mail className="w-4 h-4" />, label: 'General Enquiry', value: 'info@dcc.gov.in' },
                    { icon: <Mail className="w-4 h-4" />, label: 'Appointments', value: 'appointments@dcc.gov.in' },
                    { icon: <MapPin className="w-4 h-4" />, label: 'Address', value: 'Civil Lines, Near Collectorate, District HQ – 110001' },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="w-9 h-9 rounded-full bg-tint text-navy flex items-center justify-center shrink-0">{item.icon}</span>
                      <span className="min-w-0">
                        <span className="block text-ink-2 text-[13px]">{item.label}</span>
                        <span className="block text-ink font-semibold text-[0.9375rem] break-words">{item.value}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Office hours */}
              <div className="ui-card p-5 sm:p-6">
                <h3 className="font-display font-bold text-ink text-h3 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-navy" /> Office Timings
                </h3>
                <div>
                  {[
                    { day: 'Monday – Friday', time: '9:00 AM – 5:00 PM', open: true },
                    { day: 'Saturday', time: '9:00 AM – 1:00 PM', open: true },
                    { day: 'Sunday', time: 'Closed', open: false },
                    { day: 'Public Holidays', time: 'Closed', open: false },
                  ].map((row) => (
                    <div key={row.day} className="flex items-center justify-between gap-3 py-2.5 border-b border-line last:border-0">
                      <span className="text-ink text-sm">{row.day}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-ink-2 text-sm">{row.time}</span>
                        <span className={`tag ${row.open ? 'tag-green' : 'tag-red'}`}>
                          {row.open ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book appointment nudge */}
              <div className="bg-tint rounded-[16px] p-5">
                <p className="text-navy text-sm font-bold mb-1">Book an Appointment</p>
                <p className="text-navy/80 text-[13px] leading-relaxed">For counselling sessions, we recommend booking in advance. Walk-ins are accepted subject to counsellor availability.</p>
                <Link href="/student/talk" className="btn btn-saffron btn-sm mt-3">Book a session</Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-surface border-t border-line">
        <div className="page-container max-w-[800px]">
          <div>
            <span className="eyebrow">Common Questions</span>
            <div className="text-left">
              <h2 className="section-heading mt-1 mb-6">Frequently Asked <em className="not-italic text-navy">Questions</em></h2>
            </div>
          </div>

          <div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={faq.q}>
                  <AccordionItem
                    value={`item-${i}`}
                    className="bg-page rounded-[16px] px-5 border border-line [&_svg]:text-navy"
                  >
                    <AccordionTrigger className="text-ink text-[0.9375rem] hover:no-underline gap-3 min-h-[56px]">
                      <span className="flex items-start gap-2">
                        <span className="text-navy shrink-0 font-bold">Q.</span>
                        {faq.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-ink-2 text-sm leading-relaxed pl-6">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter
        subtitle="Anantnag, J&K"
        quickLinks={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Counsellors', href: '/counselors' }, { label: 'Contact', href: '/contact' }]}
        services={['Career Counselling', 'Educational Guidance', 'Mental Wellness', 'Youth Guidance', 'Family Counselling']}
      />
    </div>
  );
}
