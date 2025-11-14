"use client";

import type { BenefitItem } from "@/lib/types";

export function BenefitItem({ title, description }: BenefitItem) {
  return (
    <div className="flex items-start">
      <div className="bg-[#68887d] rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <div>
        <h4 className="text-lg font-medium mb-2">{title}</h4>
        <p className="text-[#525A52]">{description}</p>
      </div>
    </div>
  );
}
