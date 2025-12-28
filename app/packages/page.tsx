"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ImageWithFallback as Image } from "@/components/shared/image-with-fallback";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { trackNavigation, trackCTA } from "@/lib/analytics";
import { NavigationNew } from "../page";

export default function () {
  return (
    <>
      <NavigationNew
        forceTransparent
        logoSrc="/images/logo-full.png"
        logoWidth={100}
        logoHeight={100}
      />
      <Schedule />

    </>
  );
}

function Schedule() {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center min-h-screen relative">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/packages.jpg"
            alt="Ojasen Healing Arts Sanctuary"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute inset-0 "></div>
        {/* <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-16 sm:py-20 px-4">
          <img src="/images/schedule-overlay.png" />
        </div> */}
      </div>
    </>
  );
}
