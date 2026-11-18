import Link from 'next/link';
import { GraduationCap, Brain, ShieldCheck, LogIn, Smartphone, Monitor, Lock, ArrowRight } from 'lucide-react';

/* "Access your portal" (design: landing.jsx → Portals + PortalCard) */
const ROLES = [
  // Students open the app directly — no sign-in needed to explore
  { id: 'student', icon: GraduationCap, title: 'Student', sub: 'Class 8–12, college & alumni', color: '#0F4C81', device: 'Mobile app · No sign-in needed', DeviceIcon: Smartphone, href: '/student/dashboard', cta: 'Open Student App', CtaIcon: ArrowRight },
  { id: 'counsellor', icon: Brain, title: 'Counsellor', sub: 'Center counselling staff', color: '#B45309', device: 'Dashboard', DeviceIcon: Monitor, href: '/login?portal=counsellor', cta: 'Sign in', CtaIcon: LogIn },
  { id: 'admin', icon: ShieldCheck, title: 'District Admin', sub: 'Administration & monitoring', color: '#067A55', device: 'Dashboard', DeviceIcon: Monitor, href: '/login?portal=admin', cta: 'Sign in', CtaIcon: LogIn },
];

export default function PortalAccess() {
  return (
    <section id="portals" className="section">
      <div className="page-container">
        <div className="text-center mb-8 md:mb-10">
          <span className="eyebrow">Choose your portal</span>
          <h2 className="section-heading mt-2">Access your portal</h2>
          <p className="section-lead mt-4 max-w-[620px] mx-auto">
            Students can open their app right away. Counsellor and admin portals are role-based and access-controlled to keep counselling records confidential.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] max-w-[960px] mx-auto">
          {ROLES.map(({ id, icon: Icon, title, sub, color, device, DeviceIcon, href, cta, CtaIcon }) => (
            <Link
              key={id}
              href={href}
              className="portal-card group flex flex-col bg-surface border border-line rounded-[18px] overflow-hidden shadow-[0_4px_16px_rgb(11_47_107/0.06)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[5px]"
              style={{ ['--role' as string]: color }}
            >
              <span className="block h-[5px]" style={{ background: color }} />
              <span className="flex flex-col gap-3.5 p-[22px] flex-1">
                <span className="w-14 h-14 rounded-[16px] grid place-items-center" style={{ background: color + '16' }}>
                  <Icon className="w-[30px] h-[30px]" style={{ color }} strokeWidth={2} />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-[19px] font-extrabold text-navy-deep">{title}</span>
                  <span className="block text-[13px] text-ink-2 mt-1 leading-snug">{sub}</span>
                </span>
                <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-2">
                  <DeviceIcon className="w-[15px] h-[15px]" /> {device}
                </span>
                <span className="portal-card-btn w-full py-3 rounded-[11px] bg-page text-navy-deep font-bold text-[13.5px] inline-flex items-center justify-center gap-[7px] transition-colors duration-150">
                  {cta} <CtaIcon className="w-[17px] h-[17px]" />
                </span>
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-[12.5px] text-ink-2">
          <Lock className="w-3.5 h-3.5" /> Secure login · Counselling records are confidential and access-controlled.
        </p>
      </div>
    </section>
  );
}
