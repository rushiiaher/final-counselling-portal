"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/* Every "Book Session" button on the website goes to the student app's
   "Talk to a counsellor" flow, which saves a real support request that
   shows up in the admin's Cases and the chosen counsellor's Requests. */
export const BOOK_SESSION_HREF = "/student/talk";

/** Optional pre-selected concern: career | exam | studies | wellbeing | scholarship | personal */
export function bookSessionHref(concern?: string) {
  return concern ? `${BOOK_SESSION_HREF}?concern=${encodeURIComponent(concern)}` : BOOK_SESSION_HREF;
}

export function useBookSession() {
  const router = useRouter();
  return useCallback((concern?: string) => router.push(bookSessionHref(concern)), [router]);
}

/* After sign-in / sign-up / onboarding, only follow `next` back into the student app. */
export function safeNext(next: string | null | undefined, fallback: string) {
  return next && /^\/student(\/|$|\?)/.test(next) && !next.startsWith("//") ? next : fallback;
}
