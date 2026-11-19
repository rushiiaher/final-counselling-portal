"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/* Every "Book Session" button on the website opens the student app's home.
   Anyone can explore the app; when they choose to book ("Talk to a counsellor"),
   they sign in or create an account first, then fill in the booking.
   The booking is saved as a real support request that shows up in the chosen
   counsellor's Requests (or the admin's Cases for "any counsellor"). */
export const BOOK_SESSION_HREF = "/student/dashboard";

/** The concern is no longer pre-selected: the student picks it inside the app. */
export function bookSessionHref(_concern?: string) {
  return BOOK_SESSION_HREF;
}

export function useBookSession() {
  const router = useRouter();
  return useCallback((concern?: string) => router.push(bookSessionHref(concern)), [router]);
}

/* After sign-in / sign-up / onboarding, only follow `next` back into the student app. */
export function safeNext(next: string | null | undefined, fallback: string) {
  return next && /^\/student(\/|$|\?)/.test(next) && !next.startsWith("//") ? next : fallback;
}
