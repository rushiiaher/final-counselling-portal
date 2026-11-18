import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { Emblem } from './SiteNavbar';

type FooterLink = { label: string; href: string };

/**
 * Shared site footer. Each page passes its own link lists so the footer
 * content on every page stays exactly as it was.
 * Styling follows the new design (landing.jsx → NoticeBand + GovFooter).
 */
export default function SiteFooter({
  subtitle,
  quickLinks,
  services,
  showSitemap = false,
}: {
  subtitle: string;
  quickLinks: FooterLink[];
  services: string[];
  showSitemap?: boolean;
}) {
  const linkCls =
    'inline-flex items-center min-h-[30px] text-white/78 hover:text-white text-[13.5px] transition-colors duration-150 rounded-[6px]';
  const headCls = 'font-display font-bold text-[13.5px] mb-3.5 text-saffron';

  return (
    <>
      {/* Free & confidential notice band */}
      <div className="bg-saffron-tint border-y border-saffron/35">
        <div className="page-container py-5 flex items-center gap-4">
          <span className="w-11 h-11 rounded-[12px] bg-white border border-saffron/35 grid place-items-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-saffron-deep" />
          </span>
          <div>
            <p className="font-display font-bold text-[15px] text-[#7A3E09]">All services are free of cost and confidential.</p>
            <p className="text-[13px] text-[#8A5A2A] mt-0.5">
              The Center never charges any fee for counselling, registration or guidance. Beware of anyone claiming otherwise.
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-navy-deep text-white">
        <div className="h-1 bg-[linear-gradient(90deg,#FF9933_0_33.33%,#fff_33.33%_66.66%,#138808_66.66%_100%)]" aria-hidden />
        <div className="page-container pt-11 pb-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-8 lg:gap-10 mb-9">
            <div>
              <div className="flex items-center gap-3 mb-3.5">
                <Emblem size={40} light />
                <div className="leading-tight">
                  <p className="font-display font-extrabold text-[16px]">District Counselling Center</p>
                  <p className="text-white/70 text-[11.5px] mt-0.5">{subtitle}</p>
                </div>
              </div>
              <p className="text-white/78 text-[13px] leading-relaxed max-w-xs">
                Providing professional counselling and guidance services to empower the youth and families of our district.
              </p>
            </div>

            <div>
              <h4 className={headCls}>Quick Links</h4>
              <ul className="space-y-0.5">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={linkCls}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={headCls}>Our Services</h4>
              <ul className="space-y-0.5">
                {services.map((service) => (
                  <li key={service}>
                    <Link href="/services" className={linkCls}>
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={headCls}>Contact</h4>
              <ul className="space-y-3 text-white/78 text-[13px]">
                <li className="flex items-start gap-2.5"><MapPin className="w-4 h-4 shrink-0 mt-0.5 text-saffron" /> Civil Lines, District HQ – 110001</li>
                <li className="flex items-center gap-2.5"><Phone className="w-4 h-4 shrink-0 text-[#4ADE80]" /> Helpline: 1800-XXX-XXXX</li>
                <li className="flex items-center gap-2.5"><Mail className="w-4 h-4 shrink-0 text-white/60" /> info@dcc.gov.in</li>
                <li className="flex items-center gap-2.5"><Clock className="w-4 h-4 shrink-0 text-white/60" /> Mon–Fri: 9 AM – 5 PM</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/12">
          <div className="page-container py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <p className="text-white/70 text-[12px]">&copy; 2025 District Counselling Center, Government of India. All Rights Reserved.</p>
            <div className="flex gap-5 text-[12px]">
              <Link href="/privacy" className="text-white/70 hover:text-white transition-colors duration-150">Privacy Policy</Link>
              <Link href="/terms" className="text-white/70 hover:text-white transition-colors duration-150">Terms of Use</Link>
              {showSitemap && (
                <a href="#" className="text-white/70 hover:text-white transition-colors duration-150">Sitemap</a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
