import { unstable_rethrow } from "next/navigation";

/**
 * Turns any error caught in a server action into a message that is safe to show
 * to a student / counsellor / admin. Technical details (database errors, stack
 * traces, file paths) are logged on the server only, never sent to the browser.
 * Next.js redirects (e.g. "please sign in") are re-thrown so they keep working.
 */
export function userErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  unstable_rethrow(err);

  const name = (err as { constructor?: { name?: string } })?.constructor?.name ?? "";
  const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "";
  console.error("[action error]", err);

  if (/PrismaClientInitializationError/.test(name) || /Can't reach database|ECONNREFUSED|ETIMEDOUT|Connection terminated/i.test(msg)) {
    return "The service is temporarily unavailable. Please try again in a few minutes.";
  }
  if (/^PrismaClient/.test(name) || /prisma|invocation|__TURBOPACK|\bat\s+\S+\s\(/i.test(msg)) return fallback;
  // keep short, deliberate messages ("Students only", "Pick a slot first."), hide anything else
  if (!msg || msg.length > 160 || msg.includes("\n")) return fallback;
  return msg;
}
