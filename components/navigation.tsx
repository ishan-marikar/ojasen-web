"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ImageWithFallback as Image } from "@/components/shared/image-with-fallback";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Check if we're on the home page
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside or when route changes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const mobileMenu = document.getElementById("mobile-menu");
      const menuButton = document.getElementById("menu-button");

      if (
        isOpen &&
        mobileMenu &&
        menuButton &&
        !mobileMenu.contains(event.target as Node) &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Events", href: "/events" },
    { name: "Healers", href: "/healers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isHomePage
          ? scrolled
            ? "bg-[#5f726b]/90 backdrop-blur-sm py-3 shadow-sm"
            : "bg-transparent py-6"
          : "bg-[#5f726b]/90 backdrop-blur-sm py-3 shadow-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="transition-all duration-300">
          <div
            className={`transition-all duration-300 flex items-center ${
              scrolled ? "h-10" : "h-16"
            }`}
          >
            <Image
              src="/images/logo-text.png"
              alt="Ojasen Healing Arts"
              width={scrolled ? 120 : 200}
              height={scrolled ? 40 : 64}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors duration-300 text-sm uppercase tracking-wider font-medium relative group ${
                scrolled || !isHomePage
                  ? "text-white hover:text-[#d6ddcb]"
                  : "text-white hover:text-[#d6ddcb]"
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  scrolled || !isHomePage ? "bg-[#d6ddcb]" : "bg-[#d6ddcb]"
                }`}
              ></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          id="menu-button"
          className={`md:hidden focus:outline-none transition-colors duration-300 p-2 ${
            scrolled || !isHomePage ? "text-white" : "text-white"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`fixed inset-0 bg-[#f7faf6] z-50 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
          role="dialog"
          aria-modal="true"
          aria-hidden={!isOpen}
        >
          <button
            className="absolute top-6 right-6 text-white p-2"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>

          <nav className="flex flex-col space-y-8 items-center w-full px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl text-white hover:text-[#d6ddcb] transition-colors duration-300 uppercase tracking-wider font-medium py-2 px-4"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
