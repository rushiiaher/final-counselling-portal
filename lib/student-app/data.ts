/* Student app content — ported verbatim from the new design (data.jsx).
   Bilingual (English / Urdu) UI strings + careers, scholarships, exams,
   skills, schemes, mentors, success stories and announcements. */
/* eslint-disable */

// ---- UI / chrome strings -------------------------------------------------
export const STR: Record<string, Record<string, string>> = {
  en: {
    govLine: "Government of Jammu & Kashmir · Youth Empowerment & Career Guidance",
    appName: "JK Career Navigator",
    welcome: "Welcome",
    heroTitle: "Find your path,\nSrinagar.",
    heroSub: "Official guidance on careers, scholarships, exams and skills — built for the youth of Jammu & Kashmir.",
    searchPh: "Search careers, scholarships, exams…",
    explore: "Explore",
    pathways: "Choose your pathway",
    pathwaysSub: "Tailored for every stage of your journey.",
    quickActions: "Quick access",
    careersTitle: "Career Explorer",
    careersSub: "Discover where your interests can take you.",
    scholarTitle: "Scholarship Hub",
    scholarSub: "Funding to keep you learning.",
    examTitle: "Competitive Exams",
    examSub: "Everything you need to crack the big ones.",
    skillsTitle: "Skill Development",
    skillsSub: "Future-ready, job-linked programs.",
    schemesTitle: "Government Schemes",
    schemesSub: "Benefits you're entitled to.",
    mentorsTitle: "Mentor Connect",
    mentorsSub: "Talk to people who've done it.",
    storiesTitle: "Success Stories",
    storiesSub: "Youth from across the valley.",
    newsTitle: "Latest announcements",
    viewAll: "View all",
    seeMore: "See more",
    eligibility: "Check eligibility",
    roadmap: "Generate roadmap",
    bookMentor: "Book a session",
    aiCounsel: "AI Counselor",
    askAi: "Ask the AI Career Counselor",
    more: "More",
    home: "Home",
    talk: "Talk",
    talkTitle: "Talk to a counsellor",
    mySessionsTitle: "My sessions",
    counselCta: "Talk to a counsellor",
    counselCtaSub: "Free, confidential guidance · book in-person, video or phone",
    careers: "Careers",
    scholar: "Scholarships",
    exams: "Exams",
    eligibilityChecker: "Scholarship Eligibility Checker",
    roadmapGen: "Career Roadmap Generator",
    deadline: "Deadline",
    amount: "Amount",
    eligibleLabel: "Eligibility",
    apply: "Apply now",
    back: "Back",
    syllabus: "Syllabus",
    prep: "Preparation roadmap",
    resources: "Resources",
    relatedExams: "Key exams",
    avgPay: "Typical pay",
    keySkills: "Skills to build",
    startNow: "Start now",
    talkNow: "Chat now",
    available: "Available",
    rating: "Rating",
    book: "Book",
    confirmed: "Session requested!",
    confirmedSub: "Your request has been sent — the Center team will confirm this session with you.",
    done: "Done",
    filterAll: "All",
    aboutTitle: "About the portal",
    aboutBody: "An initiative of the J&K Youth Empowerment & Career Guidance Department to give every student in the valley equal access to trusted career, education and skilling guidance.",
    langName: "اردو",
  },
  ur: {
    govLine: "حکومتِ جموں و کشمیر · نوجوانوں کی ترقی و رہنمائی",
    appName: "جے کے کیریئر نیویگیٹر",
    welcome: "خوش آمدید",
    heroTitle: "اپنی راہ پائیں،\nسرینگر۔",
    heroSub: "کیریئر، وظائف، امتحانات اور ہنر پر سرکاری رہنمائی — جموں و کشمیر کے نوجوانوں کے لیے۔",
    searchPh: "کیریئر، وظیفہ، امتحان تلاش کریں…",
    explore: "دریافت کریں",
    pathways: "اپنا راستہ منتخب کریں",
    pathwaysSub: "آپ کے سفر کے ہر مرحلے کے لیے۔",
    quickActions: "فوری رسائی",
    careersTitle: "کیریئر ایکسپلورر",
    careersSub: "جانیں آپ کی دلچسپی آپ کو کہاں لے جا سکتی ہے۔",
    scholarTitle: "وظائف کا مرکز",
    scholarSub: "تعلیم جاری رکھنے کے لیے مالی مدد۔",
    examTitle: "مسابقتی امتحانات",
    examSub: "بڑے امتحانات کے لیے مکمل تیاری۔",
    skillsTitle: "ہنر کی ترقی",
    skillsSub: "مستقبل کے لیے تیار، روزگار سے جڑے پروگرام۔",
    schemesTitle: "سرکاری اسکیمیں",
    schemesSub: "جو فوائد آپ کا حق ہیں۔",
    mentorsTitle: "مینٹر کنیکٹ",
    mentorsSub: "ان لوگوں سے بات کریں جنہوں نے یہ کر دکھایا۔",
    storiesTitle: "کامیابی کی کہانیاں",
    storiesSub: "وادی بھر کے نوجوان۔",
    newsTitle: "تازہ اعلانات",
    viewAll: "سب دیکھیں",
    seeMore: "مزید دیکھیں",
    eligibility: "اہلیت جانچیں",
    roadmap: "روڈ میپ بنائیں",
    bookMentor: "سیشن بک کریں",
    aiCounsel: "اے آئی کونسلر",
    askAi: "اے آئی کیریئر کونسلر سے پوچھیں",
    more: "مزید",
    home: "ہوم",
    talk: "بات",
    talkTitle: "کونسلر سے بات کریں",
    mySessionsTitle: "میرے سیشنز",
    counselCta: "کونسلر سے بات کریں",
    counselCtaSub: "مفت، خفیہ رہنمائی · سینٹر، ویڈیو یا فون",
    careers: "کیریئر",
    scholar: "وظائف",
    exams: "امتحانات",
    eligibilityChecker: "وظیفہ اہلیت چیکر",
    roadmapGen: "کیریئر روڈ میپ جنریٹر",
    deadline: "آخری تاریخ",
    amount: "رقم",
    eligibleLabel: "اہلیت",
    apply: "ابھی درخواست دیں",
    back: "واپس",
    syllabus: "نصاب",
    prep: "تیاری کا روڈ میپ",
    resources: "وسائل",
    relatedExams: "اہم امتحانات",
    avgPay: "عام تنخواہ",
    keySkills: "سیکھنے کے ہنر",
    startNow: "ابھی شروع کریں",
    talkNow: "ابھی چیٹ کریں",
    available: "دستیاب",
    rating: "ریٹنگ",
    book: "بک کریں",
    confirmed: "سیشن کی درخواست بھیج دی گئی!",
    confirmedSub: "آپ کی درخواست بھیج دی گئی ہے — سینٹر کی ٹیم آپ سے تصدیق کرے گی۔",
    done: "مکمل",
    filterAll: "تمام",
    aboutTitle: "پورٹل کے بارے میں",
    aboutBody: "جموں و کشمیر کے نوجوانوں کی ترقی و رہنمائی کے محکمے کا ایک اقدام تاکہ وادی کے ہر طالبعلم کو معتبر رہنمائی تک یکساں رسائی ملے۔",
    langName: "English",
  },
};

