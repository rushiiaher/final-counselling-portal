import React from 'react';
import { LifeBuoy } from 'lucide-react';

export default function CrisisButton() {
  return (
    <div className="fixed right-4 bottom-[88px] md:bottom-6 md:right-6 z-40">
      <button className="bg-danger hover:bg-[#991B1B] text-white font-bold text-[13.5px] h-11 pl-4 pr-5 rounded-full shadow-[0_10px_24px_rgb(185_28_28/0.35)] flex items-center gap-2 ring-4 ring-white/70 transition-colors">
        <LifeBuoy className="w-[18px] h-[18px]" /> Get Help Now
      </button>
    </div>
  );
}
