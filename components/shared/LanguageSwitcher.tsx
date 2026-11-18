"use client";
import React from 'react';

export default function LanguageSwitcher() {
  return (
    <div className="inline-flex items-center gap-0.5 p-[3px] rounded-full bg-surface-alt border border-line text-[12.5px]" role="group" aria-label="Language">
      <button className="px-3 h-7 rounded-full bg-surface text-navy font-semibold shadow-sm">English</button>
      <button className="px-3 h-7 rounded-full text-ink-2 font-medium hover:text-navy" lang="ur">اردو</button>
    </div>
  );
}