// helper — fetch a string for current language, with EN fallback
export function tr(lang: string, key: string): string {
  return (STR[lang] && STR[lang][key]) || STR.en[key] || key;
}

// ---- Pathways (Class 8-12 first) ----------------------------------------
export const PATHWAYS: any[] = [
  { icon: "school", en: "Class 8–12", ur: "کلاس ۸–۱۲", descEn: "Stream selection, board prep & early planning.", descUr: "اسٹریم کا انتخاب، بورڈ کی تیاری اور ابتدائی منصوبہ بندی۔", accent: true },
  { icon: "account_balance", en: "College", ur: "کالج", descEn: "Internships, higher studies & skills.", descUr: "انٹرن شپ، اعلیٰ تعلیم اور ہنر۔" },
  { icon: "work", en: "Job Seekers", ur: "ملازمت کے متلاشی", descEn: "Govt alerts, interview prep & roles.", descUr: "سرکاری اطلاعات، انٹرویو کی تیاری۔" },
];

// ---- Quick actions -------------------------------------------------------
export const QUICK: any[] = [
  { icon: "explore", en: "Careers", ur: "کیریئر", to: "careers" },
  { icon: "school", en: "Scholarships", ur: "وظائف", to: "scholar" },
  { icon: "trophy", en: "Exams", ur: "امتحانات", to: "exams", mi: "emoji_events" },
  { icon: "rocket_launch", en: "Skills", ur: "ہنر", to: "skills" },
];

