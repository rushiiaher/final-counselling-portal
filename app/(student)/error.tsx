"use client";
import ErrorState from "@/components/shared/ErrorState";

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return <ErrorState message="Something went wrong while loading this page. Please try again." onRetry={reset} />;
}
