"use client";

import React, { useState, useEffect, use } from "react";
import PageContainer from "@/components/shared/PageContainer";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { fetchAvailableSlots, bookSlotAction } from "@/app/actions/scheduling.actions";
import { Feedback } from "@/lib/feedback";
import { useRouter } from "next/navigation";

export default function BookAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: counsellorId } = use(params);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<{start: string, end: string}[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{start: string, end: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [mode, setMode] = useState<"VIDEO" | "IN_PERSON">("VIDEO");

  useEffect(() => {
    if (!selectedDate) return;
    setSelectedSlot(null);
    setIsLoading(true);
    
    // Server action dynamic slots fetching
    fetchAvailableSlots(counsellorId, selectedDate.toISOString())
      .then(res => {
        if (res.success) setSlots(res.slots || []);
        else Feedback.error(res.error || "Failed to load slots");
      })
      .finally(() => setIsLoading(false));
  }, [selectedDate, counsellorId]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setIsBooking(true);
    try {
      const res = await bookSlotAction({
        counsellorId,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        mode
      });
      if (res.success) {
        Feedback.success("Appointment Confirmed!");
        router.push("/student/appointments");
      } else {
        Feedback.error(res.error || "Slot may have just been booked. Try another.");
      }
    } catch (err) {
      Feedback.error("An error occurred");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-[1200px] mx-auto py-6 md:py-8">
        <h1 className="font-display text-h2 md:text-h1 font-bold text-ink mb-6">Schedule Session</h1>

        <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-[auto_minmax(0,1fr)_320px] items-start">
          {/* Calendar Picker */}
          <div className="ui-card p-5">
            <h3 className="font-display font-semibold text-ink text-base mb-4">1. Select Date</h3>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={[{ before: new Date() }]}
              className="flex justify-center"
              modifiersClassNames={{
                selected: 'bg-navy text-white hover:bg-navy-hover rounded-full',
                today: 'text-action font-bold'
              }}
            />
          </div>

          {/* Slot Picker */}
          <div className="ui-card p-5">
            <h3 className="font-display font-semibold text-ink text-base mb-4">2. Select Time (Local Time)</h3>

            {isLoading ? (
              <div aria-busy="true">
                <p className="text-ink-2 text-sm mb-3">Finding available slots...</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} aria-hidden className="h-11 rounded-full bg-muted animate-pulse" />
                  ))}
                </div>
              </div>
            ) : slots.length === 0 ? (
              <p className="text-ink-2 text-[0.9375rem] p-4 bg-page rounded-[12px] border border-dashed border-line text-center">
                No slots available on this date.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[340px] overflow-y-auto pr-1">
                {slots.map((s, i) => {
                  const dateObj = new Date(s.start);
                  const isSelected = selectedSlot?.start === s.start;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedSlot(s)}
                      aria-pressed={isSelected}
                      className={`h-11 px-3 text-sm font-semibold rounded-full border transition-colors duration-150 ${
                        isSelected
                          ? 'bg-navy text-white border-navy'
                          : 'bg-surface text-ink border-line hover:bg-tint hover:border-tint'
                      }`}
                    >
                      {format(dateObj, "h:mm a")}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary + confirm (sticky on desktop) */}
          {selectedSlot && (
            <div className="ui-card p-5 md:col-span-2 lg:col-span-1 lg:sticky lg:top-6">
              <h3 className="font-display font-semibold text-ink text-base mb-3">3. Session Mode</h3>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="field mb-4"
              >
                <option value="VIDEO">Video Call (Secure Room)</option>
                <option value="IN_PERSON">In-Person (Center)</option>
              </select>

              <button
                onClick={handleBook}
                disabled={isBooking}
                className="btn btn-action w-full"
              >
                {isBooking ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