// ---- Careers -------------------------------------------------------------
export const CAREERS: any[] = [
  { id: "eng", icon: "engineering", en: "Engineering", ur: "انجینئرنگ", tag: "High demand", desc: "Design, build and innovate — from civil to computer science.", pay: "₹4–18 LPA", exams: ["JEE", "CUET"], skills: ["Math", "Problem solving", "CAD / Coding"], roadmap: ["Take PCM in Class 11–12", "Crack JEE / CUET", "B.Tech / B.E. (4 yrs)", "Internships & projects", "Campus placement or GATE"] },
  { id: "med", icon: "stethoscope", mi: "health_and_safety", en: "Medical", ur: "طب", tag: "Stable", desc: "Heal and care — doctor, dentist, nursing, allied health.", pay: "₹6–24 LPA", exams: ["NEET"], skills: ["Biology", "Empathy", "Discipline"], roadmap: ["Take PCB in Class 11–12", "Crack NEET-UG", "MBBS / BDS (4.5–5 yrs)", "Internship", "PG (NEET-PG) or practice"] },
  { id: "gov", icon: "account_balance", en: "Government Jobs", ur: "سرکاری نوکریاں", tag: "Secure", desc: "Serve the public through state & central services.", pay: "₹3–14 LPA", exams: ["JKPSC", "SSC", "Banking"], skills: ["GK", "Reasoning", "Aptitude"], roadmap: ["Graduate in any stream", "Pick exam (SSC/JKPSC/Bank)", "Prelims → Mains", "Interview / skill test", "Posting & training"] },
  { id: "def", icon: "shield", en: "Defence", ur: "دفاع", tag: "Prestige", desc: "Lead and protect — Army, Navy, Air Force.", pay: "₹8–20 LPA", exams: ["NDA", "CDS"], skills: ["Fitness", "Leadership", "Aptitude"], roadmap: ["Class 12 (NDA) or graduate (CDS)", "Written exam", "SSB interview (5 days)", "Medical", "Academy training"] },
  { id: "upsc", icon: "gavel", en: "Civil Services", ur: "سول سروسز", tag: "Top tier", desc: "Shape policy as an IAS / IPS / IFS officer.", pay: "₹10–24 LPA", exams: ["UPSC"], skills: ["Reading", "Writing", "Current affairs"], roadmap: ["Graduate (any stream)", "Build optional + GS base", "Prelims", "Mains (9 papers)", "Interview & allotment"] },
  { id: "ent", icon: "lightbulb", en: "Entrepreneurship", ur: "کاروبار", tag: "High growth", desc: "Build a venture — startups, handicraft brands, tourism.", pay: "Variable", exams: [], skills: ["Sales", "Finance", "Resilience"], roadmap: ["Spot a local problem", "Validate with customers", "MVP / first product", "Mission YUVA / seed funding", "Scale & hire"] },
  { id: "it", icon: "smart_toy", en: "IT & AI", ur: "آئی ٹی و اے آئی", tag: "Fastest growing", desc: "Code the future — software, data, AI & cloud.", pay: "₹5–30 LPA", exams: ["JEE", "CUET"], skills: ["Coding", "Math", "Logic"], roadmap: ["Learn a language (Python)", "CS degree or bootcamp", "Build a portfolio", "Internships", "Product / service company"] },
  { id: "des", icon: "draw", en: "Design", ur: "ڈیزائن", tag: "Creative", desc: "Solve with creativity — UX, product, graphic, fashion.", pay: "₹4–18 LPA", exams: ["CUET", "NID/UCEED"], skills: ["Drawing", "Tools", "Storytelling"], roadmap: ["Build a sketch habit", "Crack UCEED / NID", "Design degree", "Internships & portfolio", "Studio or freelance"] },
  { id: "com", icon: "payments", en: "Commerce", ur: "کامرس", tag: "Versatile", desc: "Money, markets & management — CA, finance, business.", pay: "₹4–20 LPA", exams: ["CUET", "CA Foundation"], skills: ["Accounting", "Analysis", "Communication"], roadmap: ["Take Commerce in 11–12", "B.Com / BBA + CA/CS", "Internship (articleship)", "Certifications", "Industry or practice"] },
  { id: "tour", icon: "travel_explore", en: "Tourism & Hospitality", ur: "سیاحت و مہمان نوازی", tag: "Local edge", desc: "Showcase Kashmir — hotels, travel, experiences.", pay: "₹3–12 LPA", exams: ["CUET"], skills: ["Languages", "Service", "Logistics"], roadmap: ["Hospitality diploma / degree", "Local internships", "Specialise (hotel / travel)", "Certifications", "Manage or start your own"] },
  { id: "agri", icon: "agriculture", en: "Agriculture", ur: "زراعت", tag: "Emerging", desc: "Modern farming — horticulture, saffron, food-tech.", pay: "₹3–12 LPA", exams: ["ICAR", "CUET"], skills: ["Science", "Field work", "Agri-tech"], roadmap: ["PCB / PCM in 11–12", "B.Sc Agriculture", "Field & lab training", "Govt / agri-startup", "Specialise (horticulture)"] },
];

