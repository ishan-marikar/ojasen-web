"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Check if we're on the home page
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside or when route changes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const menu = document.getElementById("menu");
      const menuButton = document.getElementById("menu-button");

      if (
        isOpen &&
        menu &&
        menuButton &&
        !menu.contains(event.target as Node) &&
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

  // Close menu when route changes
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

  // Determine which logo to show based on scroll state and page context
  const getLogoSrc = () => {
    // Always use the text logo for consistency
    return "/images/logo-text.png";
  };

  // Determine logo dimensions - now consistent across all states
  const getLogoDimensions = () => {
    // Use consistent dimensions for all pages and states
    return { width: 160, height: 32 };
  };

  const logoSrc = getLogoSrc();
  const { width, height } = getLogoDimensions();

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isHomePage && !scrolled
            ? "bg-transparent py-4"
            : "bg-primary/90 backdrop-blur-sm py-2 shadow-sm"
        }`}
      >
        {/* Desktop Navigation */}
        <div className="hidden md:flex max-w-6xl mx-auto px-6 py-2 items-center justify-between">
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
            <div
              className={`transition-all duration-300 flex items-center h-8`}
            >
              <img
                src={logoSrc}
                alt="Ojasen Healing Arts"
                width={width}
                height={height}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Authentication Icons */}
          <div className="flex items-center">
            {session ? (
              <Link
                href="/dashboard"
                className={`transition-colors duration-300 p-2 ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-accent"
                    : "text-white hover:text-accent"
                }`}
              >
                <User size={20} />
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className={`transition-colors duration-300 p-2 ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-accent"
                    : "text-white hover:text-accent"
                }`}
              >
                <User size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
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
            <div className="flex items-center h-8 ">
              <img
                src={logoSrc}
                alt="Ojasen Healing Arts"
                width={width}
                height={height}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Authentication Icons */}
          <div className="flex items-center">
            {session ? (
              <Link
                href="/dashboard"
                className={`transition-colors duration-300 p-2 ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-accent"
                    : "text-white hover:text-accent"
                }`}
              >
                <User size={20} />
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className={`transition-colors duration-300 p-2 ${
                  isHomePage && !scrolled
                    ? "text-white hover:text-accent"
                    : "text-white hover:text-accent"
                }`}
              >
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Menu Overlay - Same for both mobile and desktop */}
      <div
        id="menu"
        className={`fixed inset-0 bg-primary z-50 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
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
              className="text-xl text-white hover:text-accent transition-colors duration-300 uppercase tracking-wider font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Authentication Links */}
          {session ? (
            <Link
              href="/dashboard"
              className="text-xl text-white hover:text-accent transition-colors duration-300 uppercase tracking-wider font-medium flex items-center mt-4"
              onClick={() => setIsOpen(false)}
            >
              <User size={20} className="mr-2" />
              Account
            </Link>
          ) : (
            <div className="flex flex-col space-y-4 mt-4">
              <Link
                href="/sign-in"
                className="text-xl text-white hover:text-accent transition-colors duration-300 uppercase tracking-wider font-medium px-6 py-3 border border-white/30 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-xl  hover:text-accent transition-colors duration-300 uppercase tracking-wider font-medium px-6 py-3 bg-white text-primary rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
