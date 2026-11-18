'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteNavbar from '@/components/layout/SiteNavbar';
import SiteFooter from '@/components/layout/SiteFooter';
import { useRouter } from 'next/navigation';
import MotionCard from '@/components/animations/MotionCard';
import MotionButton from '@/components/animations/MotionButton';
import { Languages, CalendarDays, Search } from 'lucide-react';

type Counsellor = {
  id: number;
  name: string;
  qualification: string;
  experience: number;
  specializations: string[];
  rating: number;
  reviews: number;
  languages: string[];
  availability: string;
  bio: string;
};

const counsellors: Counsellor[] = [
  { id: 1, name: 'Dr. Aamir Wani', qualification: 'Ph.D. Psychology', experience: 15, specializations: ['Career Counselling', 'Mental Wellness', 'Anxiety'], rating: 5, reviews: 128, languages: ['Kashmiri', 'Urdu', 'English'], availability: 'Mon–Fri', bio: 'Dr. Aamir Wani is a senior psychologist with 15 years of experience in career counselling and mental wellness. He has guided over 2,000 students across Srinagar in making informed career decisions.' },
  { id: 2, name: 'Mr. Tariq Ahmed Lone', qualification: 'M.A. Counselling Psychology', experience: 10, specializations: ['Youth Guidance', 'Family Counselling', 'Peer Pressure'], rating: 5, reviews: 94, languages: ['Kashmiri', 'Urdu', 'English'], availability: 'Mon–Sat', bio: 'Mr. Tariq Ahmed Lone specializes in youth development and family counselling. His community-based approach has helped hundreds of families in Baramulla strengthen their bonds.' },
  { id: 3, name: 'Dr. Nighat Bhat', qualification: 'Ph.D. Educational Psychology', experience: 18, specializations: ['Educational Guidance', 'Learning Disabilities', 'Academic Stress'], rating: 5, reviews: 156, languages: ['Kashmiri', 'Urdu', 'English'], availability: 'Mon–Fri', bio: 'Dr. Nighat Bhat is an expert in educational psychology with 18 years of experience. She has helped thousands of students in Anantnag overcome academic challenges and achieve their educational goals.' },
  { id: 4, name: 'Ms. Iqra Mir', qualification: 'M.Sc. Clinical Psychology', experience: 8, specializations: ['Personal Counselling', 'Grief Counselling', 'Self-Esteem'], rating: 4, reviews: 72, languages: ['Kashmiri', 'Urdu', 'English'], availability: 'Tue–Sat', bio: 'Ms. Iqra Mir is a compassionate counsellor specializing in personal development and grief counselling. She creates a safe, non-judgmental space for her clients in Budgam.' },
  { id: 5, name: 'Dr. Mudasir Khan', qualification: 'Ph.D. Counselling', experience: 20, specializations: ['Career Counselling', 'Skill Development', 'Entrepreneurship'], rating: 5, reviews: 203, languages: ['Kashmiri', 'Urdu', 'English'], availability: 'Mon–Fri', bio: 'Dr. Mudasir Khan is the Head of Career Guidance with 20 years of experience. He has helped over 5,000 youth in Pulwama find their career path and develop entrepreneurial skills.' },
  { id: 6, name: 'Ms. Sana Malik', qualification: 'M.A. Psychology, B.Ed.', experience: 12, specializations: ['Educational Guidance', 'Career Counselling', 'Study Skills'], rating: 4, reviews: 88, languages: ['Kashmiri', 'Urdu', 'English'], availability: 'Mon–Sat', bio: 'Ms. Sana Malik combines her psychology and education background to provide holistic guidance to students. She is known for her practical and student-friendly approach in Kupwara.' },
  { id: 7, name: 'Dr. Imran Dar', qualification: 'Ph.D. Clinical Psychology', experience: 14, specializations: ['Mental Wellness', 'Trauma Counselling', 'Stress Management'], rating: 5, reviews: 117, languages: ['Dogri', 'Hindi', 'Urdu', 'English'], availability: 'Mon–Fri', bio: 'Dr. Imran Dar is a clinical psychologist specializing in trauma-informed care and stress management. He uses evidence-based CBT and mindfulness techniques with clients across Jammu.' },
  { id: 8, name: 'Ms. Farida Sheikh', qualification: 'M.Sc. Psychology, RCI Certified', experience: 9, specializations: ['Family Counselling', 'Personal Counselling', 'Women Empowerment'], rating: 4, reviews: 65, languages: ['Dogri', 'Hindi', 'English'], availability: 'Mon–Sat', bio: 'Ms. Farida Sheikh is an RCI-certified counsellor with a focus on family therapy and women empowerment. She runs special programs for women and girls in Kathua district.' },
];