// ---- Scholarships --------------------------------------------------------
export const SCHOLARSHIPS: any[] = [
  { id: "pmss", en: "PM Special Scholarship (J&K)", ur: "وزیراعظم خصوصی وظیفہ", provider: "AICTE / MoE", cat: "central", amount: "Up to ₹1.25 L/yr", deadline: "31 Oct 2026", elig: "J&K domicile, Class 12 passed, family income ≤ ₹8 L." },
  { id: "nmms", en: "National Means-cum-Merit", ur: "قومی میرٹ وظیفہ", provider: "Ministry of Education", cat: "merit", amount: "₹12,000/yr", deadline: "15 Nov 2026", elig: "Class 8 students, income ≤ ₹3.5 L, merit test." },
  { id: "jkpost", en: "J&K Post-Matric Scholarship", ur: "جے کے پوسٹ میٹرک", provider: "J&K Social Welfare", cat: "jk", amount: "Tuition + ₹1,200/mo", deadline: "30 Sep 2026", elig: "J&K domicile, Class 11+, SC/ST/OBC categories." },
  { id: "min", en: "Minority Merit Scholarship", ur: "اقلیتی میرٹ وظیفہ", provider: "Ministry of Minority Affairs", cat: "minority", amount: "Up to ₹30,000/yr", deadline: "30 Nov 2026", elig: "Minority community, ≥50% marks, income ≤ ₹2 L." },
  { id: "begum", en: "Begum Hazrat Mahal (Girls)", ur: "بیگم حضرت محل (لڑکیاں)", provider: "Maulana Azad Foundation", cat: "minority", amount: "₹5,000–6,000/yr", deadline: "31 Dec 2026", elig: "Girls, Class 9–12, minority, income ≤ ₹2 L." },
  { id: "merit", en: "J&K Merit Scholarship", ur: "جے کے میرٹ وظیفہ", provider: "J&K Higher Education", cat: "merit", amount: "₹10,000/yr", deadline: "20 Oct 2026", elig: "Top 10% in board exams, any stream." },
];
export const SCHOLAR_FILTERS: any[] = [
  { id: "all", en: "All", ur: "تمام" },
  { id: "central", en: "Central", ur: "مرکزی" },
  { id: "jk", en: "J&K", ur: "جے کے" },
  { id: "minority", en: "Minority", ur: "اقلیتی" },
  { id: "merit", en: "Merit", ur: "میرٹ" },
];

