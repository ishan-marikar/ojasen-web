"use client";

import Link from "next/link";
import { ImageWithFallback as Image } from "@/components/shared/image-with-fallback";
import { Healer } from "@/lib/types";

export function HealerCard({ name, role, image, link }: Healer) {
  return (
    <Link
      href={link}
      className="group overflow-hidden rounded-3xl bg-white border border-[#68887d]/20 transition-all duration-500 hover:shadow-xl hover:border-[#68887d]/40 hover:-translate-y-2 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7faf6] to-white opacity-70 pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#68887d]/30 transition-all duration-500 pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0px_0px_rgba(255,255,255,0.1)] pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl shadow-[0_0_0px_1px_rgba(104,136,125,0)_inset] group-hover:shadow-[0_0_0px_1px_rgba(104,136,125,0.1)_inset] transition-all duration-500 pointer-events-none"></div>
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
      <div className="p-6 text-center relative">
        <h3 className="text-xl font-light text-[#191d18] mb-1">{name}</h3>
        <p className="text-[#68887d] text-sm uppercase tracking-wider mb-4">
          {role}
        </p>
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="text-xs uppercase tracking-wider text-[#68887d] border border-[#68887d]/40 rounded-full px-4 py-2 hover:bg-[#68887d] hover:text-white transition-colors duration-300 min-h-[44px]">
            View Profile
          </button>
        </div>
      </div>
    </Link>
  );
}
