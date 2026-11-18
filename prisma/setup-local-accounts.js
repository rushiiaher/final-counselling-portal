/* Creates (or refreshes) the local login accounts for development.
   Run:  node prisma/setup-local-accounts.js
   Safe to run again — existing accounts are updated, not duplicated.

   Includes the 8 counsellors listed on the website's "Find Counsellor" page
   (app/counselors/page.tsx) so students can book them in the student app. */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const COUNSELLOR_PASSWORD = "counsellor123";

const ACCOUNTS = [
  { role: "ADMIN", name: "District Admin", email: "admin@dyedc-anantnag.gov.in", password: "admin123" },
  { role: "STUDENT", name: "Insha Jan", email: "student@dyedc-anantnag.gov.in", password: "student123" },
];

/* Website specialisations → portal service categories */
const SPEC_TO_CATEGORY = {
  "Career Counselling": "CAREER_COUNSELLING",
  "Mental Wellness": "MENTAL_WELLNESS",
  "Anxiety": "MENTAL_WELLNESS",
  "Stress Management": "MENTAL_WELLNESS",
  "Trauma Counselling": "MENTAL_WELLNESS",
  "Academic Stress": "MENTAL_WELLNESS",
  "Youth Guidance": "YOUTH_GUIDANCE",
  "Peer Pressure": "YOUTH_GUIDANCE",
  "Family Counselling": "FAMILY_COUNSELLING",
  "Educational Guidance": "EDUCATIONAL_GUIDANCE",
  "Learning Disabilities": "EDUCATIONAL_GUIDANCE",
  "Study Skills": "EDUCATIONAL_GUIDANCE",
  "Personal Counselling": "PERSONAL_COUNSELLING",
  "Grief Counselling": "PERSONAL_COUNSELLING",
  "Self-Esteem": "PERSONAL_COUNSELLING",
  "Women Empowerment": "PERSONAL_COUNSELLING",
  "Skill Development": "SKILL_DEVELOPMENT",
  "Entrepreneurship": "SKILL_DEVELOPMENT",
};

/* Working days from the website ("Mon–Fri" etc.) → day-of-week numbers */
const DAYS = { "Mon–Fri": [1, 2, 3, 4, 5], "Mon–Sat": [1, 2, 3, 4, 5, 6], "Tue–Sat": [2, 3, 4, 5, 6] };
const CENTER_TIMES = ["09:30", "10:30", "11:30", "12:30", "14:00", "15:00", "16:00", "17:00"];

const COUNSELLORS = [
  { name: "Dr. Ayesha Khan", email: "counsellor@dyedc-anantnag.gov.in", qualification: "Ph.D. Counselling", experience: 8, specializations: ["Career & Higher Education", "Educational Guidance", "Mental Wellness"], languages: ["English", "Urdu", "Kashmiri"], availability: "Mon–Sat", bio: "Career and higher-education counsellor at the District Counselling Center, Anantnag." },
  { name: "Dr. Aamir Wani", email: "aamir.wani@dyedc-anantnag.gov.in", qualification: "Ph.D. Psychology", experience: 15, specializations: ["Career Counselling", "Mental Wellness", "Anxiety"], languages: ["Kashmiri", "Urdu", "English"], availability: "Mon–Fri", bio: "Dr. Aamir Wani is a senior psychologist with 15 years of experience in career counselling and mental wellness. He has guided over 2,000 students across Srinagar in making informed career decisions." },
  { name: "Mr. Tariq Ahmed Lone", email: "tariq.lone@dyedc-anantnag.gov.in", qualification: "M.A. Counselling Psychology", experience: 10, specializations: ["Youth Guidance", "Family Counselling", "Peer Pressure"], languages: ["Kashmiri", "Urdu", "English"], availability: "Mon–Sat", bio: "Mr. Tariq Ahmed Lone specializes in youth development and family counselling. His community-based approach has helped hundreds of families in Baramulla strengthen their bonds." },
  { name: "Dr. Nighat Bhat", email: "nighat.bhat@dyedc-anantnag.gov.in", qualification: "Ph.D. Educational Psychology", experience: 18, specializations: ["Educational Guidance", "Learning Disabilities", "Academic Stress"], languages: ["Kashmiri", "Urdu", "English"], availability: "Mon–Fri", bio: "Dr. Nighat Bhat is an expert in educational psychology with 18 years of experience. She has helped thousands of students in Anantnag overcome academic challenges and achieve their educational goals." },
  { name: "Ms. Iqra Mir", email: "iqra.mir@dyedc-anantnag.gov.in", qualification: "M.Sc. Clinical Psychology", experience: 8, specializations: ["Personal Counselling", "Grief Counselling", "Self-Esteem"], languages: ["Kashmiri", "Urdu", "English"], availability: "Tue–Sat", bio: "Ms. Iqra Mir is a compassionate counsellor specializing in personal development and grief counselling. She creates a safe, non-judgmental space for her clients in Budgam." },
  { name: "Dr. Mudasir Khan", email: "mudasir.khan@dyedc-anantnag.gov.in", qualification: "Ph.D. Counselling", experience: 20, specializations: ["Career Counselling", "Skill Development", "Entrepreneurship"], languages: ["Kashmiri", "Urdu", "English"], availability: "Mon–Fri", bio: "Dr. Mudasir Khan is the Head of Career Guidance with 20 years of experience. He has helped over 5,000 youth in Pulwama find their career path and develop entrepreneurial skills." },
  { name: "Ms. Sana Malik", email: "sana.malik@dyedc-anantnag.gov.in", qualification: "M.A. Psychology, B.Ed.", experience: 12, specializations: ["Educational Guidance", "Career Counselling", "Study Skills"], languages: ["Kashmiri", "Urdu", "English"], availability: "Mon–Sat", bio: "Ms. Sana Malik combines her psychology and education background to provide holistic guidance to students. She is known for her practical and student-friendly approach in Kupwara." },
  { name: "Dr. Imran Dar", email: "imran.dar@dyedc-anantnag.gov.in", qualification: "Ph.D. Clinical Psychology", experience: 14, specializations: ["Mental Wellness", "Trauma Counselling", "Stress Management"], languages: ["Dogri", "Hindi", "Urdu", "English"], availability: "Mon–Fri", bio: "Dr. Imran Dar is a clinical psychologist specializing in trauma-informed care and stress management. He uses evidence-based CBT and mindfulness techniques with clients across Jammu." },
  { name: "Ms. Farida Sheikh", email: "farida.sheikh@dyedc-anantnag.gov.in", qualification: "M.Sc. Psychology, RCI Certified", experience: 9, specializations: ["Family Counselling", "Personal Counselling", "Women Empowerment"], languages: ["Dogri", "Hindi", "English"], availability: "Mon–Sat", bio: "Ms. Farida Sheikh is an RCI-certified counsellor with a focus on family therapy and women empowerment. She runs special programs for women and girls in Kathua district." },
];

