"use client";

import Link from "next/link";
import { Service } from "@/lib/types";

export function ServiceCard({ title, description, icon, link }: Service) {
  return (
    <Link
      href={link}
      className="group bg-white rounded-4xl border border-primary/20 transition-all duration-300 hover:shadow-xl hover:border-primary/40 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={icon}
            alt={title}
            width={60}
            height={60}
            className="rounded-lg mr-4"
          />
          <h3 className="text-lg sm:text-xl font-light text-[#191d18] group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
        </div>
        <p className="text-[#525A52] text-sm sm:text-base mb-4">
          {description}
        </p>
        <div className="text-primary font-medium cursor-pointer hover:text-[#2b332d] transition-all duration-300 inline-flex items-center group min-h-[44px]">
          Learn More
          <svg
            className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
