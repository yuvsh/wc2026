"use client";

import type { ReactElement } from "react";

const COPY = {
  heading: "אין חיבור לאינטרנט",
  body: "בדוק את החיבור שלך ונסה שוב. הניחושים שלך שמורים.",
  retry: "נסה שוב",
};

export default function OfflinePage(): ReactElement {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] px-6 text-center gap-6">
      <span aria-hidden="true" className="text-6xl">📶</span>
      <div className="flex flex-col gap-2">
        <h1 className="text-[22px] font-bold text-[#111827]">{COPY.heading}</h1>
        <p className="text-[15px] text-[#6B7280] max-w-xs">{COPY.body}</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="h-[44px] px-8 rounded-xl bg-[#0D9488] text-white text-[15px] font-bold active:opacity-80 transition-opacity"
      >
        {COPY.retry}
      </button>
    </div>
  );
}
