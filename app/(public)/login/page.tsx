"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth.schema";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthSplit from "@/components/shared/AuthSplit";
import { LogIn } from "lucide-react";
import { safeNext } from "@/lib/booking";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  // Which "Access your portal" card brought the user here (design: portal-auth.jsx → LoginScreen)
  const portal = searchParams.get("portal");
  const PORTAL_COPY: Record<string, { heading: string; blurb: string }> = {
    student: { heading: "Student Portal", blurb: "Book counselling, talk to your counsellor, track your next steps and explore careers — all in one place." },
    counsellor: { heading: "Counsellor Portal", blurb: "Manage your caseload, run sessions, record notes and set follow-ups for the students you guide." },
    admin: { heading: "District Admin Portal", blurb: "Monitor participation across every institution, track counselling demand and plan district programs." },
  };
  const ROLE_NAME: Record<string, string> = { STUDENT: "student", COUNSELLOR: "counsellor", ADMIN: "District Admin", PARENT: "parent" };
  const wantedRole = ({ student: "STUDENT", counsellor: "COUNSELLOR", admin: "ADMIN" } as Record<string, string>)[portal ?? ""];
  const { data: current } = useSession();
  const currentRole = (current?.user as any)?.role as string | undefined;
  const portalCopy = (portal && PORTAL_COPY[portal]) || {
    heading: "Staff sign in",
    blurb: "For Center counsellors and the District Administration. You'll be taken to your own dashboard automatically.",
  };

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        const session = await fetch("/api/auth/session").then(r => r.json());
        const role = session?.user?.role;
        // Came from a portal card? The account must belong to that portal.
        if (wantedRole && role !== wantedRole) {
          await signOut({ redirect: false });
          setError(`This is a ${ROLE_NAME[role] ?? "different"} account. Please sign in with a ${ROLE_NAME[wantedRole]} account to open the ${portalCopy.heading}.`);
          return;
        }
        // full navigation so the new session is picked up everywhere
        const dest =
          role === "ADMIN" ? "/admin/dashboard" :
          role === "COUNSELLOR" ? "/staff/dashboard" :
          safeNext(searchParams.get("next"), "/student/dashboard");
        window.location.assign(dest);
        return;
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplit
      heading={portalCopy.heading}
      blurb={portalCopy.blurb}
      active={portal}
    >
      <div>
        <h1 className="font-display text-[26px] font-extrabold text-ink mb-1.5">Welcome Back</h1>
        <p className="text-[14px] text-ink-2 mb-6">Sign in with your registered email and password.</p>

        {wantedRole && currentRole && currentRole !== wantedRole && !error && (
          <div role="status" className="p-3 bg-saffron-tint text-warning border border-saffron/30 rounded-[12px] mb-5 text-sm">
            You&apos;re signed in as a {ROLE_NAME[currentRole] ?? "different"} user. Sign in with a {ROLE_NAME[wantedRole]} account to switch.
          </div>
        )}

        {error && (
          <div role="alert" className="p-3 bg-danger-tint text-danger border border-danger/20 rounded-[12px] mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="field-label">Email</label>
            <input 
              {...register("email")}
              id="login-email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              aria-invalid={errors.email ? true : undefined}
              className="field"
              disabled={isLoading}
            />
            {errors.email && <p className="text-danger text-[13px] mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="login-password" className="field-label !mb-0">Password</label>
              <Link href="/forgot-password" className="text-[13px] font-medium text-navy hover:underline underline-offset-4">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                {...register("password")}
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={errors.password ? true : undefined}
                className="field pr-11"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full text-ink-2 hover:bg-hover transition-colors duration-150"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-danger text-[13px] mt-1.5">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn btn-kashmir w-full !min-h-[50px] !text-[15px] mt-2"
          >
            <LogIn className="w-5 h-5" />
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {portal === "student" ? (
        <p className="mt-6 text-center text-sm text-ink-2">
          Don't have an account? <Link href={searchParams.get("next") ? `/signup?next=${encodeURIComponent(safeNext(searchParams.get("next"), "/student/dashboard"))}` : "/signup"} className="font-semibold text-navy hover:underline underline-offset-4">Sign up</Link>
        </p>
        ) : (
        <p className="mt-6 text-center text-sm text-ink-2">
          Student? <Link href="/student/dashboard" className="font-semibold text-navy hover:underline underline-offset-4">Open the Student app</Link>. No sign-in is needed to explore it.
        </p>
        )}
      </div>
    </AuthSplit>
  );
}