// ---- Exams ---------------------------------------------------------------
export const EXAMS: any[] = [
  { id: "upsc", code: "UPSC", en: "Civil Services (CSE)", ur: "سول سروسز", level: "Graduate", elig: "Bachelor's degree, age 21–32.", syllabus: ["GS Paper I–IV", "CSAT (aptitude)", "Essay", "Optional subject", "Language papers"], prep: ["Build NCERT base (6 mo)", "Daily current affairs", "Answer writing practice", "Solve PYQs", "2–3 full mock tests/week"], res: ["NCERT 6–12", "PIB & The Hindu", "Free NCS mock series"] },
  { id: "jkpsc", code: "JKPSC", en: "J&K Combined Services", ur: "جے کے مشترکہ خدمات", level: "Graduate", elig: "Graduate, J&K domicile.", syllabus: ["General Studies", "J&K specific GK", "Aptitude", "Optional"], prep: ["Focus on J&K history/geo", "State current affairs", "Prelims PYQs", "Mains answer writing"], res: ["JKPSC syllabus PDF", "State year book", "Local test series"] },
  { id: "ssc", code: "SSC", en: "Staff Selection (CGL)", ur: "اسٹاف سلیکشن", level: "Graduate", elig: "Graduate, age 18–32.", syllabus: ["Quant", "Reasoning", "English", "General Awareness"], prep: ["Speed maths daily", "Vocab building", "Tier-1 mocks", "Tier-2 specialisation"], res: ["SSC PYQ books", "Free online tests"] },
  { id: "bank", code: "Banking", en: "IBPS / SBI PO & Clerk", ur: "بینکنگ", level: "Graduate", elig: "Graduate, age 20–30.", syllabus: ["Quant", "Reasoning", "English", "Banking awareness"], prep: ["Daily current affairs", "Sectional timing", "Mock-heavy prep", "Interview prep"], res: ["Banking awareness PDF", "Mock platforms"] },
  { id: "nda", code: "NDA", en: "National Defence Academy", ur: "این ڈی اے", level: "Class 12", elig: "Unmarried, Class 12, age 16.5–19.5.", syllabus: ["Mathematics", "General Ability", "SSB interview"], prep: ["Strengthen maths", "Daily fitness", "GAT practice", "SSB awareness"], res: ["NDA maths guide", "SSB prep books"] },
  { id: "cds", code: "CDS", en: "Combined Defence Services", ur: "سی ڈی ایس", level: "Graduate", elig: "Graduate, age 19–25.", syllabus: ["English", "GK", "Maths (IMA/INA)", "SSB"], prep: ["Subject revision", "Mock tests", "Fitness routine", "SSB practice"], res: ["CDS PYQ", "SSB guides"] },
  { id: "neet", code: "NEET", en: "Medical Entrance", ur: "نیٹ", level: "Class 12", elig: "PCB in Class 12, age 17+.", syllabus: ["Physics", "Chemistry", "Biology"], prep: ["NCERT mastery", "Daily MCQs", "Full mocks weekly", "Revision cycles"], res: ["NCERT 11–12", "NEET PYQ", "Free mock tests"] },
  { id: "jee", code: "JEE", en: "Engineering Entrance", ur: "جے ای ای", level: "Class 12", elig: "PCM in Class 12.", syllabus: ["Physics", "Chemistry", "Mathematics"], prep: ["Concept clarity", "Problem solving daily", "Mains + Advanced mocks", "Error log"], res: ["NCERT + standard texts", "JEE PYQ", "Free lectures"] },
  { id: "cuet", code: "CUET", en: "Common University Entrance", ur: "سی یو ای ٹی", level: "Class 12", elig: "Class 12 pass, any stream.", syllabus: ["Domain subjects", "General test", "Language"], prep: ["Pick domain subjects", "Board + CUET sync", "Sectional mocks", "Time management"], res: ["NTA syllabus", "CUET sample papers"] },
];

