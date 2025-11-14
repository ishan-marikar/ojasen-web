"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Events", href: "/events" },
    { name: "Booking", href: "/booking" },
    { name: "Healers", href: "/healers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#f7faf6]/90 backdrop-blur-sm py-3 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="transition-all duration-300">
          <div className={`transition-all duration-300 ${scrolled ? 'w-10 h-10' : 'w-16 h-16'}`}>
            <Image
              src="/images/logo.png"
              alt="Ojasen Healing Arts"
              width={scrolled ? 40 : 64}
              height={scrolled ? 40 : 64}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors duration-300 text-sm uppercase tracking-wider font-medium relative group ${
                scrolled 
                  ? "text-[#191d18] hover:text-[#68887d]" 
                  : "text-white hover:text-[#d6ddcb]"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                scrolled ? "bg-[#68887d]" : "bg-[#d6ddcb]"
              }`}></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden focus:outline-none transition-colors duration-300 ${
            scrolled ? "text-[#191d18]" : "text-white"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <div
          className={`fixed inset-0 bg-[#f7faf6] z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <button
            className="absolute top-6 right-6 text-[#191d18]"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>

          <nav className="flex flex-col space-y-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl text-[#191d18] hover:text-[#68887d] transition-colors duration-300 uppercase tracking-wider font-medium"
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