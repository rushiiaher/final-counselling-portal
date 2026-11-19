'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';
import { useBookSession } from '@/lib/booking';
import MotionButton from '@/components/animations/MotionButton';
import { ArrowRight, CalendarDays } from 'lucide-react';

const services = [
  {
    title: 'Career Counselling',
    img: '/career.png',
    detailImg: '/career.png',
    heading: 'Complete Solution For Career Growth & Professional Development',
    para1: 'Our Career Counselling service is a comprehensive, evidence-based program designed to help students, graduates, and working professionals make informed and confident career decisions. We understand that choosing the right career path is one of the most important decisions in a person\'s life, and our certified career counsellors are here to guide you every step of the way.',
    para2: 'We use scientifically validated tools such as <strong>Holland\'s Career Interest Inventory</strong>, <strong>MBTI Personality Assessment</strong>, and <strong>Multiple Intelligence Tests</strong> to map your strengths, interests, and aptitudes to the most suitable career options. Our counsellors then work with you to build a personalised career roadmap.',
    para3: 'Our expertise covers over 500+ career options across engineering, medicine, law, arts, commerce, government services, entrepreneurship, and emerging fields like AI, data science, and digital marketing. Whether you are a Class 10 student choosing a stream or a professional looking to switch careers, we have the right guidance for you.',
    highlights: [
      'Scientifically validated aptitude & interest assessments',
      'One-on-one personalised career counselling sessions',
      'Guidance on 500+ career options across all fields',
      'Entrance exam strategy (JEE, NEET, UPSC, CAT, CLAT)',
      'Resume building & interview preparation support',
      'Industry exposure, internship & placement guidance',
    ],
    audience: 'Students (Class 8–12), College Students, Working Professionals',
    duration: '60–90 minutes per session',
    sessions: '3–5 sessions recommended',
  },
  {
    title: 'Educational Guidance',
    img: '/education.png',
    detailImg: '/education.png',
    heading: 'Complete Solution For Academic Excellence & Higher Education',
    para1: 'Educational Guidance services are designed to help students navigate the complex landscape of academic choices and challenges. From selecting the right subjects in school to choosing the best college and course for higher education, our educational counsellors provide evidence-based guidance tailored to each student\'s unique profile.',
    para2: 'We address a wide range of academic concerns including <strong>subject and stream selection</strong>, <strong>study skills coaching</strong>, <strong>learning disability assessment</strong>, and <strong>higher education planning</strong>. Our counsellors work closely with students and parents to create a structured academic plan.',
    para3: 'We also provide guidance on studying abroad, including university selection, application strategy, SOP writing, and visa support. Our counsellors have helped hundreds of students secure admissions in top universities across India and internationally.',
    highlights: [
      'Subject & stream selection guidance (Class 9–12)',
      'College & university selection support',
      'Entrance exam preparation strategies',
      'Study skills & time management coaching',
      'Learning disability assessment & support',
      'Abroad education guidance & visa support',
    ],
    audience: 'School Students (Class 6–12), College Students, Parents',
    duration: '45–60 minutes per session',
    sessions: '2–4 sessions recommended',
  },
  {
    title: 'Mental Wellness',
    img: '/wellness.png',
    detailImg: '/wellness.png',
    heading: 'Complete Solution For Psychological Well-being & Mental Health',
    para1: 'Our Mental Wellness program offers a safe, confidential, and non-judgmental space for individuals to address mental health challenges. Our licensed clinical psychologists and counsellors use evidence-based therapeutic approaches to help you achieve emotional balance and lasting mental well-being.',
    para2: 'We focus on a range of therapeutic approaches, each tailored to the specific requirements of our clients. Our team utilises advanced approaches such as <strong>Cognitive Behavioral Therapy (CBT)</strong>, <strong>Mindfulness-Based Stress Reduction (MBSR)</strong>, <strong>Solution-Focused Brief Therapy (SFBT)</strong>, and Acceptance & Commitment Therapy (ACT) to ensure each individual receives a comprehensive, personalised treatment plan.',
    para3: 'Our expertise extends to treating common issues such as stress, burnout, and relationship difficulties, as well as more complex conditions like anxiety disorders, depression, bipolar disorder, OCD, PTSD, and emotional regulation challenges. We also offer group therapy and peer support programs.',
    highlights: [
      'Confidential individual therapy sessions',
      'Anxiety & depression management',
      'Stress, burnout & trauma counselling',
      'CBT, MBSR, SFBT & ACT therapeutic approaches',
      'Mindfulness & relaxation techniques',
      'Group therapy & peer support groups',
      'Crisis intervention & emergency support',
    ],
    audience: 'All Age Groups (10 years and above)',
    duration: '50–60 minutes per session',
    sessions: 'Ongoing as per clinical assessment',
  },
  {
    title: 'Youth Guidance',
    img: '/youth.png',
    detailImg: '/youth.png',
    heading: 'Complete Solution For Youth Development & Life Skills',
    para1: 'The Youth Guidance program is specifically designed for young people aged 13–25 who are navigating the challenges of adolescence and early adulthood. Our youth counsellors provide a supportive environment to address issues related to identity, peer pressure, relationships, and life skills development.',
    para2: 'We address critical youth issues including <strong>identity and self-esteem development</strong>, <strong>peer pressure and bullying</strong>, <strong>substance abuse prevention</strong>, and <strong>digital wellness</strong>. Our programs are interactive, engaging, and designed to resonate with today\'s youth.',
    para3: 'Our leadership development workshops and life skills programs equip young people with the tools they need to make positive decisions, build healthy relationships, and navigate life transitions with confidence and resilience.',
    highlights: [
      'Adolescent development & identity counselling',
      'Peer pressure & bullying intervention',
      'Substance abuse prevention programs',
      'Life skills & decision-making workshops',
      'Leadership development programs',
      'Online safety & digital wellness guidance',
      'Positive youth development activities',
    ],
    audience: 'Youth aged 13–25 years',
    duration: '45–60 minutes per session',
    sessions: '4–6 sessions recommended',
  },
  {
    title: 'Skill Development',
    img: '/skill.png',
    imgClass: 'object-fill',
    detailImg: '/skill.png',
    detailImgPos: 'object-top',
    heading: 'Complete Solution For Vocational Training & Employment Readiness',
    para1: 'Our Skill Development Counselling service bridges the gap between education and employment by helping individuals identify their vocational strengths and connect them with appropriate skill development opportunities. We work in close collaboration with the Skill India Mission and NSDC.',
    para2: 'We provide guidance on <strong>government skill development schemes</strong>, <strong>ITI and polytechnic courses</strong>, <strong>PMKVY enrollment</strong>, and <strong>entrepreneurship development</strong>. Our counsellors help you identify the right vocational path based on your aptitude and market demand.',
    para3: 'Our job placement assistance, career fairs, and self-employment guidance programs have helped hundreds of youth secure meaningful employment and start their own ventures. We also provide support for those looking to upskill or reskill for better career opportunities.',
    highlights: [
      'Vocational aptitude & interest assessment',
      'Government skill development scheme guidance',
      'ITI, polytechnic & vocational course support',
      'PMKVY & other scheme enrollment assistance',
      'Entrepreneurship development counselling',
      'Job placement assistance & career fairs',
      'Self-employment & startup guidance',
    ],
    audience: 'Youth (16–35 years), School Dropouts, Unemployed Youth',
    duration: '60 minutes per session',
    sessions: '3–5 sessions recommended',
  },
  {
    title: 'Family Counselling',
    img: '/family.png',
    imgClass: 'object-cover object-[30%]',
    detailImg: '/family.png',
    detailImgPos: 'object-top',
    heading: 'Complete Solution For Family Harmony & Relationship Wellness',
    para1: 'Family Counselling services focus on improving family dynamics, communication patterns, and relationships. Our family therapists work with the entire family unit to identify and resolve conflicts, improve understanding, and build a healthier, more supportive home environment.',
    para2: 'We address issues ranging from <strong>parent-child conflicts</strong> to <strong>marital challenges</strong>, <strong>blended family adjustments</strong>, and <strong>elder care concerns</strong>. Our therapists use Emotionally Focused Therapy (EFT), Narrative Therapy, and Structural Family Therapy to bring lasting positive change.',
    para3: 'Our parenting skills workshops and communication improvement programs have helped thousands of families build stronger bonds, resolve long-standing conflicts, and create a nurturing environment for children to thrive.',
    highlights: [
      'Family communication improvement workshops',
      'Parent-child relationship counselling',
      'Marital & couples counselling',
      'Conflict resolution & mediation',
      'Parenting skills development programs',
      'Blended family & divorce adjustment support',
      'Elder care & intergenerational conflict resolution',
    ],
    audience: 'Families, Couples, Parents, Children',
    duration: '60–90 minutes per session',
    sessions: '5–8 sessions recommended',
  },
  {
    title: 'Personal Counselling',
    img: '/personal.png',
    imgClass: 'object-cover object-[30%]',
    detailImg: '/personal.png',
    detailImgPos: 'object-center',
    heading: 'Complete Solution For Personal Growth & Emotional Well-being',
    para1: 'Personal Counselling provides individualized support for a wide range of personal challenges that affect daily functioning and quality of life. Whether you are dealing with low self-esteem, relationship difficulties, grief, life transitions, or simply feeling stuck, our counsellors offer a compassionate and professional space.',
    para2: 'Our counsellors are trained in <strong>Person-Centered Therapy</strong>, <strong>Cognitive Behavioral Therapy (CBT)</strong>, <strong>Motivational Interviewing</strong>, and <strong>Narrative Therapy</strong> to help you explore your concerns, understand your patterns, and develop effective coping strategies tailored to your unique situation.',
    para3: 'We help individuals build self-awareness, develop emotional resilience, set meaningful goals, and create a life aligned with their values. Our sessions are completely confidential, non-judgmental, and focused entirely on your well-being and growth.',
    highlights: [
      'Self-esteem & confidence building',
      'Grief, loss & bereavement counselling',
      'Relationship & interpersonal skills',
      'Life transitions & adjustment support',
      'Goal setting & motivation coaching',
      'Anger management & emotional regulation',
      'Personal development & self-discovery',
    ],
    audience: 'All Adults (18 years and above)',
    duration: '50–60 minutes per session',
    sessions: 'As per individual need',
  },
  {
    title: 'Crisis Support',
    img: '/crisis.png',
    detailImg: '/crisis.png',
    heading: 'Complete Solution For Crisis Intervention & Emergency Mental Health',
    para1: 'Our Crisis Support service provides immediate, compassionate, and professional intervention for individuals experiencing acute mental health crises, emotional breakdowns, or situations of immediate risk. Our trained crisis counsellors are available to provide rapid response and stabilisation.',
    para2: 'We are equipped to handle a wide range of crisis situations including <strong>suicidal ideation</strong>, <strong>acute anxiety and panic attacks</strong>, <strong>trauma and PTSD episodes</strong>, <strong>domestic violence situations</strong>, and <strong>substance abuse crises</strong>. Our team follows evidence-based crisis intervention protocols to ensure safety and stabilisation.',
    para3: 'Following immediate crisis intervention, we provide a structured follow-up care plan including ongoing therapy, referrals to psychiatric services if needed, and connection to community support resources. Our goal is not just to manage the crisis but to help individuals build long-term resilience.',
    highlights: [
      'Immediate crisis assessment & intervention',
      'Suicidal ideation & self-harm support',
      'Trauma & PTSD crisis management',
      'Domestic violence & abuse support',
      'Substance abuse crisis intervention',
      'Psychiatric referral & coordination',
      'Follow-up care & safety planning',
    ],
    audience: 'All individuals in acute distress (any age)',
    duration: 'As needed — immediate response',
    sessions: 'Ongoing follow-up care provided',
  },
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const bookSession = useBookSession();

  const handleServiceClick = (title: string) => {
    if (activeService === title) {
      setActiveService(null);
    } else {
      setActiveService(title);
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const selected = services.find((s) => s.title === activeService);

  return (
    <div className="min-h-screen bg-page">
      <SiteNavbar />

      {/* HERO BANNER */}
      <section className="relative overflow-hidden h-56 md:h-64">
        <img
          src="/home.jpg"
          alt="Counselling Services"
          className="absolute inset-0 w-full h-full object-cover object-top"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="absolute inset-0 flex items-center">
          <div className="page-container">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[13px] mb-3">
              <Link href="/" className="hover:text-white underline-offset-4 hover:underline transition-colors duration-150">Home</Link>
              <span aria-hidden>/</span>
              <span className="text-white font-medium">Services</span>
            </nav>
            <h1 className="font-display text-[28px] md:text-h1 font-bold text-white mb-2">Our Counselling <em className="not-italic">Services</em></h1>
            <p className="text-white/85 text-[0.9375rem] md:text-base max-w-2xl leading-relaxed">
              Comprehensive, free, and professional counselling services designed to support every individual at every stage of life.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="section">
        <div className="page-container">
          <div className="mb-8 max-w-3xl">
            <span className="eyebrow">Our Services</span>
            <h2 className="section-heading mt-1 mb-2">Counselling Services <em className="not-italic text-navy">We Offer</em></h2>
            <p className="section-lead">
              We offer a team of the most trusted and experienced psychologists, best therapists, certified counsellors, and mental health professionals to take care of your mind and well-being. Click on any service below to learn more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const isActive = activeService === service.title;
              return (
                <button
                  type="button"
                  key={service.title}
                  onClick={() => handleServiceClick(service.title)}
                  aria-expanded={isActive}
                  className={`ui-card ui-card-hover group text-left overflow-hidden flex flex-col ${isActive ? '!border-navy ring-2 ring-navy/20' : ''}`}
                >
                  {/* Image */}
                  <div className="h-44 sm:h-48 bg-tint overflow-hidden">
                    <img
                      src={service.img}
                      alt={service.title}
                      loading="lazy"
                      className={`w-full h-full ${'imgClass' in service ? (service as any).imgClass : 'object-cover'}`}
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display text-ink font-bold text-h3 mb-1.5">{service.title}</h3>
                    <p className="text-ink-2 text-sm leading-relaxed mb-4 flex-1">{service.highlights[0]}</p>
                    <span className="inline-flex items-center gap-1 text-navy text-sm font-semibold group-hover:underline underline-offset-4">
                      Click to Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICE DETAIL PANEL — shown on click */}
      {selected && (
        <section ref={detailRef} className="pb-12 md:pb-16 scroll-mt-20">
          <div className="page-container">
            <div className="ui-card p-5 sm:p-8">
              {/* Close button */}
              <div className="flex justify-between items-start gap-4 mb-6 pb-6 border-b border-line">
                <h2 className="font-display text-h2 md:text-[28px] font-bold text-ink leading-snug">{selected.heading}</h2>
                <MotionButton
                  onClick={() => setActiveService(null)}
                  className="btn btn-ghost btn-sm shrink-0 border border-line"
                >
                  ✕ Close
                </MotionButton>
              </div>

              {/* Main content — left text, right image */}
              <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-10 items-start">
                {/* LEFT — text */}
                <div className="order-2 lg:order-1">
                  <p className="text-ink leading-relaxed mb-4 text-[15px]">{selected.para1}</p>
                  <p
                    className="text-ink leading-relaxed mb-4 text-[15px]"
                    dangerouslySetInnerHTML={{ __html: selected.para2 }}
                  />
                  <p className="text-ink leading-relaxed mb-8 text-[15px]">{selected.para3}</p>

                  {/* Key highlights */}
                  <h3 className="font-display text-h3 font-bold text-ink mb-3">Key Highlights</h3>
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-8">
                    {selected.highlights.map((h) => (
                      <div key={h} className="flex items-start gap-2 text-sm text-ink">
                        <span className="w-5 h-5 bg-action-tint text-action rounded-full flex items-center justify-center shrink-0 mt-px text-xs font-bold">✓</span>
                        {h}
                      </div>
                    ))}
                  </section>

                  {/* Meta info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    <div className="bg-page border border-line rounded-[12px] px-4 py-3 text-sm">
                      <p className="text-ink-2 text-[13px] font-medium mb-0.5">For</p>
                      <p className="text-ink font-semibold">{selected.audience}</p>
                    </div>
                    <div className="bg-page border border-line rounded-[12px] px-4 py-3 text-sm">
                      <p className="text-ink-2 text-[13px] font-medium mb-0.5">Duration</p>
                      <p className="text-ink font-semibold">{selected.duration}</p>
                    </div>
                    <div className="bg-page border border-line rounded-[12px] px-4 py-3 text-sm">
                      <p className="text-ink-2 text-[13px] font-medium mb-0.5">Sessions</p>
                      <p className="text-ink font-semibold">{selected.sessions}</p>
                    </div>
                  </div>

                  <MotionButton
                    onClick={() => bookSession()}
                    className="btn btn-action w-full sm:w-auto sm:px-8"
                  >
                    <CalendarDays className="w-4 h-4" /> Book Free Appointment
                  </MotionButton>
                </div>

                {/* RIGHT — image */}
                <div className="order-1 lg:order-2 rounded-[16px] overflow-hidden border border-line bg-tint w-full">
                  <img
                    src={selected.detailImg}
                    alt={selected.title}
                    className={`w-full h-56 sm:h-64 lg:h-80 object-cover ${'detailImgPos' in selected ? (selected as any).detailImgPos : 'object-center'}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="section bg-surface border-t border-line">
        <div className="page-container max-w-3xl text-center">
          <h2 className="section-heading mb-3">Ready to Take <em className="not-italic text-navy">the First Step?</em></h2>
          <p className="section-lead mb-8">
            All our services are completely free for district residents. Book your appointment today and take the first step towards a better tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MotionButton onClick={() => bookSession()} className="btn btn-action sm:px-8">
              <CalendarDays className="w-4 h-4" /> Book Free Appointment
            </MotionButton>
            <MotionButton href="/counselors" className="btn btn-outline sm:px-8">
              Meet Our Counsellors →
            </MotionButton>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter
        subtitle="Govt. of India"
        quickLinks={[{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about' }, { label: 'Services', href: '/services' }, { label: 'Counsellors', href: '/counselors' }, { label: 'Contact', href: '/contact' }]}
        services={services.map((s) => s.title)}
        showSitemap
      />
    </div>
  );
}