// ---- Skills --------------------------------------------------------------
export const SKILLS: any[] = [
  { id: "digital", icon: "devices", en: "Digital Skills", ur: "ڈیجیٹل ہنر", dur: "8 weeks", mode: "Online", level: "Beginner", provider: "NSDC" },
  { id: "ai", icon: "smart_toy", en: "Artificial Intelligence", ur: "مصنوعی ذہانت", dur: "12 weeks", mode: "Hybrid", level: "Intermediate", provider: "NIELIT" },
  { id: "cloud", icon: "cloud", en: "Cloud Computing", ur: "کلاؤڈ کمپیوٹنگ", dur: "10 weeks", mode: "Online", level: "Intermediate", provider: "NSDC" },
  { id: "cyber", icon: "security", en: "Cybersecurity", ur: "سائبر سیکیورٹی", dur: "10 weeks", mode: "Hybrid", level: "Intermediate", provider: "NIELIT" },
  { id: "tourism", icon: "luggage", en: "Tourism & Hospitality", ur: "سیاحت کے ہنر", dur: "6 weeks", mode: "In-person", level: "Beginner", provider: "J&K Tourism" },
  { id: "handi", icon: "auto_awesome", en: "Handicrafts & Pashmina", ur: "دستکاری و پشمینہ", dur: "Ongoing", mode: "In-person", level: "All levels", provider: "Craft Dev. Institute" },
  { id: "startup", icon: "rocket_launch", en: "Entrepreneurship", ur: "کاروبار", dur: "8 weeks", mode: "Hybrid", level: "Beginner", provider: "Mission YUVA" },
];

// ---- Government schemes --------------------------------------------------
export const SCHEMES: any[] = [
  { id: "yuva", en: "Mission YUVA", ur: "مشن یووا", cat: ["startup", "graduate"], desc: "Self-employment & startup support for J&K youth — funding, training and mentorship." },
  { id: "pmkvy", en: "PM Kaushal Vikas Yojana", ur: "پی ایم کوشل وکاس یوجنا", cat: ["skill", "student"], desc: "Free short-term skill training with certification and placement support." },
  { id: "tejaswini", en: "Tejaswini (Women)", ur: "تیجسوِنی (خواتین)", cat: ["women", "startup"], desc: "Economic empowerment for young women — loans and enterprise support." },
  { id: "pmkisan", en: "Stand-Up India", ur: "اسٹینڈ اپ انڈیا", cat: ["startup", "women"], desc: "Bank loans ₹10 L–₹1 Cr for women & SC/ST first-time entrepreneurs." },
  { id: "umeed", en: "UMEED (J&K)", ur: "امید (جے کے)", cat: ["women", "skill"], desc: "Self-help groups & livelihood for rural women across the valley." },
  { id: "nsp", en: "National Scholarship Portal", ur: "قومی اسکالرشپ پورٹل", cat: ["student", "graduate"], desc: "Single window to apply for 100+ central & state scholarships." },
];
export const SCHEME_FILTERS: any[] = [
  { id: "all", en: "All", ur: "تمام" },
  { id: "student", en: "Student", ur: "طالبعلم" },
  { id: "graduate", en: "Graduate", ur: "گریجویٹ" },
  { id: "women", en: "Women", ur: "خواتین" },
  { id: "startup", en: "Startup", ur: "اسٹارٹ اپ" },
  { id: "skill", en: "Skill", ur: "ہنر" },
];

