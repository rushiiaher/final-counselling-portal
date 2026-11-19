"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  studentSignupSchema, StudentSignupInput, JK_DISTRICTS, STUDY_LEVELS,
} from "@/lib/validations/auth.schema";
import { registerStudentAction } from "@/app/actions/auth.actions";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthSplit from "@/components/shared/AuthSplit";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { safeNext } from "@/lib/booking";

/* Student sign-up: one form for account + profile + consent.
   After it, the student is signed in and goes back to where they were (e.g. the booking). */
export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Where the student was heading (e.g. /student/talk), kept through sign-up / log-in
  const [nextParam, setNextParam] = useState<string | null>(null);
  useEffect(() => { setNextParam(new URLSearchParams(window.location.search).get("next")); }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<StudentSignupInput>({
    resolver: zodResolver(studentSignupSchema),
    defaultValues: { preferredLanguage: "en", district: "Anantnag" as StudentSignupInput["district"] },
  });

  const onSubmit = async (data: StudentSignupInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await registerStudentAction(data);
      if (!res.success) {
        setError(res.error ?? "Registration failed. Please try again.");
        return;
      }
      setDone(true);
      const next = safeNext(nextParam, "/student/dashboard");
      const login = await signIn("credentials", { redirect: false, email: data.email, password: data.password });
      if (login?.error) {
        router.push(`/login?portal=student&next=${encodeURIComponent(next)}`);
        return;
      }
      window.location.assign(next);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const busy = isLoading || done;
  const err = (m?: string) => (m ? <p className="text-danger text-[13px] mt-1.5">{m}</p> : null);
  const req = <span className="text-danger" aria-hidden> *</span>;

  return (
    <AuthSplit
      active="student"
      tall
      heading="Create your student account"
      blurb="Free for every student. With an account you can book sessions with counsellors and mentors, chat with your counsellor and see your next steps."
    >
      <div>
        <h1 className="font-display text-[26px] font-extrabold text-ink mb-1.5">Student Sign Up</h1>
        <p className="text-ink-2 mb-6 text-[14px]">Fields marked <span className="text-danger">*</span> are required. It takes about 2 minutes.</p>

        {error && (
          <div role="alert" className="p-3 bg-danger-tint text-danger border border-danger/20 rounded-[12px] mb-5 text-sm">{error}</div>
        )}
        {done && !error && (
          <div role="status" className="p-3 bg-action-tint text-action border border-action/20 rounded-[12px] mb-5 text-sm">
            Account created. Signing you in…
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* About you */}
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-2">About you</p>
          <div>
            <label htmlFor="su-name" className="field-label">Full name{req}</label>
            <input id="su-name" {...register("name")} type="text" autoComplete="name" placeholder="e.g. Insha Jan"
              aria-invalid={errors.name ? true : undefined} className="field" disabled={busy} />
            {err(errors.name?.message)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="su-age" className="field-label">Age group{req}</label>
              <select id="su-age" {...register("ageRange")} defaultValue="" aria-invalid={errors.ageRange ? true : undefined} className="field" disabled={busy}>
                <option value="" disabled>Select</option>
                <option value="13-17">13 – 17 years</option>
                <option value="18-24">18 – 24 years</option>
                <option value="25+">25 years or more</option>
              </select>
              {err(errors.ageRange?.message)}
            </div>
            <div>
              <label htmlFor="su-gender" className="field-label">Gender{req}</label>
              <select id="su-gender" {...register("gender")} defaultValue="" aria-invalid={errors.gender ? true : undefined} className="field" disabled={busy}>
                <option value="" disabled>Select</option>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
              {err(errors.gender?.message)}
            </div>
          </div>

          {/* Study */}
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-2 pt-2">Your studies</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="su-grade" className="field-label">Currently studying{req}</label>
              <select id="su-grade" {...register("grade")} defaultValue="" aria-invalid={errors.grade ? true : undefined} className="field" disabled={busy}>
                <option value="" disabled>Select</option>
                {STUDY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              {err(errors.grade?.message)}
            </div>
            <div>
              <label htmlFor="su-district" className="field-label">District{req}</label>
              <select id="su-district" {...register("district")} aria-invalid={errors.district ? true : undefined} className="field" disabled={busy}>
                {JK_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {err(errors.district?.message)}
            </div>
          </div>
          <div>
            <label htmlFor="su-school" className="field-label">School / College name <span className="font-normal text-ink-2">(optional)</span></label>
            <input id="su-school" {...register("school")} type="text" placeholder="e.g. Govt. Higher Secondary School, Anantnag"
              className="field" disabled={busy} />
            {err(errors.school?.message)}
          </div>

          {/* Contact & login */}
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-2 pt-2">Contact &amp; login</p>
          <div>
            <label htmlFor="su-mobile" className="field-label">Mobile number{req}</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-[12px] border border-r-0 border-line bg-surface-alt text-ink-2 text-[14px]">+91</span>
              <input id="su-mobile" {...register("mobile")} type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" placeholder="10-digit number"
                aria-invalid={errors.mobile ? true : undefined} className="field !rounded-l-none" disabled={busy} />
            </div>
            {err(errors.mobile?.message)}
          </div>
          <div>
            <label htmlFor="su-email" className="field-label">Email{req}</label>
            <input id="su-email" {...register("email")} type="email" autoComplete="email" placeholder="you@example.com"
              aria-invalid={errors.email ? true : undefined} className="field" disabled={busy} />
            <p className="text-[12px] text-ink-2 mt-1">You&apos;ll use this email to sign in.</p>
            {err(errors.email?.message)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="su-password" className="field-label">Password{req}</label>
              <div className="relative">
                <input id="su-password" {...register("password")} type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="••••••••"
                  aria-invalid={errors.password ? true : undefined} className="field pr-11" disabled={busy} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full text-ink-2 hover:bg-hover">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {err(errors.password?.message)}
            </div>
            <div>
              <label htmlFor="su-confirm" className="field-label">Confirm password{req}</label>
              <input id="su-confirm" {...register("confirmPassword")} type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="••••••••"
                aria-invalid={errors.confirmPassword ? true : undefined} className="field" disabled={busy} />
              {err(errors.confirmPassword?.message)}
            </div>
          </div>
          <p className="text-[12px] text-ink-2 -mt-2">At least 8 characters, with one capital letter and one number.</p>

          <div>
            <span className="field-label">Preferred language</span>
            <div className="flex gap-5">
              {[{ v: "en", l: "English" }, { v: "ur", l: "اردو (Urdu)" }].map(({ v, l }) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer text-[14px] text-ink">
                  <input {...register("preferredLanguage")} type="radio" value={v} className="accent-[#0F4C81] w-4 h-4" disabled={busy} />
                  {l}
                </label>
              ))}
            </div>
          </div>

          {/* Consent */}
          <div className="rounded-[12px] border border-line bg-surface-alt p-4 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer text-[13.5px] text-ink leading-relaxed">
              <input {...register("acceptTerms")} type="checkbox" className="mt-1 w-4 h-4 accent-[#0F4C81] shrink-0" disabled={busy} />
              <span>I agree to the <Link href="/terms" target="_blank" className="text-navy font-semibold underline">Terms of Service</Link> and <Link href="/privacy" target="_blank" className="text-navy font-semibold underline">Privacy Policy</Link>.{req}</span>
            </label>
            {err(errors.acceptTerms?.message)}
            <label className="flex items-start gap-3 cursor-pointer text-[13.5px] text-ink leading-relaxed">
              <input {...register("acceptNotEmergency")} type="checkbox" className="mt-1 w-4 h-4 accent-[#0F4C81] shrink-0" disabled={busy} />
              <span>I understand this portal is not for emergencies. In an emergency I will call <strong>112</strong> or Tele-MANAS <strong>14416</strong>.{req}</span>
            </label>
            {err(errors.acceptNotEmergency?.message)}
          </div>

          <button type="submit" disabled={busy} className="btn btn-saffron w-full !min-h-[50px] !text-[15px]">
            <UserPlus className="w-5 h-5" />
            {isLoading || done ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-2">
          Already have an account?{" "}
          <Link href={nextParam ? `/login?portal=student&next=${encodeURIComponent(safeNext(nextParam, "/student/dashboard"))}` : "/login?portal=student"}
            className="font-semibold text-kashmir hover:underline underline-offset-4">Log in</Link>
        </p>
      </div>
    </AuthSplit>
  );
}
