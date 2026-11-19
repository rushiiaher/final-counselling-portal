import Link from 'next/link';
import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';
import MotionButton from '@/components/animations/MotionButton';
import { Users, Landmark, Target, AlertTriangle, Globe, BookOpen, Handshake, UserCheck, Network } from 'lucide-react';

const keyIssues = [
  { text: 'No central platform for all students', icon: <AlertTriangle className="w-5 h-5" /> },
  { text: 'Limited access to counselling and guidance', icon: <Users className="w-5 h-5" /> },
  { text: 'Lack of communication between institutions and administration', icon: <Network className="w-5 h-5" /> },
  { text: 'Students missing opportunities due to lack of information', icon: <BookOpen className="w-5 h-5" /> },
  { text: 'No structured system to track student participation and issues', icon: <Target className="w-5 h-5" /> },
  { text: 'Alumni not connected with current students', icon: <Handshake className="w-5 h-5" /> },
];


const targetUsers = [
  { label: 'All students in these institutions', desc: 'Students across all 78 Higher Secondary Schools and 10 Colleges in the district', icon: <Users className="w-6 h-6" /> },
  { label: 'Alumni', desc: 'Former students who can mentor, guide, and stay connected with current students', icon: <UserCheck className="w-6 h-6" /> },
  { label: 'District Administration & Counselling Center', desc: 'Officials and counsellors managing student welfare, guidance, and development programs', icon: <Landmark className="w-6 h-6" /> },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-page">
      <SiteNavbar />

      {/* HERO BANNER */}
      <section className="relative overflow-hidden h-56 md:h-64">
        <img
          src="/about.webp"
          alt="About Us"
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="absolute inset-0 flex items-center">
          <div className="page-container">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/80 text-[13px] mb-3">
              <Link href="/" className="hover:text-white underline-offset-4 hover:underline transition-colors duration-150">Home</Link>
              <span aria-hidden>/</span>
              <span className="text-white font-medium">About Us</span>
            </nav>
            <h1 className="font-display text-[28px] md:text-h1 font-bold text-white mb-2">About <em className="not-italic">Us</em></h1>
            <p className="text-white/85 text-[0.9375rem] md:text-base max-w-2xl leading-relaxed">
              Empowering students, connecting institutions, and building a brighter future for the youth of Anantnag.
            </p>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="section">
        <div className="page-container">
          <div className="max-w-[720px] mx-auto">
            <span className="eyebrow">Who We Are</span>
            <div className="text-left">
              <h2 className="section-heading mt-1 mb-5">Introduction</h2>
            </div>

            <div className="space-y-4">
              <p className="text-ink text-body leading-relaxed">
                Under the District Administration of Anantnag, we have established a <strong className="text-navy">Counselling and Youth Development Center</strong> to support students in areas such as mental well-being, career guidance, and overall development.
              </p>
              <p className="text-ink text-body leading-relaxed">
                As part of this initiative, we have built the <strong className="text-navy">District Student & Youth Digital Portal</strong> — this very platform you are using right now. It serves as a common digital platform connecting all Higher Secondary Schools, Colleges, students, and the District Administration under one roof.
              </p>
              <p className="text-ink text-body leading-relaxed">
                Through this portal, students can access free counselling services, explore career guidance, book appointments, and connect with qualified counsellors — all from the comfort of their homes.
              </p>
            </div>

            <div className="ui-card p-6 mt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-tint rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-navy" />
                </div>
                <h3 className="font-display font-bold text-ink text-h3">Our Vision</h3>
              </div>
              <p className="text-ink-2 text-[0.9375rem] leading-relaxed">
                To create a single digital platform that connects students, institutions, and administration for learning, interaction, counselling, and overall development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEED FOR THE PORTAL */}
      <section className="section bg-surface border-y border-line">
        <div className="page-container">
          <div className="max-w-[720px] mx-auto">
            <span className="eyebrow">Why This Portal</span>
            <div className="text-left">
              <h2 className="section-heading mt-1 mb-5">Need For The <em className="not-italic text-navy">Portal</em></h2>
            </div>

            <p className="text-ink text-body leading-relaxed mb-4">
              At present, there is no single system where all students and institutions are connected. Schools and colleges work separately, and students often do not know where to go for help, guidance, or opportunities.
            </p>
            <p className="text-ink-2 text-[0.9375rem] leading-relaxed mb-8">
              Because of this, many students are not able to get the right support at the right time. Some key issues observed are:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[960px] mx-auto">
            {keyIssues.map((issue) => (
              <div key={issue.text} className="rounded-[16px] bg-page border border-line p-5 flex items-start gap-3 h-full">
                <div className="w-10 h-10 rounded-full bg-warning-tint text-warning flex items-center justify-center shrink-0">
                  {issue.icon}
                </div>
                <p className="text-ink text-sm leading-relaxed font-medium pt-2">{issue.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PURPOSE */}
      <section className="section">
        <div className="page-container max-w-[720px] text-center">
          <span className="eyebrow">Our Mission</span>
          <div className="flex justify-center">
            <h2 className="section-heading mt-1 mb-6">Purpose Of The <em className="not-italic text-navy">Portal</em></h2>
          </div>

          <div className="ui-card p-6 sm:p-10">
            <div className="w-14 h-14 bg-tint rounded-full flex items-center justify-center mx-auto mb-5">
              <Target className="w-7 h-7 text-navy" />
            </div>
            <p className="font-display text-ink text-lg sm:text-xl font-semibold leading-relaxed">
              To create a single digital platform that connects students, institutions, and administration for learning, interaction, counselling, and overall development.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['Learning', 'Interaction', 'Counselling', 'Development'].map((tag) => (
                <span key={tag} className="tag px-4 py-1.5 text-[13px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TARGET USERS */}
      <section className="section bg-surface border-y border-line">
        <div className="page-container max-w-[960px]">
          <div>
            <span className="eyebrow">Who Benefits</span>
            <div className="text-left">
              <h2 className="section-heading mt-1 mb-6">Target <em className="not-italic text-navy">Users</em></h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {targetUsers.map((user) => (
              <div key={user.label} className="rounded-[16px] bg-page border border-line p-6 h-full">
                <div className="w-12 h-12 bg-tint text-navy rounded-full flex items-center justify-center mb-4">
                  {user.icon}
                </div>
                <h3 className="font-display font-bold text-ink text-base mb-2">{user.label}</h3>
                <p className="text-ink-2 text-sm leading-relaxed">{user.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="page-container max-w-[720px] text-center">
          <div className="flex justify-center">
            <h2 className="section-heading mb-3">Be Part Of The <em className="not-italic text-navy">Change</em></h2>
          </div>
          <p className="section-lead mb-8">
            Join us in building a connected, supportive ecosystem for the youth of Anantnag. Whether you are a student, parent, teacher, or alumni — this portal is for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <MotionButton
              href="/services"
              className="btn btn-primary w-full sm:w-auto sm:px-8"
            >
              Explore Our Services
            </MotionButton>
            <MotionButton
              href="/contact"
              className="btn btn-outline w-full sm:w-auto sm:px-8"
            >
              Get In Touch
            </MotionButton>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter
        subtitle="Anantnag, J&K"
        quickLinks={[{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about' }, { label: 'Services', href: '/services' }, { label: 'Counsellors', href: '/counselors' }, { label: 'Contact', href: '/contact' }]}
        services={['Career Counselling', 'Educational Guidance', 'Mental Wellness', 'Youth Guidance', 'Family Counselling']}
      />
    </div>
  );
}
