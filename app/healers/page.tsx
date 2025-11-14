"use client";

import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

function Hero() {
  return (
    <div
      className="w-full flex flex-col items-center justify-top min-h-screen py-2 pt-28 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/hero-background.JPG')" }}
    >
      <div className="bg-black/30 backdrop-blur-sm w-full h-full flex flex-col items-center justify-center py-20 px-4">
        <div className="text-sm uppercase text-[#191d18] font-medium tracking-wider">
          Our Healers
        </div>
        <h1 className="mx-3 text-4xl sm:text-5xl text-[#191d18] pt-4 text-center">
          Meet our experienced healers
        </h1>

        {/* Floating flowers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Background layer - subtle, more blurred */}
          <div className="absolute top-1/3 left-1/6 animate-float-slow animation-delay-0 depth-layer-1">
            <Image
              src="/images/hero/flower02.png"
              alt="Floating Flower"
              width={48}
              height={48}
              className="opacity-30 blur-[1px]"
            />
          </div>
          <div className="absolute top-1/4 right-1/5 animate-float-reverse animation-delay-2000 depth-layer-1">
            <Image
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              width={36}
              height={36}
              className="opacity-25 blur-[1.5px]"
            />
          </div>

          {/* Middle layer - medium visibility, medium blur */}
          <div className="absolute top-2/5 left-4/5 animate-float animation-delay-1000 depth-layer-2">
            <Image
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              width={52}
              height={52}
              className="opacity-50 blur-[0.5px]"
            />
          </div>

          {/* Foreground layer - clearer, less blurred */}
          <div className="absolute top-3/5 left-1/3 animate-float-diagonal animation-delay-3000 depth-layer-3">
            <Image
              src="/images/hero/flower02.png"
              alt="Floating Flower"
              width={60}
              height={60}
              className="opacity-70"
            />
          </div>
          <div className="absolute top-1/6 right-1/4 animate-float-scale animation-delay-4000 depth-layer-3">
            <Image
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              width={44}
              height={44}
              className="opacity-60 blur-[0.25px]"
            />
          </div>
        </div>

        <div className="text-[#525A52] text-center mt-8 text-lg tracking-wide max-w-3xl mx-auto px-4">
          Our skilled practitioners bring years of expertise and a deep
          understanding of holistic wellness to guide your journey.
        </div>
      </div>
    </div>
  );
}

function Healers() {
  const healers = [
    {
      name: "Oshadi",
      role: "Sound Healer",
      image: "/images/healers/oshadi.png",
      link: "/healers/oshadi",
    },
    {
      name: "Alice",
      role: "Yoga Instructor",
      image: "/images/healers/alice.png",
      link: "/healers/alice",
    },
    {
      name: "Deborah",
      role: "Energy Healer",
      image: "/images/healers/deborah.png",
      link: "/healers/deborah",
    },
  ];

  return (
    <div className="bg-[#f7faf6] pt-20 pb-24 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Background layer - subtle, more blurred */}
        <div className="absolute top-1/4 left-1/12 animate-float-slow animation-delay-0 depth-layer-1">
          <Image
            src="/images/hero/flower02.png"
            alt="Floating Flower"
            width={48}
            height={48}
            className="opacity-10 blur-[1px]"
          />
        </div>
        <div className="absolute top-1/3 right-1/12 animate-float-reverse animation-delay-2000 depth-layer-1">
          <Image
            src="/images/hero/flower03.png"
            alt="Floating Flower"
            width={36}
            height={36}
            className="opacity-10 blur-[1.5px]"
          />
        </div>

        {/* Middle layer - medium visibility, medium blur */}
        <div className="absolute top-2/5 left-4/5 animate-float animation-delay-1000 depth-layer-2">
          <Image
            src="/images/hero/flower03.png"
            alt="Floating Flower"
            width={52}
            height={52}
            className="opacity-15 blur-[0.5px]"
          />
        </div>

        {/* Foreground layer - clearer, less blurred */}
        <div className="absolute bottom-1/4 left-1/3 animate-float-diagonal animation-delay-3000 depth-layer-3">
          <Image
            src="/images/hero/flower02.png"
            alt="Floating Flower"
            width={60}
            height={60}
            className="opacity-20"
          />
        </div>
        <div className="absolute bottom-1/3 right-1/4 animate-float-scale animation-delay-4000 depth-layer-3">
          <Image
            src="/images/hero/flower03.png"
            alt="Floating Flower"
            width={44}
            height={44}
            className="opacity-15 blur-[0.25px]"
          />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm uppercase font-medium tracking-wider text-primary">
            Our Healers
          </span>
          <h2 className="text-3xl font-light mt-2 mb-4 text-[#191d18]">
            Experienced wellness practitioners
          </h2>
          <p className="text-[#525A52] max-w-2xl mx-auto text-lg">
            Each of our healers brings unique expertise and a deep commitment to
            your wellness journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {healers.map((healer, index) => (
            <HealerCard
              key={index}
              name={healer.name}
              role={healer.role}
              image={healer.image}
              link={healer.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HealerCard({
  name,
  role,
  image,
  link,
}: {
  name: string;
  role: string;
  image: string;
  link: string;
}) {
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
          <button className="text-xs uppercase tracking-wider text-[#68887d] border border-[#68887d]/40 rounded-full px-4 py-2 hover:bg-[#68887d] hover:text-white transition-colors duration-300">
            View Profile
          </button>
        </div>
      </div>
    </Link>
  );
}

function Footer() {
  return (
    <div className="bg-[#2b332d] text-[#dbeade] pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-sans">Ojasen Healing Arts</h3>
            <p className="text-[#c4c9c4] text-lg leading-relaxed">
              Your sanctuary for holistic wellness and transformative healing
              experiences.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-[#c4c9c4] hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#c4c9c4] hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#c4c9c4] hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-sans">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-xl font-sans">Services</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/services/yoga-meditation"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Yoga & Meditation
                </a>
              </li>
              <li>
                <a
                  href="/services/sound-healing"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Sound Healing
                </a>
              </li>
              <li>
                <a
                  href="/services/energy-healing"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Energy Healing
                </a>
              </li>
              <li>
                <a
                  href="/services/breathwork"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Breathwork
                </a>
              </li>
              <li>
                <a
                  href="/services/wellness-retreats"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Wellness Retreats
                </a>
              </li>
              <li>
                <a
                  href="/services/ice-bath-breathwork"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Ice Bath & Breathwork
                </a>
              </li>
              <li>
                <a
                  href="/services/ecstatic-dancing"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Ecstatic Dancing
                </a>
              </li>
              <li>
                <a
                  href="/services/singing-circle"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Singing Circle
                </a>
              </li>
              <li>
                <a
                  href="/services/kakou-healing-ceremony"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Kakou Healing Ceremony
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xl font-sans">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#68887d] mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-[#c4c9c4] text-lg">
                  The Island, Palliyagoda, Ahangama, 80650
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-[#68887d] mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-[#c4c9c4] text-lg">
                  <a href="tel:+94762777482">+94 076 277 7482</a>
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-[#68887d] mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[#c4c9c4] text-lg">
                  <a href="mailto:info@ojasenhealingarts.com">
                    info@ojasenhealingarts.com
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#68887d]/30 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#c4c9c4] text-lg">
              &copy; {new Date().getFullYear()} Ojasen Healing Arts. All rights
              reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HealersPage() {
  return (
    <>
      <Navigation />
      <div className="">
        <Hero />
        <Healers />
      </div>
      <Footer />
    </>
  );
}
