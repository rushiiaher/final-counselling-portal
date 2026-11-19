"use client";

import { useState } from 'react';
import Link from 'next/link';
import HeroCarousel from '@/components/home/HeroCarousel';
import PortalAccess from '@/components/home/PortalAccess';
import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';
import { useBookSession } from '@/lib/booking';
import MotionButton from '@/components/animations/MotionButton';
import { ArrowRight, ShieldCheck, Pause, Play, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const bookSession = useBookSession();
  const [logosPaused, setLogosPaused] = useState(false);

  return (
    <div className="min-h-screen bg-page">
      <SiteNavbar />

      {/* CAROUSEL SECTION */}
      <HeroCarousel />

      {/* ACCESS YOUR PORTAL */}
      <PortalAccess />

      {/* SERVICES SECTION */}
      <section className="section pt-2 md:pt-4">
        <div className="page-container">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-3">
            <div>
              <span className="eyebrow">What We Offer</span>
              <h2 className="section-heading mt-1">
                Counselling for{' '}
                <em className="not-italic text-navy">Every Need</em>
              </h2>
              <p className="section-lead mt-2 max-w-md">
                From career guidance to trauma therapy — expert, free support for J&amp;K youth.
              </p>
            </div>
            <Link href="/services" className="btn btn-ghost self-start md:self-auto px-3">
              View all services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 016 4.5h3.75m0 0V3a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v1.5m-4.5 0h4.5M9.75 9h4.5m-4.5 3h4.5m-4.5 3h2.25" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.5h-3a.75.75 0 00-.75.75V6h4.5V5.25a.75.75 0 00-.75-.75z" />
                  </svg>
                ),
                title: 'Career Counselling',
                desc: 'Aptitude assessments, career mapping, stream selection for class 11–12, and professional development for graduates.',
                tags: [
                  { label: 'Class 11–12' },
                  { label: 'Graduates' },
                ],
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
                title: 'Mental Wellness',
                desc: 'Trauma-informed therapy, PTSD support, anxiety & depression counselling in a completely confidential setting. Available in Kashmiri, Urdu & Hindi.',
                tags: [
                  { label: 'Trauma Informed' },
                  { label: 'Anonymous' },
                ],
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25l-8.25-4.5L12 5.25l8.25 4.5L12 14.25z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75v5.25m16.5-5.25v5.25M12 14.25v4.5m-4.5-2.25A4.5 4.5 0 0112 18.75a4.5 4.5 0 014.5-2.25" />
                  </svg>
                ),
                title: 'Educational Guidance',
                desc: 'Academic support, higher education planning, and study skill coaching from class 11 through PG.',
                tags: [
                  { label: 'Higher Education' },
                  { label: 'Study Skills' },
                ],
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
                title: 'Group Therapy',
                desc: 'Facilitated groups for peer support — conflict recovery, academic stress, identity building. 6–10 students, confidential environment.',
                tags: [
                  { label: 'Peer Support' },
                  { label: '6–10 students' },
                ],
              },
            ].map((service) => (
              <article key={service.title} className="ui-card ui-card-hover p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-[12px] bg-tint text-navy flex items-center justify-center shrink-0">
                    {service.icon}
                  </div>
                  <span className="tag tag-neutral text-[11px]">
                    <ShieldCheck className="w-3 h-3" /> Govt. Certified
                  </span>
                </div>
                <h3 className="font-display font-bold text-ink text-h3">{service.title}</h3>
                <span className="text-[13px] font-semibold text-action mt-0.5">Free Service</span>
                <p className="text-ink-2 text-[0.9375rem] leading-relaxed mt-3 flex-1">{service.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {service.tags.map((tag) => (
                    <span key={tag.label} className="tag">
                      {tag.label}
                    </span>
                  ))}
                </div>
                <div className="border-t border-line mt-4 pt-3">
                  <button
                    onClick={() => bookSession()}
                    className="inline-flex items-center gap-1 min-h-[44px] text-navy text-sm font-semibold hover:underline underline-offset-4"
                  >
                    Book Session <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="section bg-surface border-y border-line">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* LEFT */}
            <div>
              <span className="eyebrow">About Us</span>
              <h2 className="section-heading mt-1 mb-3">
                Dedicated to Empowering <em className="not-italic text-navy">Every Individual</em>
              </h2>
              <p className="section-lead mb-6 max-w-lg">
                The District Counselling Center is a government-established institution providing accessible, professional, and confidential counselling to students, youth, and families across the district.
              </p>

              {/* Mission / Vision / Objectives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    label: 'Mission',
                    desc: 'Accessible, professional counselling that empowers individuals to overcome challenges and reach their full potential.',
                  },
                  {
                    label: 'Vision',
                    desc: 'A district where every individual has access to quality mental health and guidance services.',
                  },
                  {
                    label: 'Objectives',
                    desc: 'Evidence-based counselling, mental health awareness, counsellor capacity building, and equitable access for all.',
                  },
                  {
                    label: 'Values',
                    desc: 'Compassion, integrity, inclusivity, and respect for every individual we serve across the district.',
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-[16px] bg-page border border-line p-4">
                    <span className="text-[13px] font-bold text-navy">{item.label}</span>
                    <p className="text-ink-2 text-sm leading-relaxed mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Why Choose Us */}
            <div className="ui-card p-5 md:p-7">
              <h3 className="font-display text-h2 font-bold text-ink mb-1">Why Choose Us</h3>
              <p className="text-ink-2 text-sm mb-5">What sets our counselling center apart.</p>

              <ul className="divide-y divide-line">
                {[
                  'Government-certified & accredited counsellors',
                  'Free services for all district residents',
                  'Completely confidential and safe environment',
                  'Available in Kashmiri, Urdu, Hindi & English',
                  'Online and offline session options',
                  'Specialized programs for different age groups',
                  'Evidence-based counselling approaches',
                  'Follow-up support and progress tracking',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 py-3">
                    <CheckCircle2 className="w-5 h-5 text-action shrink-0 mt-px" aria-hidden />
                    <span className="text-ink text-[0.9375rem]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* COUNSELLORS SECTION */}
      <section className="section">
        <div className="page-container">
          <div className="mb-8">
            <div>
              <span className="eyebrow">Meet Our Team</span>
              <h2 className="section-heading mt-1 mb-2">Our Expert <em className="not-italic text-navy">Counsellors</em></h2>
            </div>
            <p className="section-lead max-w-2xl">Our team of certified professionals brings years of experience and compassion to every counselling session.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Dr. Aamir Wani', qual: 'Ph.D. Psychology', spec: 'Career & Mental Wellness', exp: '15 Years', district: 'Srinagar' },
              { name: 'Mr. Tariq Ahmed Lone', qual: 'M.A. Counselling', spec: 'Youth & Family Guidance', exp: '10 Years', district: 'Baramulla' },
              { name: 'Dr. Nighat Bhat', qual: 'Ph.D. Education', spec: 'Educational Guidance', exp: '18 Years', district: 'Anantnag' },
              { name: 'Ms. Iqra Mir', qual: 'M.Sc. Psychology', spec: 'Personal Counselling', exp: '8 Years', district: 'Budgam' },
            ].map((counsellor) => (
              <article key={counsellor.name} className="ui-card ui-card-hover p-5 flex flex-col items-center text-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(counsellor.name)}&background=1a3a6b&color=fff&size=128`}
                  alt={counsellor.name}
                  loading="lazy"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full ring-4 ring-tint"
                />
                <h3 className="font-display font-bold text-ink text-h3 mt-4">{counsellor.name}</h3>
                <p className="text-navy text-sm font-semibold mt-0.5">{counsellor.qual}</p>
                <span className="tag mt-3">{counsellor.spec}</span>
                <div className="text-ink-2 text-[13px] mt-3 space-y-0.5">
                  <p>{counsellor.exp} Experience</p>
                  <p>District: {counsellor.district}</p>
                </div>
                <Link href="/counselors" className="btn btn-outline btn-sm w-full mt-4">
                  View Profile
                </Link>
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <MotionButton href="/counselors" className="btn btn-primary px-8">
              View All Counsellors <ArrowRight className="w-4 h-4" />
            </MotionButton>
          </div>
        </div>
      </section>

      {/* EXPLORE COUNSELLING BANNER */}
      <section className="pb-12 md:pb-16">
        <div className="page-container">
          <div className="relative bg-navy rounded-[16px] overflow-hidden px-5 md:px-12 py-6 md:py-8 flex flex-row items-center justify-between gap-4">
            {/* LEFT — text */}
            <div className="relative flex-1 min-w-0">
              <h2 className="text-white text-lg sm:text-2xl font-bold leading-snug mb-2">
                Explore Your Counselling <span className="text-saffron">Journey Today!</span>
              </h2>
              <p className="text-white/80 text-sm sm:text-[0.9375rem] mb-4 max-w-md">
                Connect with certified counsellors, take free self-assessments, and get expert guidance for career, education &amp; mental wellness.
              </p>
              <MotionButton
                onClick={() => bookSession()}
                className="btn btn-on-dark"
              >
                <span className="text-base">+</span> Start Your Counselling
              </MotionButton>
            </div>

            {/* RIGHT — earth image */}
            <div className="relative shrink-0 self-end">
              <img
                src="/earth.png"
                alt="Explore Counselling"
                loading="lazy"
                className="h-20 sm:h-32 md:h-36 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="section">
        <div className="page-container">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="eyebrow">Student Voices</span>
            <div className="text-center">
              <h2 className="section-heading mt-1 mb-2">
                Stories of{' '}
                <em className="not-italic text-navy">Healing &amp; Growth</em>
              </h2>
            </div>
            <p className="section-lead max-w-2xl mx-auto">
              Hear from the students and families we've helped on their journey toward healing, growth, and success.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                text: '"I didn\'t want anyone to know I was getting help. The anonymous booking option made all the difference — I finally talked to someone."',
                name: 'Aadil Khan',
                role: 'Class 12 Student, Anantnag',
                initials: 'AK',
                rating: 5,
              },
              {
                text: '"Dr. Priya helped me understand I had PTSD symptoms. I was told I was just being \'weak\' all my life. This center changed my world."',
                name: 'Sana Rashid',
                role: 'B.A. 2nd Year, GDC Anantnag',
                initials: 'SR',
                rating: 5,
              },
              {
                text: '"The career counsellor helped me see engineering wasn\'t right for me. Now I\'m pursuing law — and I love it. I wish this existed earlier."',
                name: 'Imran Mir',
                role: 'LLB Student, Anantnag',
                initials: 'IM',
                rating: 5,
              },
            ].map((t) => (
              <figure key={t.name} className="ui-card p-6 flex flex-col gap-4 h-full">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-[#D97706] text-base leading-none">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-ink text-[0.9375rem] leading-relaxed flex-1">{t.text}</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-line">
                  <div className="w-10 h-10 rounded-full bg-tint text-navy flex items-center justify-center text-xs font-bold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-ink font-semibold text-sm leading-tight">{t.name}</p>
                    <p className="text-ink-2 text-[13px]">{t.role}</p>
                  </div>
                </div>
              </figure>
            ))}
          </div>

        </div>
      </section>

      {/* 3 EASY STEPS SECTION */}
      <section className="section bg-surface border-y border-line">
        <div className="page-container max-w-[960px]">
          {/* Header — centered */}
          <div className="text-center mb-8 md:mb-12">
            <span className="eyebrow">Simple Process</span>
            <div className="text-center">
              <h2 className="section-heading mt-1 mb-2">
                Get Help in <em className="not-italic text-navy">3 Easy Steps</em>
              </h2>
            </div>
            <p className="section-lead">
              No complicated forms, no long waits. Start your wellness journey today.
            </p>
          </div>

          {/* Steps — stacked cards on mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {[
              { n: '1', title: 'Choose Your Service', desc: 'Pick from career, mental health, academic, group therapy or family counselling — in-person or online.' },
              { n: '2', title: 'Pick a Counsellor & Slot', desc: 'Browse certified counsellors by specialty and language, then select an available time slot.' },
              { n: '3', title: 'Attend Your Session', desc: 'Visit our center or join via video call. Free, confidential, and conducted by certified professionals.' },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-4 rounded-[16px] bg-page border border-line px-5 py-4">
                <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center shrink-0">
                  <span className="font-display font-bold text-base">{step.n}</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-ink text-base mb-1">{step.title}</h3>
                  <p className="text-ink-2 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop layout — three columns */}
          <div className="hidden md:block">
            <div className="relative grid grid-cols-3 gap-6">
              {/* Connector line */}
              <div
                className="absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] border-t border-dashed border-line"
                aria-hidden="true"
              />
              {[
                { n: '1', title: 'Choose Your Service', desc: 'Pick from career, mental health, academic, group therapy or family counselling — in-person or online. Anonymous option available.' },
                { n: '2', title: 'Pick a Counsellor & Slot', desc: 'Browse certified counsellors by specialty, language (Kashmiri/Urdu/Hindi/English), and select an available time slot.' },
                { n: '3', title: 'Attend Your Session', desc: 'Visit our center or join via video call. All sessions are completely free, confidential, and conducted by certified professionals.' },
              ].map((step) => (
                <div key={step.n} className="flex flex-col items-center px-2 relative text-center">
                  <div className="w-14 h-14 rounded-full bg-navy text-white flex items-center justify-center mb-5 ring-8 ring-surface">
                    <span className="font-display font-bold text-xl">{step.n}</span>
                  </div>
                  <h3 className="font-display font-bold text-ink text-h3 mb-2">{step.title}</h3>
                  <p className="text-ink-2 text-sm leading-relaxed max-w-[240px] mx-auto">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GOVERNMENT LOGOS / PARTNER PORTALS SECTION */}
      <section className="py-8 overflow-hidden">
        <div className="page-container relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-4 w-max animate-scroll-logos"
              style={{ animationPlayState: logosPaused ? 'paused' : 'running' }}
            >
              {[...Array(2)].map((_, dup) => (
                [
                  /* 1. Digital India */
                  <div key={`digital-india-${dup}`} className="shrink-0 w-52 h-24 bg-surface rounded-[16px] border border-line flex items-center justify-center px-4">
                    <img src="/digital-india.png" alt="Digital India" loading="lazy" className="h-14 object-contain" />
                  </div>,

                  /* 2. gov.in */
                  <div key={`gov-in-${dup}`} className="shrink-0 w-52 h-24 bg-surface rounded-[16px] border border-line flex items-center justify-center gap-3 px-5">
                    <div className="w-10 h-10 rounded-full bg-[#0066cc] flex items-center justify-center shrink-0">
                      <span className="text-white font-extrabold text-xl leading-none">@</span>
                    </div>
                    <p className="text-[22px] font-extrabold leading-none tracking-tight">
                      <span className="text-[#0066cc]">gov</span><span className="text-[#FF6600]">.in</span>
                    </p>
                  </div>,

                  /* 3. MeitY */
                  <div key={`meity-${dup}`} className="shrink-0 w-72 h-24 bg-surface rounded-[16px] border border-line flex items-center gap-3 px-5">
                    <div className="shrink-0 flex flex-col items-center">
                      <span className="text-[28px] leading-none">☸</span>
                      <span lang="hi" className="text-[8px] text-ink-2 tracking-widest uppercase mt-0.5">सत्यमेव जयते</span>
                    </div>
                    <div>
                      <p className="text-lg font-extrabold text-[#003087] leading-tight">MeitY</p>
                      <p className="text-[10px] text-ink-2 leading-snug max-w-[170px]">Ministry of Electronics &amp; Information Technology, Government of India</p>
                    </div>
                  </div>,

                  /* 4. myGOV */
                  <div key={`mygov-${dup}`} className="shrink-0 w-52 h-24 bg-surface rounded-[16px] border border-line flex flex-col items-center justify-center px-4">
                    <p className="font-extrabold leading-none" style={{ fontSize: '30px' }}>
                      <span className="text-[#00A651]">my</span><span className="text-[#0057A8]">GOV</span>
                    </p>
                    <p lang="hi" className="text-[#FF6600] font-bold text-sm mt-1">मेरी सरकार</p>
                  </div>,

                  /* 5. National Knowledge Network */
                  <div key={`nkn-${dup}`} className="shrink-0 w-64 h-24 bg-surface rounded-[16px] border border-line flex items-center gap-3 px-5">
                    <div className="shrink-0 flex flex-col gap-1">
                      <div className="flex gap-1">
                        <span className="w-4 h-4 rounded bg-[#0057A8] block"></span>
                        <span className="w-4 h-4 rounded bg-[#0057A8] block opacity-60"></span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-4 h-4 rounded bg-[#00A651] block opacity-60"></span>
                        <span className="w-4 h-4 rounded bg-[#00A651] block"></span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#0057A8] leading-tight uppercase tracking-wide">National</p>
                      <p className="text-sm font-extrabold text-[#0057A8] leading-tight uppercase tracking-wide">Knowledge</p>
                      <p className="text-sm font-extrabold text-[#0057A8] leading-tight uppercase tracking-wide">Network</p>
                    </div>
                  </div>,

                  /* 6. ServicePlus */
                  <div key={`serviceplus-${dup}`} className="shrink-0 w-64 h-24 bg-surface rounded-[16px] border border-line flex items-center gap-3 px-5">
                    <div className="shrink-0 w-10 h-10 rounded-full border-2 border-[#c0392b] flex items-center justify-center">
                      <span className="text-[#c0392b] font-extrabold text-lg leading-none">SP</span>
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-navy leading-tight">ServicePlus</p>
                      <p className="text-[9px] text-ink-2 leading-tight max-w-[150px]">Metadata-based Integrated eService Delivery Framework</p>
                    </div>
                  </div>,
                ]
              ))}
            </div>
          </div>
          <MotionButton
            onClick={() => setLogosPaused((p) => !p)}
            aria-label={logosPaused ? 'Play logo scroll' : 'Pause logo scroll'}
            className="mt-3 w-11 h-11 flex items-center justify-center rounded-full bg-surface border border-line text-navy hover:bg-hover transition-colors duration-150"
          >
            {logosPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </MotionButton>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter
        subtitle="Govt. of India"
        quickLinks={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Counsellors', href: '/counselors' }, { label: 'Contact', href: '/contact' }]}
        services={['Career Counselling', 'Educational Guidance', 'Mental Wellness', 'Youth Guidance', 'Skill Development', 'Family Counselling']}
        showSitemap
      />
    </div>
  );
}
