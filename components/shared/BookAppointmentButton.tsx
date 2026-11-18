import Link from "next/link";
import { bookSessionHref } from "@/lib/booking";

/* Goes to the student app's "Talk to a counsellor" booking flow. */
export default function BookAppointmentButton({
  className = "",
  label = "Book Appointment",
  concern,
}: {
  className?: string;
  label?: string;
  concern?: string;
}) {
  return (
    <Link href={bookSessionHref(concern)} className={className}>
      {label}
    </Link>
  );
}