// ---- Mentors -------------------------------------------------------------
export const MENTORS: any[] = [
  { id: "m1", en: "Dr. Ayesha Khan", ur: "ڈاکٹر عائشہ خان", role: "IAS Officer (2019)", expertise: "UPSC · Civil Services", district: "Srinagar", rating: 4.9, slots: ["Today 5:00 PM", "Tomorrow 11:00 AM", "Sat 4:00 PM"], init: "AK" },
  { id: "m2", en: "Bilal Ahmad", ur: "بلال احمد", role: "Software Engineer, Bengaluru", expertise: "IT & AI · Engineering", district: "Baramulla", rating: 4.8, slots: ["Tomorrow 6:00 PM", "Sun 2:00 PM"], init: "BA" },
  { id: "m3", en: "Dr. Mehak Jan", ur: "ڈاکٹر مہک جان", role: "MBBS, GMC Srinagar", expertise: "NEET · Medical", district: "Anantnag", rating: 5.0, slots: ["Today 7:00 PM", "Fri 5:30 PM"], init: "MJ" },
  { id: "m4", en: "Yusuf Dar", ur: "یوسف ڈار", role: "Founder, Pashmina startup", expertise: "Entrepreneurship", district: "Budgam", rating: 4.7, slots: ["Tomorrow 1:00 PM", "Mon 3:00 PM"], init: "YD" },
  { id: "m5", en: "Sana Mir", ur: "ثنا میر", role: "Bank PO (SBI)", expertise: "Banking · SSC", district: "Ganderbal", rating: 4.8, slots: ["Today 6:30 PM", "Sat 12:00 PM"], init: "SM" },
];

// ---- Success stories -----------------------------------------------------
export const STORIES: any[] = [
  { id: "s1", en: "Iqra Bashir", ur: "اقرا بشیر", district: "Srinagar", achievement: "Cleared NEET, now at GMC", quote: "The roadmap broke a scary exam into small weekly wins.", init: "IB" },
  { id: "s2", en: "Faisal Lone", ur: "فیصل لون", district: "Baramulla", achievement: "B.Tech via JEE + PMSS scholarship", quote: "I found a scholarship I didn't know I was eligible for.", init: "FL" },
  { id: "s3", en: "Rukhsar Jan", ur: "رخسار جان", district: "Anantnag", achievement: "Selected as J&K Bank PO", quote: "My mentor's mock interviews made all the difference.", init: "RJ" },
  { id: "s4", en: "Adil Wani", ur: "عادل وانی", district: "Budgam", achievement: "Runs a handicraft export brand", quote: "Mission YUVA gave my Pashmina idea its first push.", init: "AW" },
  { id: "s5", en: "Hina Qadri", ur: "حنا قادری", district: "Ganderbal", achievement: "Cloud certified, hired remotely", quote: "Free skill training opened a global job from the valley.", init: "HQ" },
];

// ---- Announcements -------------------------------------------------------
export const NEWS: any[] = [
  { id: "n1", tag: "Scholarship", en: "PMSS 2026 applications now open", ur: "پی ایم ایس ایس ۲۰۲۶ کی درخواستیں کھل گئیں", date: "12 Jun 2026" },
  { id: "n2", tag: "Exam", en: "JKPSC prelims date announced", ur: "جے کے پی ایس سی پری لمز کی تاریخ کا اعلان", date: "08 Jun 2026" },
  { id: "n3", tag: "Skills", en: "New AI bootcamp seats at NIELIT", ur: "نیلیٹ میں نئے اے آئی بوٹ کیمپ نشستیں", date: "03 Jun 2026" },
  { id: "n4", tag: "Event", en: "Career fair in Srinagar — 25 June", ur: "سرینگر میں کیریئر میلہ — ۲۵ جون", date: "01 Jun 2026" },
];


export const DATA = { PATHWAYS, QUICK, CAREERS, SCHOLARSHIPS, SCHOLAR_FILTERS, EXAMS, SKILLS, SCHEMES, SCHEME_FILTERS, MENTORS, STORIES, NEWS };

// ---- Counselling reference data (design: portal-store.jsx) ---------------
export const CONCERNS = [
  { id: "career", en: "Career guidance", icon: "explore", color: "#0f4c81", category: "CAREER_COUNSELLING" },
  { id: "exam", en: "Exam stress", icon: "menu_book", color: "#b45309", category: "MENTAL_WELLNESS" },
  { id: "studies", en: "Academics / studies", icon: "school", color: "#0e7490", category: "EDUCATIONAL_GUIDANCE" },
  { id: "wellbeing", en: "Mental well-being", icon: "favorite", color: "#be185d", category: "MENTAL_WELLNESS" },
  { id: "scholarship", en: "Scholarship / financial", icon: "payments", color: "#067a55", category: "EDUCATIONAL_GUIDANCE" },
  { id: "personal", en: "Personal / family", icon: "diversity_3", color: "#6d28d9", category: "PERSONAL_COUNSELLING" },
] as const;

