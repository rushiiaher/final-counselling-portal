'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteNavbar from '@/components/layout/SiteNavbar';
import MotionCard from '@/components/animations/MotionCard';
import SiteFooter from '@/components/layout/SiteFooter';

const FILTERS = ['All Resources', 'Mental Health', 'Stress & Anxiety', 'Career', 'Trauma & Healing', 'Study Skills', 'Guided Meditations'];

const resources = [
  {
    id: 6,
    type: 'Video',
    typeBg: 'bg-red-50',
    typeText: 'text-red-500',
    thumbBg: 'bg-red-50',
    category: 'Mental Health',
    categoryColor: 'text-ink-2',
    title: 'Healthy vs. Toxic Relationships — Recognizing the Signs',
    desc: 'How to identify unhealthy patterns in friendships, family, and romantic relationships.',
    author: 'Dr. Sameer Malik',
    meta: '4,100 views',
    duration: '12:00',
    filter: 'Mental Health',
    icon: (
      <svg className="w-8 h-8 text-red-200" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="7" />
      </svg>
    ),
  },
  {
    id: 2,
    type: 'Article',
    typeBg: 'bg-emerald-50',
    typeText: 'text-emerald-600',
    thumbBg: 'bg-emerald-100',
    category: 'Trauma & Healing',
    categoryColor: 'text-ink-2',
    title: 'Understanding PTSD: A Guide for J&K Students',
    desc: 'What conflict-related trauma looks like, and why seeking help is a sign of strength, not weakness.',
    author: 'Mental Health Team',
    meta: '8 min read',
    duration: null,
    filter: 'Trauma & Healing',
    icon: (
      <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id: 3,
    type: 'Guide',
    typeBg: 'bg-yellow-50',
    typeText: 'text-yellow-700',
    thumbBg: 'bg-yellow-50',
    category: 'Career',
    categoryColor: 'text-ink-2',
    title: 'Career Paths After Class 12 in J&K — Complete Guide',
    desc: 'Engineering, medicine, law, arts, civil services — a complete breakdown of every option available.',
    author: 'Career Team',
    meta: '15 min read',
    duration: null,
    filter: 'Career',
    icon: (
      <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    id: 4,
    type: 'Meditation',
    typeBg: 'bg-purple-50',
    typeText: 'text-purple-600',
    thumbBg: 'bg-purple-100',
    category: 'Guided Meditation',
    categoryColor: 'text-ink-2',
    title: '10-Minute Guided Meditation for Anxiety Relief',
    desc: 'A calming audio meditation in Urdu and English, designed for students experiencing persistent worry.',
    author: 'Wellness Team',
    meta: '1,890 listens',
    duration: '10:00',
    filter: 'Guided Meditations',
    icon: (
      <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 5,
    type: 'Article',
    typeBg: 'bg-emerald-50',
    typeText: 'text-emerald-600',
    thumbBg: 'bg-blue-50',
    category: 'Study Skills',
    categoryColor: 'text-ink-2',
    title: 'How to Build Effective Study Habits in 7 Days',
    desc: 'Science-backed study techniques that work even when you\'re struggling emotionally or mentally.',
    author: 'Dr. Nighat Bhat',
    meta: '6 min read',
    duration: null,
    filter: 'Study Skills',
    icon: (
      <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
      </svg>
    ),
  },
  {
    id: 1,
    type: 'Video',
    typeBg: 'bg-blue-50',
    typeText: 'text-blue-600',
    thumbBg: 'bg-blue-100',
    category: 'Stress & Anxiety',
    categoryColor: 'text-ink-2',
    title: '5-Minute Breathing Technique for Exam Stress',
    desc: 'A simple box-breathing exercise proven to reduce exam anxiety in under 5 minutes.',
    author: 'Dr. Aamir Wani',
    meta: '3,200 views',
    duration: '8:45',
    filter: 'Stress & Anxiety',
    icon: (
      <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function WellnessHubPage() {
  const [activeFilter, setActiveFilter] = useState('All Resources');

  const filtered = activeFilter === 'All Resources'
    ? resources
    : resources.filter((r) => r.filter === activeFilter);

  return (
    <div className="min-h-screen bg-page">
      <SiteNavbar />

      {/* HERO BANNER */}
      <section className="relative overflow-hidden h-56 md:h-64">
        <img
          src="/well.jpg"
          alt="Wellness Hub"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative h-full flex items-center">
          <div className="page-container">
            <div className="flex items-center gap-2 text-white/75 text-[13px] mb-3">
              <Link href="/" className="hover:text-white transition-colors duration-150">Home</Link>
              <span>/</span>
              <span className="text-white">Wellness Hub</span>
            </div>
            <h1 className="font-display text-[26px] md:text-h1 font-bold text-white mb-2 leading-tight">Wellness Hub — <em className="not-italic text-[#BFD3F2]">Learn &amp; Grow</em></h1>
            <p className="text-white/85 text-[0.9375rem] md:text-base max-w-2xl leading-relaxed">
              Articles, videos, exercises and guides for mental health, career and personal growth.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER PILLS */}
      <section className="bg-surface border-b border-line">
        <div className="page-container py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap" role="group">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                aria-pressed={activeFilter === f}
                className="chip shrink-0 min-h-[44px]"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCE GRID */}
      <section className="section pt-8 md:pt-10">
        <div className="page-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => (
              <MotionCard
                key={r.id}
                className="group ui-card ui-card-hover overflow-hidden flex flex-col cursor-pointer h-full"
              >
                {/* Thumbnail */}
                <div className={`relative ${r.thumbBg} aspect-[16/9] flex items-center justify-center overflow-hidden`}>
                  {r.id === 1 ? (
                    <img src="/stress.png" alt={r.title} loading="lazy" className="w-full h-full object-cover object-[30%]" />
                  ) : r.id === 2 ? (
                    <img src="/trauma.png" alt={r.title} loading="lazy" className="w-full h-full object-cover object-[30%]" />
                  ) : r.id === 3 ? (
                    <img src="/career1.png" alt={r.title} loading="lazy" className="w-full h-full object-cover object-[30%]" />
                  ) : r.id === 4 ? (
                    <img src="/meditation.png" alt={r.title} loading="lazy" className="w-full h-full object-cover object-center" />
                  ) : r.id === 5 ? (
                    <img src="/study.png" alt={r.title} loading="lazy" className="w-full h-full object-cover object-center" />
                  ) : (
                    <img src="/mental health.png" alt={r.title} loading="lazy" className="w-full h-full object-cover object-[30%]" />
                  )}
                  {r.duration && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-ink/80 text-white text-[12px] font-semibold px-2 py-0.5">
                      {r.duration}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="tag">{r.type}</span>
                    <span className="text-[13px] font-medium text-ink-2">
                      {r.category}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-ink text-base leading-snug group-hover:text-navy transition-colors duration-150">
                    {r.title}
                  </h3>
                  <p className="text-ink-2 text-sm leading-relaxed">{r.desc}</p>
                  <p className="text-[13px] text-ink-2 mt-auto pt-2 border-t border-line flex items-center gap-2">
                    <span>{r.author}</span>
                    <span aria-hidden className="w-1 h-1 rounded-full bg-ink-2/50" />
                    <span>{r.meta}</span>
                  </p>
                </div>
              </MotionCard>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="ui-card text-center py-16 px-6 text-ink-2 text-[0.9375rem]">
              No resources found for this category.
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter
        subtitle="Govt. of India"
        quickLinks={[{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about' }, { label: 'Services', href: '/services' }, { label: 'Counsellors', href: '/counselors' }, { label: 'Contact', href: '/contact' }]}
        services={['Career Counselling', 'Educational Guidance', 'Mental Wellness', 'Youth Guidance', 'Skill Development', 'Family Counselling']}
        showSitemap
      />
    </div>
  );
}
