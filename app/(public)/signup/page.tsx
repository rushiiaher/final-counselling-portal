"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "@/lib/validations/auth.schema";
import { registerAction } from "@/app/actions/auth.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthSplit from "@/components/shared/AuthSplit";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await registerAction(data);
      if (res.success) {
        setSuccess(res.message!);
        const next = new URLSearchParams(window.location.search).get("next");
        setTimeout(() => router.push(next ? `/login?portal=student&next=${encodeURIComponent(next)}` : "/login?portal=student"), 2000);
      } else {
        setError(res.error!);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplit
      heading="Register for free"
      blurb="Create your account to request counselling, book sessions and join district programs. All services are free and confidential."
    >
      <div>
        <h1 className="font-display text-[26px] font-extrabold text-ink mb-1.5">Create an Account</h1>
        <p className="text-ink-2 mb-6 text-[14px]">Join the counselling portal to get started.</p>
        
        {error && (
          <div className="p-3 bg-danger-tint text-danger border border-danger/20 rounded-[12px] mb-5 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-action-tint text-action border border-action/20 rounded-[12px] mb-5 text-sm">
            {success} Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="field-label">Full Name</label>
            <input 
              {...register("name")}
              type="text"
              placeholder="John Doe"
              className="field"
              disabled={isLoading || !!success}
            />
            {errors.name && <p className="text-danger text-[13px] mt-1.5">{errors.name.message}</p>}
          </div>

          <div>
            <label className="field-label">Email</label>
            <input 
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="field"
              disabled={isLoading || !!success}
            />
            {errors.email && <p className="text-danger text-[13px] mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="field-label">Password</label>
            <input 
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="field"
              disabled={isLoading || !!success}
            />
            {errors.password && <p className="text-danger text-[13px] mt-1.5">{errors.password.message}</p>}
          </div>

          <div>
            <label className="field-label">Confirm Password</label>
            <input 
              {...register("confirmPassword")}
              type="password"
              placeholder="••••••••"
              className="field"
              disabled={isLoading || !!success}
            />
            {errors.confirmPassword && <p className="text-danger text-[13px] mt-1.5">{errors.confirmPassword.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !!success}
            className="btn btn-saffron w-full !min-h-[50px] !text-[15px] mt-2"
          >
            <UserPlus className="w-5 h-5" />
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-2">
          Already have an account? <Link href="/login" className="font-semibold text-kashmir hover:underline underline-offset-4">Log in</Link>
        </p>
      </div>
    </AuthSplit>
  );
}