async function upsertUser(a) {
  const password = await bcrypt.hash(a.password, 12);
  const now = new Date();
  return prisma.user.upsert({
    where: { email: a.email },
    update: { name: a.name, password, role: a.role, isActive: true, profileCompleted: true },
    create: {
      name: a.name, email: a.email, password, role: a.role, isActive: true, profileCompleted: true,
      termsAcceptedAt: now, privacyAcceptedAt: now,
    },
  });
}

async function main() {
  for (const a of ACCOUNTS) {
    const user = await upsertUser(a);
    if (a.role === "ADMIN") {
      await prisma.adminProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, scope: "SUPER_ADMIN" } });
    }
    if (a.role === "STUDENT") {
      await prisma.studentProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id, firstName: "Insha", lastName: "Jan", ageRange: "16-18", district: "Anantnag", grade: "Class 12" },
      });
    }
    console.log(`${a.role.padEnd(10)} ${a.email}  /  ${a.password}`);
  }

  for (const c of COUNSELLORS) {
    const user = await upsertUser({ role: "COUNSELLOR", name: c.name, email: c.email, password: COUNSELLOR_PASSWORD });
    const categories = [...new Set(c.specializations.map((s) => SPEC_TO_CATEGORY[s]).filter(Boolean))];
    if (c.specializations.includes("Career & Higher Education")) categories.unshift("CAREER_COUNSELLING");
    const data = {
      specializations: c.specializations,
      languages: c.languages,
      yearsOfExperience: c.experience,
      isVerified: true,
      serviceCategories: [...new Set(categories)],
      bio: `${c.qualification}. ${c.bio}`,
    };
    const profile = await prisma.counsellorProfile.upsert({
      where: { userId: user.id },
      update: data,
      create: { userId: user.id, acceptingPatients: true, ...data },
    });
    // Weekly availability from the website's working days — only if none is set yet,
    // so changes a counsellor makes on their Availability screen are kept.
    const existing = await prisma.counsellorAvailability.count({ where: { counsellorId: profile.id } });
    if (existing === 0) {
      await prisma.counsellorAvailability.createMany({
        data: (DAYS[c.availability] || DAYS["Mon–Fri"]).flatMap((dayOfWeek) =>
          CENTER_TIMES.map((startTime) => {
            const [h, m] = startTime.split(":").map(Number);
            return { counsellorId: profile.id, dayOfWeek, startTime, endTime: `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`, slotDuration: 60, isActive: true };
          })
        ),
      });
    }
    console.log(`COUNSELLOR ${c.email.padEnd(38)} /  ${COUNSELLOR_PASSWORD}   (${c.name}, ${c.availability})`);
  }
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
