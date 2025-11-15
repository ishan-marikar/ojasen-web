"use client";

import { Session } from "@/lib/types";

export function SessionCard({ title, duration, description }: Session) {
  return (
    <div className="bg-[#3a423b] p-6 rounded-4xl border border-primary/30">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg sm:text-xl">{title}</h3>
        <span className="text-[#c4c9c4] bg-[#2b332d] px-3 py-1 rounded-full text-xs sm:text-sm">
          {duration}
        </span>
      </div>
      <p className="text-[#c4c9c4] text-sm sm:text-base">{description}</p>
    </div>
  );
}
