'use client';

import { useState, useEffect } from 'react';
import { CalendarCheck, ClipboardCheck, Users, GraduationCap, MessagesSquare, Presentation } from 'lucide-react';
import { useBookSession } from '@/lib/booking';
import MotionButton from '@/components/animations/MotionButton';
import AnimatedCounter from '@/components/animations/AnimatedCounter';

const districtStats = [
  { label: 'Certified Counsellors', value: '150+', icon: Users },
  { label: 'Students Guided', value: '25,000+', icon: GraduationCap },
  { label: 'Sessions Conducted', value: '50,000+', icon: MessagesSquare },
  { label: 'Workshops Completed', value: '500+', icon: Presentation },
];

const slides = [
  { bg: '/banner.png', alt: 'Here to Listen, Here to Help — Counselling Portal Anantnag', pos: 'object-cover object-left' },
  { bg: '/coun1.jpg', alt: 'A counselling session in progress', pos: 'object-cover object-top' },
];

/* Hero (design: landing.jsx → Hero + QuickStrip) */
export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const bookSession = useBookSession();

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-page">

      {/* Navy hero */}
      <section
        id="main"
        className="relative overflow-hidden text-white bg-[linear-gradient(115deg,#0B2F6B_0%,#00355F_55%,#0E5A8A_100%)]"
      >
        <div
          className="absolute inset-0 opacity-[0.14] bg-cover bg-center"
          style={{ backgroundImage: 'url(/design/kashmir_students.png)' }}
          aria-hidden
        />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-saffron/12" aria-hidden />
        <div className="absolute -left-16 -bottom-24 w-64 h-64 rounded-full bg-india-green/12" aria-hidden />

        <div className="page-container relative pt-10 pb-20 md:pt-14 md:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/12 border border-white/20 px-3.5 py-1.5 rounded-full text-[12px] sm:text-[12.5px] font-semibold mb-5">
              <span className="w-2 h-2 rounded-full bg-saffron" /> An e-Governance initiative · Government of Jammu &amp; Kashmir
            </span>
            <h2 className="font-display font-extrabold text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.08] tracking-[-0.025em] text-white">
              Here to Listen, <span className="text-saffron">Here to Help</span>
            </h2>
            <p className="text-white/90 text-[15px] sm:text-[16.5px] leading-relaxed mt-4 mb-7 max-w-[520px]">
              Your well-being is our priority. Confidential. Compassionate. Professional. Expert, free support for career,
              education &amp; mental wellness — for every student and young person of J&amp;K.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <MotionButton onClick={() => bookSession()} className="btn btn-saffron !min-h-[50px] !px-6 !text-[15px]">
                <CalendarCheck className="w-5 h-5" /> Book an Appointment
              </MotionButton>
              <MotionButton href="/assessments" className="btn btn-glass !min-h-[50px] !px-6 !text-[15px]">
                <ClipboardCheck className="w-5 h-5" /> Free Self Assessments
              </MotionButton>
            </div>
          </div>

          {/* Banner carousel, framed */}
          <div>
            <div className="relative w-full aspect-[1717/916] overflow-hidden rounded-[18px] border border-white/25 bg-white/10 shadow-[0_20px_50px_rgb(0_0_0/0.25)]">
              {slides.map((slide, i) => (
                <img
                  key={slide.bg}
                  src={slide.bg}
                  alt={slide.alt}
                  aria-hidden={i !== current}
                  className={`absolute inset-0 w-full h-full ${slide.pos} transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Slide ${i + 1}`}
                  aria-current={i === current}
                  className="h-8 min-w-8 flex items-center justify-center"
                >
                  <span className={`block h-2 rounded-full transition-all duration-200 ${i === current ? 'bg-saffron w-6' : 'bg-white/45 w-2'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating stat strip */}
      <div className="page-container relative z-[5] -mt-12">
        <div className="bg-surface rounded-[18px] border border-line shadow-[0_16px_40px_rgb(11_47_107/0.16)] p-2.5 grid grid-cols-2 lg:grid-cols-4 gap-2">
          {districtStats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 px-3 py-3 sm:px-4 sm:py-4 rounded-[13px] hover:bg-page transition-colors">
              <span className="w-11 h-11 rounded-[12px] bg-tint grid place-items-center shrink-0">
                <Icon className="w-6 h-6 text-navy" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-navy-deep text-[20px] sm:text-[24px] font-extrabold leading-none">
                  <AnimatedCounter value={value} />
                </p>
                <p className="text-ink-2 text-[12px] sm:text-[12.5px] font-medium leading-snug mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