export const MODES = [
  { id: "in-person", en: "In-person at District Center", icon: "location_on", sub: "Youth Empowerment & Development Center, Anantnag" },
  { id: "video", en: "Video call", icon: "videocam", sub: "From home, via secure link" },
  { id: "phone", en: "Phone call", icon: "call", sub: "Counsellor calls your number" },
] as const;

/* Which bookable concerns a counsellor's service categories cover */
export const CATEGORY_TO_CONCERNS: Record<string, string[]> = {
  CAREER_COUNSELLING: ["career"],
  EDUCATIONAL_GUIDANCE: ["studies", "scholarship"],
  MENTAL_WELLNESS: ["wellbeing", "exam"],
  PERSONAL_COUNSELLING: ["personal"],
  FAMILY_COUNSELLING: ["personal"],
  YOUTH_GUIDANCE: ["career", "personal"],
  SKILL_DEVELOPMENT: ["career", "studies"],
  CRISIS_SUPPORT: ["wellbeing"],
};

// ---- AI career counsellor (design: features.jsx) --------------------------
export const AI_START = {
  q: "Hi! I'm your AI Career Counselor. What's on your mind?",
  chips: ["I'm in Class 10, what stream?", "Which exam for govt job?", "Scholarships for me?", "Suggest a career"],
};
const AI_REPLIES = [
  { m: /stream|class 10|class 9/i, a: "Great question! Pick your stream by interest + strength:\n• Love math & building? → Science (PCM) → Engineering / IT.\n• Love biology & helping? → Science (PCB) → Medical.\n• Love money & business? → Commerce → CA / management.\n• Love people & ideas? → Arts → Civil services / law / design.\nTry the Career Roadmap Generator to see the full path.", chips: ["Suggest a career", "Which exam for govt job?"] },
  { m: /govt|government|sarkari/i, a: "For government jobs, the main routes are:\n• UPSC — IAS/IPS (national, toughest).\n• JKPSC — J&K state services.\n• SSC CGL — central ministries.\n• Banking (IBPS/SBI) — PO & clerk.\nMost need a graduate degree. Open the Exams hub for syllabus + a prep roadmap.", chips: ["Scholarships for me?", "I'm in Class 10, what stream?"] },
  { m: /scholarship|fund|money|fees/i, a: "There's likely funding for you! Key ones for J&K students:\n• PM Special Scholarship (PMSS) — up to ₹1.25 L/yr.\n• J&K Post-Matric — tuition + stipend.\n• Minority & Begum Hazrat Mahal (for girls).\nRun the Scholarship Eligibility Checker — it matches you in 5 questions.", chips: ["Suggest a career", "Which exam for govt job?"] },
  { m: /career|suggest|confused|what should/i, a: "Tell me what energises you and I'll point you somewhere:\n• Tech & problem-solving → IT & AI or Engineering.\n• Caring for people → Medical or teaching.\n• Kashmir's strengths → Tourism, Handicrafts, Agriculture.\n• Building something of your own → Entrepreneurship (Mission YUVA).\nExplore all 11 paths in the Career Explorer.", chips: ["Scholarships for me?", "Which exam for govt job?"] },
];
export function aiAnswer(text: string): { a: string; chips: string[] } {
  const hit = AI_REPLIES.find((r) => r.m.test(text));
  if (hit) return hit;
  return { a: "Good question. I can help most with choosing a stream, picking competitive exams, finding scholarships, and mapping a career path. Try one of these — or explore the hubs from the menu.", chips: ["I'm in Class 10, what stream?", "Scholarships for me?", "Suggest a career"] };
}

/* Official National Scholarship Portal — where "Apply now" sends students */
export const NSP_URL = "https://scholarships.gov.in";