const allSpecializations = Array.from(new Set(counsellors.flatMap((c) => c.specializations))).sort();

export default function CounsellorsPage() {
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const router = useRouter();

  const filtered = counsellors.filter((c) => {
    const matchesSearch = search === '' || c.name.toLowerCase().includes(search.toLowerCase()) || c.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase())) || c.qualification.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = selectedSpec === 'All' || c.specializations.includes(selectedSpec);
    const matchesRating = selectedRating === 'All' || c.rating >= parseInt(selectedRating, 10);
    return matchesSearch && matchesSpec && matchesRating;
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = filtered.find((c) => c.id === selectedId) ?? filtered[0];
  const clearFilters = () => { setSearch(''); setSelectedSpec('All'); setSelectedRating('All'); };

  // Shared detail blocks — used by the cards and by the desktop side panel
  const ratingRow = (c: Counsellor) => (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < c.rating ? 'text-[#D97706]' : 'text-line'}>★</span>
        ))}
      </div>
      <span className="text-[13px] text-ink-2">({c.reviews} reviews)</span>
    </div>
  );
  const metaRows = (c: Counsellor) => (
    <div className="space-y-1.5 text-[13px] text-ink-2">
      <div className="flex items-center gap-2"><Languages className="w-4 h-4 shrink-0 text-ink-2/70" /><span>{c.languages.join(', ')}</span></div>
      <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 shrink-0 text-ink-2/70" /><span>{c.availability}</span></div>
    </div>
  );
  const bookButton = (c: Counsellor, extra = '') => (
    <MotionButton onClick={() => { router.push(`/student/talk?counsellor=${encodeURIComponent(c.name)}`); }} className={`btn btn-primary w-full ${extra}`}>
      Book Appointment
    </MotionButton>
  );

  return (
    <div className="min-h-screen bg-page">
      <SiteNavbar />

      {/* HERO BANNER */}
      <section className="relative overflow-hidden h-56 md:h-64">
        <img
          src="/con3.webp"
          alt="Our Counsellors"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="absolute inset-0 flex items-center">
          <div className="page-container">
            <nav className="flex items-center gap-2 text-white/80 text-[13px] mb-3">
              <Link href="/" className="hover:text-white transition-colors duration-150">Home</Link>
              <span>/</span>
              <span className="text-white">Counsellors</span>
            </nav>
            <h1 className="font-display text-[26px] md:text-h1 font-bold text-white mb-2">Our Expert <em className="not-italic">Counsellors</em></h1>
            <p className="text-white/85 text-[0.9375rem] md:text-base max-w-2xl leading-relaxed">
              Certified, compassionate professionals here to guide you — free, confidential, and available in your language.
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTER BAR */}
      <section className="bg-surface border-b border-line py-4">
        <div className="page-container">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search by name, specialization, or qualification..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="field pl-10"
              />
            </div>
            <div className="md:w-60">
              <select
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                className="field"
              >
                <option value="All">All Specializations</option>
                {allSpecializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div className="md:w-48">
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="field"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars Only</option>
                <option value="4">4 Stars &amp; Above</option>
                <option value="3">3 Stars &amp; Above</option>
              </select>
            </div>
            {(search !== '' || selectedSpec !== 'All' || selectedRating !== 'All') && (
              <button
                onClick={clearFilters}
                className="btn btn-ghost border border-line"
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
          <div className="mt-3 text-[13px] text-ink-2">
            Showing <span className="font-semibold text-navy">{filtered.length}</span> of {counsellors.length} counsellors
          </div>
        </div>
      </section>

      {/* COUNSELLORS GRID + DETAIL PANEL */}
      <section className="py-8 md:py-12">
        <div className="page-container">
          {filtered.length === 0 ? (
            <div className="ui-card text-center px-6 py-16">
              <div className="w-16 h-16 bg-tint rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-navy" />
              </div>
              <h3 className="font-display text-h3 font-bold text-ink mb-2">No counsellors found</h3>
              <p className="text-ink-2 mb-6">Try adjusting your search or filter criteria.</p>
              <button
                onClick={clearFilters}
                className="btn btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6 lg:items-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((counsellor) => {
                  const isSelected = selected?.id === counsellor.id;
                  return (
                    <MotionCard
                      key={counsellor.id}
                      onClick={() => setSelectedId(counsellor.id)}
                      className={`ui-card ui-card-hover p-5 flex flex-col h-full cursor-pointer ${isSelected ? 'lg:border-navy lg:ring-1 lg:ring-navy' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(counsellor.name)}&background=1a3a6b&color=fff&size=128`}
                          alt={counsellor.name}
                          loading="lazy"
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display font-bold text-ink text-base leading-tight">
                              <button
                                type="button"
                                onClick={() => setSelectedId(counsellor.id)}
                                aria-pressed={isSelected}
                                className="text-left hover:text-navy transition-colors duration-150"
                              >
                                {counsellor.name}
                              </button>
                            </h3>
                            <div className="tag tag-green shrink-0">
                              Available
                            </div>
                          </div>
                          <p className="text-navy text-sm font-semibold mt-0.5">{counsellor.qualification}</p>
                          <p className="text-ink-2 text-[13px] mt-0.5">{counsellor.experience} Years Experience</p>
                        </div>
                      </div>
                      <div className="mt-3">{ratingRow(counsellor)}</div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {counsellor.specializations.map((spec) => (
                          <span key={spec} className="tag">
                            {spec}
                          </span>
                        ))}
                      </div>
                      {/* Full details on phones/tablets; on desktop they show in the side panel */}
                      <div className="lg:hidden mt-3 space-y-3">
                        {metaRows(counsellor)}
                        <p className="text-ink-2 text-sm leading-relaxed">{counsellor.bio}</p>
                      </div>
                      <div className="mt-auto pt-4">
                        {bookButton(counsellor)}
                      </div>
                    </MotionCard>
                  );
                })}
              </div>

              {/* Desktop side panel — details of the selected counsellor */}
              {selected && (
                <aside className="hidden lg:block sticky top-[84px] ui-card p-6" aria-live="polite">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selected.name)}&background=1a3a6b&color=fff&size=128`}
                      alt={selected.name}
                      width={88}
                      height={88}
                      className="w-22 h-22 rounded-full ring-4 ring-tint"
                    />
                    <h2 className="font-display text-h3 font-bold text-ink mt-4">{selected.name}</h2>
                    <p className="text-navy text-sm font-semibold mt-0.5">{selected.qualification}</p>
                    <p className="text-ink-2 text-[13px] mt-0.5">{selected.experience} Years Experience</p>
                    <div className="mt-2">{ratingRow(selected)}</div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                    {selected.specializations.map((spec) => (
                      <span key={spec} className="tag">{spec}</span>
                    ))}
                  </div>
                  <div className="border-t border-line mt-5 pt-5">
                    {metaRows(selected)}
                    <p className="text-ink text-[0.9375rem] leading-relaxed mt-4">{selected.bio}</p>
                  </div>
                  <div className="mt-6">
                    {bookButton(selected)}
                  </div>
                </aside>
              )}
            </div>
          )}
        </div>
      </section>

      {/* JOIN AS COUNSELLOR CTA */}
      {/* FOOTER */}
      <SiteFooter
        subtitle="Govt. of India"
        quickLinks={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Counsellors', href: '/counselors' }, { label: 'Contact', href: '/contact' }]}
        services={['Career Counselling', 'Educational Guidance', 'Mental Wellness', 'Youth Guidance', 'Skill Development', 'Family Counselling', 'Personal Counselling']}
        showSitemap
      />
    </div>
  );
}
