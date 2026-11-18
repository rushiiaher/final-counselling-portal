import React from "react";
import Link from "next/link";

const assessments = [
  {
    type: "phq9",
    title: "Mental Wellbeing",
    subtitle: "PHQ-9 Screening",
    desc: "Clinically-validated depression & emotional wellbeing screening. Trusted by WHO and health systems worldwide.",
    badge: "Most Popular",
    badgeColor: "tag-green",
    accentBar: "bg-action",
    cardBorder: "",
    titleColor: "text-action",
  },
  {
    type: "gad7",
    title: "Anxiety Check",
    subtitle: "GAD-7 Screening",
    desc: "Assess generalized anxiety levels with this 7-question standardized tool. Widely used in clinical and campus health settings.",
    badge: null,
    badgeColor: "",
    accentBar: "bg-navy",
    cardBorder: "",
    titleColor: "text-navy",
  },
  {
    type: "career",
    title: "Career Readiness",
    subtitle: "Aptitude Assessment",
    desc: "Discover your strengths, interests and career aptitude. Get personalized suggestions aligned with your natural abilities and goals.",
    badge: "New",
    badgeColor: "tag-amber",
    accentBar: "bg-warning",
    cardBorder: "",
    titleColor: "text-warning",
  },
];

export default function AssessmentsDirectoryPage() {
  return (
    <div className="min-h-screen bg-page">

      {/* HERO BANNER */}
      <section className="relative overflow-hidden h-56 md:h-64">
        <img
          src="/muslim.jpg"
          alt="Self Assessments"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative h-full flex items-center">
          <div className="page-container">
            <div className="flex items-center gap-2 text-white/75 text-[13px] mb-3">
              <Link href="/" className="hover:text-white transition-colors duration-150">Home</Link>
              <span>/</span>
              <span className="text-white">Self Assessment</span>
            </div>
            <span className="inline-block text-[13px] font-semibold text-white/90">Free &amp; Anonymous</span>
            <h1 className="font-display text-[26px] md:text-h1 font-bold text-white mt-1 mb-2 leading-tight">
              How Are You <em className="not-italic text-[#BFD3F2]">Really Feeling?</em>
            </h1>
            <p className="text-white/85 text-[0.9375rem] md:text-base max-w-2xl leading-relaxed">
              Clinically-validated assessments in 3–5 minutes. Completely anonymous — no registration required.
            </p>
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR ASSESSMENT */}
      <section className="section">
        <div className="page-container">
          <span className="eyebrow">Take a Test</span>
          <div className="text-left">
            <h2 className="section-heading mt-1 mb-8">
              Choose Your <em className="not-italic text-navy">Assessment</em>
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessments.map((a) => (
              <Link
                key={a.type}
                href={`/assessments/${a.type}`}
                className="group ui-card ui-card-hover overflow-hidden flex flex-col"
              >
                {/* Thin accent bar */}
                <div className={`h-1 w-full ${a.accentBar}`} />

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  {/* Badge */}
                  <div className="mb-4 min-h-[26px]">
                    {a.badge && (
                      <span className={`tag ${a.badgeColor}`}>
                        {a.badge}
                      </span>
                    )}
                  </div>

                  {/* Title block */}
                  <div className="mb-3">
                    <p className={`text-[13px] font-semibold mb-1 ${a.titleColor}`}>{a.subtitle}</p>
                    <h3 className="font-display font-bold text-ink text-xl leading-snug">{a.title}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-ink-2 text-[0.9375rem] leading-relaxed flex-1">{a.desc}</p>

                  <span aria-hidden className="mt-5 inline-flex items-center justify-center w-11 h-11 rounded-full border border-line text-navy group-hover:bg-tint transition-colors duration-150">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Anonymous notice */}
          <div className="mt-8 bg-action-tint border border-[#BBE3CB] rounded-[16px] px-4 py-4 flex items-start gap-3 max-w-2xl mx-auto">
            <svg className="w-5 h-5 text-action shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <p className="text-sm text-[#14532D] leading-relaxed">
              <strong>100% Anonymous.</strong> Responses are never stored with your identity. No login required.{' '}
              This is a self-help tool, not a medical diagnosis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
