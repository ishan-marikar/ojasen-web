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
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Events", href: "/events" },
    { name: "Healers", href: "/healers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isHomePage && !scrolled
            ? "bg-transparent py-4"
            : "bg-[#5f726b]/90 backdrop-blur-sm py-2 shadow-sm"
        }`}
      >
        {/* Desktop Navigation */}
        <div className="hidden md:flex max-w-6xl mx-auto px-6 py-2 items-center justify-between">
          {/* Left Navigation Links */}
          <nav className="flex space-x-6">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors duration-300 text-sm uppercase tracking-wider font-medium relative group ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-[#d6ddcb]"
                    : "text-white hover:text-[#d6ddcb]"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isHomePage && !scrolled ? "bg-[#d6ddcb]" : "bg-[#d6ddcb]"
                  }`}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Centered Logo */}
          <Link href="/" className="transition-all duration-300">
            <div
              className={`transition-all duration-300 flex items-center ${
                scrolled ? "h-8" : "h-12"
              }`}
            >
              <Image
                src="/images/logo-text.png"
                alt="Ojasen Healing Arts"
                width={scrolled ? 160 : 180}
                height={scrolled ? 32 : 48}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Right Navigation Links */}
          <nav className="flex space-x-6">
            {navLinks.slice(3).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors duration-300 text-sm uppercase tracking-wider font-medium relative group ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-[#d6ddcb]"
                    : "text-white hover:text-[#d6ddcb]"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isHomePage && !scrolled ? "bg-[#d6ddcb]" : "bg-[#d6ddcb]"
                  }`}
                ></span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile & Tablet Navigation */}
        <div className="md:hidden max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Hamburger Menu Button */}
          <button
            id="menu-button"
            className={`focus:outline-none transition-colors duration-300 p-2 ${
              isHomePage && !scrolled ? "text-white" : "text-white"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Centered Logo */}
          <Link
            href="/"
            className="transition-all duration-300 absolute left-1/2 transform -translate-x-1/2"
          >
            <div className="flex items-center h-8">
              <Image
                src="/images/logo-text.png"
                alt="Ojasen Healing Arts"
                width={140}
                height={40}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Placeholder for balance (empty div) */}
          <div className="w-8"></div>
        </div>
      </header>

      {/* Mobile Navigation Overlay - Moved outside header to fix positioning issue */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-[#5f726b] z-50 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden ${
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

        <nav className="flex flex-col space-y-6 items-center w-full px-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xl text-white hover:text-[#d6ddcb] transition-colors duration-300 uppercase tracking-wider font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
