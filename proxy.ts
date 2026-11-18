import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { redis } from './lib/redis';

// Fallback in-memory rate limit store if Redis isn't configured (Not for production horizontal scale)
const fallbackRateLimitMap = new Map<string, { count: number, timestamp: number }>();

// We define our routes that require protection
const staffRoutes = ["/staff"];
const adminRoutes = ["/admin"];
const studentRoutes = ["/student"];

// Student app screens anyone can open without signing in
const PUBLIC_STUDENT_APP = [
  "/student/dashboard", "/student/careers", "/student/roadmap", "/student/scholarships",
  "/student/eligibility", "/student/exams", "/student/skills", "/student/schemes",
  "/student/mentors", "/student/stories", "/student/more", "/student/about",
  "/student/talk", "/student/sessions",
];
function isPublicStudentPath(pathname: string) {
  return pathname === "/student" || PUBLIC_STUDENT_APP.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function proxy(req: NextRequest) {
  // 0. Correlation ID for Request Tracing
  const correlationId = crypto.randomUUID();
  const requestStartTime = Date.now();

  // 1. Distributed Rate Limiting
  // On Vercel the first x-forwarded-for entry is the visitor's real IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = req.nextUrl.pathname.startsWith('/api') ? 30 : 60;

  if (redis) {
    try {
      const redisKey = `ratelimit:${ip}`;
      const [response] = await redis.pipeline()
        .incr(redisKey)
        .expire(redisKey, 60)
        .exec();

      const currentCount = response as number;
      if (currentCount > maxRequests) {
        return new NextResponse("Too Many Requests. Please slow down.", { status: 429 });
      }
    } catch (error) {
      console.error("Redis Rate Limit Error:", error);
    }
  } else {
    const rlData = fallbackRateLimitMap.get(ip);
    if (rlData) {
      if (now - rlData.timestamp > windowMs) {
        fallbackRateLimitMap.set(ip, { count: 1, timestamp: now });
      } else {
        rlData.count++;
        if (rlData.count > maxRequests) {
          return new NextResponse("Too Many Requests. Please slow down.", { status: 429 });
        }
      }
    } else {
      if (fallbackRateLimitMap.size > 10000) fallbackRateLimitMap.clear();
      fallbackRateLimitMap.set(ip, { count: 1, timestamp: now });
    }
  }

  // 2. Pass locale from cookie to next-intl via request header
  // (next-intl reads X-NEXT-INTL-LOCALE in i18n/request.ts via getLocale())
  const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en';
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('X-NEXT-INTL-LOCALE', locale);

  // 3. Perform Auth checks
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuth = !!token;
  const role = token?.role as string | undefined;

  // Protect Admin Routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuth) return NextResponse.redirect(new URL("/login", req.url));
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Protect Staff Routes
  if (staffRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuth) return NextResponse.redirect(new URL("/login", req.url));
    if (role !== "COUNSELLOR" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // The student app (careers, scholarships, exams, AI counsellor …) is open to everyone.
  // Booking / "My sessions" pages are public too but ask guests to sign in on-page.
  const publicStudentApp = isPublicStudentPath(pathname);

  // Protect Student Routes (account pages: requests, programs, notifications, onboarding …)
  if (studentRoutes.some(route => pathname.startsWith(route)) && !publicStudentApp) {
    if (!isAuth) return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users away from auth pages
  // …unless they picked a different portal on the homepage (e.g. signed in as admin,
  // clicked "Counsellor") — then show the sign-in page so they can switch accounts.
  const PORTAL_ROLE: Record<string, string> = { student: "STUDENT", counsellor: "COUNSELLOR", admin: "ADMIN" };
  const wantedRole = PORTAL_ROLE[req.nextUrl.searchParams.get("portal") ?? ""];
  const switchingPortal = pathname === "/login" && !!wantedRole && wantedRole !== role;
  if (isAuth && !switchingPortal && ["/login", "/signup", "/forgot-password"].includes(pathname)) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    if (role === "COUNSELLOR") return NextResponse.redirect(new URL("/staff/dashboard", req.url));
    // students go back to where they were heading (e.g. the booking page), else their app home
    const next = req.nextUrl.searchParams.get("next");
    const dest = next && /^\/student(\/|$|\?)/.test(next) && !next.startsWith("//") ? next : "/student/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // Require onboarding for students
  if (isAuth && role === "STUDENT" && !token?.profileCompleted && pathname.startsWith("/student") && !pathname.includes("/onboarding") && !publicStudentApp) {
    return NextResponse.redirect(new URL("/student/onboarding/step-1", req.url));
  }

  // 4. Apply Strict Security Headers
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  // Set locale cookie so browser retains it
  res.cookies.set('NEXT_LOCALE', locale, { path: '/', sameSite: 'lax' });

  res.headers.set("Content-Security-Policy", cspHeader);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Correlation-ID", correlationId);
  res.headers.set("X-Response-Time", `${Date.now() - requestStartTime}ms`);

  return res;
}

export const config = {
  // Skip static files (images, fonts, styles, scripts) so a single page view with many
  // images doesn't use up the visitor's rate limit or break the page's images.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|webp|gif|svg|ico|avif|woff2?|ttf|css|js|map|txt|xml|pdf)$).*)"],
};
