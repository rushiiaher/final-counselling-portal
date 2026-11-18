/* Weekly availability grid (design: desk-counsellor.jsx → CoAvailability).
   Shown as in the design; stored in 24-hour time. Shared by server + client. */
export const SLOT_TIMES = [
  { label: "09:30", value: "09:30" }, { label: "10:30", value: "10:30" }, { label: "11:30", value: "11:30" }, { label: "12:30", value: "12:30" },
  { label: "02:00", value: "14:00" }, { label: "03:00", value: "15:00" }, { label: "04:00", value: "16:00" }, { label: "05:00", value: "17:00" },
];

export const SLOT_DAYS = [
  { label: "Mon", dow: 1 }, { label: "Tue", dow: 2 }, { label: "Wed", dow: 3 },
  { label: "Thu", dow: 4 }, { label: "Fri", dow: 5 }, { label: "Sat", dow: 6 },
];
