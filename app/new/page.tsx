"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ImageWithFallback as Image } from "@/components/shared/image-with-fallback";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { trackNavigation } from "@/lib/analytics";

export default function () {
  return (
    <>
      <NavigationNew
        forceTransparent
        logoSrc="/images/logo-full.png"
        logoWidth={100}
        logoHeight={100}
      />
      <Hero />
      {/* <FloodRelief /> */}
      {/* <About /> */}
      {/* <Ceremonies /> */}
      {/* <Schedule /> */}
      {/* <EventsSection /> */}
      {/* <LocationMap /> */}
      {/* <Footer /> */}
    </>
  );
}

function Hero() {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center min-h-screen relative">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/hero-header.jpg"
            alt="Ojasen Healing Arts Sanctuary"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-16 sm:py-20 px-4">
          <div className="max-w-4xl text-center">
            {/* <motion.div
              className="mx-auto mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/images/logo.png"
                alt="Ojasen Healing Arts"
                width={250}
                height={83}
                className="mx-auto drop-shadow-lg"
              />
            </motion.div> */}
            <motion.p
              className="text-sm md:text-4xl text-white max-w-2xl mx-auto leading-relaxed font-julius tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Awaken your spirit
            </motion.p>
            <motion.p
              className="text-sm md:text-xl text-white max-w-2xl mx-auto leading-relaxed font-julius tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A sanctuary for wellness, healing and community.
            </motion.p>
            <Link href="/booking">
              <motion.button
                className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-[#d2b46e] text-white font-medium uppercase tracking-widest text-sm hover:bg-[#5a786d] transition-all duration-300 min-h-[44px] rounded-lg backdrop-blur-sm border border-white/20 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                BOOK NOW
              </motion.button>
            </Link>
          </div>
          <motion.div
            className="mt-10 text-sm sm:text-sm md:text-sm text-white font-light tracking-wide font-della max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-4 gap-y-2">
              <span>YOGA</span>
              <span className="opacity-60">|</span>
              <span>BREATHWORK</span>
              <span className="opacity-60">|</span>
              <span>SOUND HEALING</span>
              <span className="opacity-60">|</span>
              <span>ICE BATH</span>
              <span className="opacity-60">|</span>
              <span>RETREATS</span>
              <span className="opacity-60">|</span>
              <span>ENERGY HEALING</span>
            </div>
          </motion.div>
        </div>
        {/* Decorative elements for visual enhancement */}
        {/* <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 sm:w-8 sm:h-12 rounded-full border-2 border-white/50 flex justify-center p-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mt-1 animate-pulse"></div>
          </div>
        </div> */}
      </div>
    </>
  );
}

function Ceremonies() {
  return (
    <div className="py-20 px-6 bg-cover bg-no-repeat bg-top relative overflow-hidden pb-8">
      {/* Replace CSS background with Next.js Image component */}
      <div className="absolute inset-0 w-full h-full">
        <div className="hidden md:block">
          <Image
            src="/images/hero-landscape.jpg"
            alt="Ceremonies Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="md:hidden">
          <Image
            src="/images/hero-landscape.jpg"
            alt="Ceremonies Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      {/* Floating decorative elements removed for clearer design */}{" "}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="text-sm uppercase font-medium tracking-wider text-secondary mb-4">
          Sacred Gatherings
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans text-[#fff] mb-6">
          Sessions & Ceremonies
        </h2>

        <div className="text-base sm:text-lg md:text-xl text-[#fff] leading-relaxed space-y-4 mb-10">
          <p>
            Moments crafted with intention, devotion, and soul. Our Sacred
            Events are intimate ceremonial gatherings that guide you deeper into
            presence through yoga, sound, breath, energy work, and ritual. Each
            event is a shared journey — a space to release, realign, and
            reconnect with the parts of yourself that deserve to be felt.
          </p>
          <p>
            Rooted in island energy and held with gentle care, these experiences
            invite you to awaken your spirit, honour your inner truth, and step
            into a more grounded, luminous you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* <Link href="/events">
            <button className="px-8 py-3 bg-primary/90 text-white font-medium uppercase tracking-wider text-sm hover:bg-[#5a786d] transition-colors duration-300 rounded-lg backdrop-blur-sm border border-white/20">
              Explore Ceremonies
            </button>
          </Link> */}
          <Link href="/booking">
            <button className="px-6 sm:px-8 py-3 bg-transparent text-white font-medium uppercase tracking-wider text-sm hover:bg-white/10 transition-colors duration-300 rounded-lg border border-white/30 min-h-[44px]">
              Book a Session
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <>
      <motion.div
        className="bg-[#f7faf6] py-20 px-6 bg-cover bg-center bg-no-repeat relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Replace CSS background with Next.js Image component */}
        <div className="absolute inset-0 w-full h-full">
          <div className="hidden md:block">
            <Image
              src="/images/hero-drone.jpg"
              alt="About Background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          <div className="md:hidden">
            <Image
              src="/images/hero-drone-mobile.jpg"
              alt="About Background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-sans text-[white] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            A Sanctuary to Awaken Your Spirit
          </motion.h2>
          <div className="text-base sm:text-lg md:text-xl text-[white] leading-relaxed space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="transition-all duration-700"
            >
              Ojasen Healing Arts is a holistic wellness sanctuary nestled in
              the lush paddy fields of Ahangama, where the gentle calls of
              peacocks and the softness of island nature create a landscape for
              deep restoration.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="transition-all duration-700 delay-100"
            >
              Integrating ancient healing traditions with modern mindfulness,
              Ojasen offers a multidisciplinary path to personal and collective
              transformation. Through sound healing, meditation, breathwork,
              yoga, ice bath, and ceremonial gatherings, we guide individuals
              back into balance — emotionally, physically, and energetically.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="transition-all duration-700 delay-200"
            >
              Our approach is rooted in the belief that healing is a
              remembering: a return to presence, inner freedom, and the natural
              rhythms of the body. At Ojasen, we cultivate a safe, heart-led
              environment where community can grow and transformation can unfold
              with ease.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="transition-all duration-700 delay-300"
            >
              The land itself holds you — the open fields, the quiet air, the
              wildlife all contributing to a sense of grounding and serenity.
              Ojasen stands as a catalyst for meaningful healing and conscious
              community development, inviting each person to awaken their
              spirit, reconnect with their truth, and experience well-being as a
              way of being, not a destination.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Schedule() {
  // Healer data with placeholder availability times
  const healers = [
    {
      name: "Oshadi",
      role: "Sound Healer",
      image: "/images/healers/oshadi.png",
      link: "/healers/oshadi",
      availability: [
        { day: "Monday", time: "9:00 AM - 11:00 AM" },
        { day: "Wednesday", time: "2:00 PM - 4:00 PM" },
        { day: "Friday", time: "10:00 AM - 12:00 PM" },
      ],
    },
    {
      name: "Deborah",
      role: "Energy Healer",
      image: "/images/healers/deborah.png",
      link: "/healers/deborah",
      availability: [
        { day: "Monday", time: "1:00 PM - 3:00 PM" },
        { day: "Wednesday", time: "4:00 PM - 6:00 PM" },
        { day: "Sunday", time: "11:00 AM - 1:00 PM" },
      ],
    },
  ];

  // Days of the week for the schedule
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Function to get availability for a specific healer and day
  const getAvailabilityForDay = (healer: (typeof healers)[0], day: string) => {
    return healer.availability
      .filter((slot) => slot.day === day)
      .map((slot) => slot.time);
  };

  return (
    <>
      <motion.div
        className="py-16 px-6 bg-[#f7faf6]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-sans text-[#191d18] mb-4">
              Weekly Schedule
            </h2>
            <p className="text-lg text-[#525A52] max-w-2xl mx-auto mb-8">
              View our healers' weekly availability and book your sessions.
            </p>
          </motion.div>

          {/* Weekly Schedule Grid */}
          <div className="bg-white rounded-3xl border border-primary/20 overflow-hidden shadow-lg">
            {/* Days Header */}
            <div className="grid grid-cols-8 border-b border-primary/20">
              <div className="p-4 font-medium text-[#191d18] bg-[#f7faf6]"></div>
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="p-4 text-center font-medium text-[#191d18] bg-[#f7faf6]"
                >
                  {day.substring(0, 3)}
                </div>
              ))}
            </div>

            {/* Healers Rows */}
            {healers.map((healer, healerIndex) => (
              <div
                key={healerIndex}
                className="grid grid-cols-8 border-b border-primary/10 last:border-b-0 hover:bg-[#f7faf6]/50 transition-colors duration-200"
              >
                {/* Healer Info */}
                <Link
                  href={healer.link}
                  className="p-4 flex items-center hover:bg-[#f7faf6]/30 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                      <Image
                        src={healer.image}
                        alt={healer.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-[#191d18] text-sm">
                        {healer.name}
                      </div>
                      <div className="text-primary text-xs uppercase tracking-wide">
                        {healer.role}
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Availability for each day */}
                {daysOfWeek.map((day) => {
                  const times = getAvailabilityForDay(healer, day);
                  return (
                    <div key={day} className="p-4 border-l border-primary/10">
                      {times.length > 0 ? (
                        <div className="space-y-1">
                          {times.map((time, index) => (
                            <div key={index} className="text-[#525A52] text-xs">
                              {time}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[#525A52]/50 text-xs">-</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link href="/healers">
              <motion.button
                className="px-8 py-3 bg-secondary text-[#2C332D] font-medium uppercase tracking-wider text-sm hover:bg-[#a8c9b3] transition-colors duration-300 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Healers
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

function Footer() {
  return (
    <>
      <motion.div
        className="bg-[#2b332d] text-[#dbeade] py-16 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-sans mb-4">Ojasen Healing Arts</h3>
              <p className="text-[#c4c9c4] mb-4">
                A sanctuary for communities, where freedom, mindfulness, and
                holistic healing come together.
              </p>
              <p className="text-[#c4c9c4]">The Island Ahangama, Sri Lanka</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-sans mb-4">Connect</h4>
              <p className="text-[#c4c9c4] mb-2">@ojasenhealingarts</p>
              <p className="text-[#c4c9c4]">+94 76 277 7482</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-sans mb-4">Visit Us</h4>
              <p className="text-[#c4c9c4] mb-2">The Island</p>
              <p className="text-[#c4c9c4]">Ahangama, Sri Lanka</p>
            </motion.div>
          </div>
          <motion.div
            className="border-t border-primary/30 mt-12 pt-8 text-center text-[#c4c9c4]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p>
              &copy; {new Date().getFullYear()} Ojasen Healing Arts. All rights
              reserved.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

function EventsSection() {
  return (
    <>
      <div className="">
        <div className=" mx-auto">
          {/* <div className="text-center mb-16">
            <span className="text-sm uppercase font-medium tracking-wider text-primary">
              Upcoming Events
            </span>
            <h2 className="text-3xl font-light mt-2 mb-4">
              Transformative Experiences
            </h2>
            <p className="text-[#525A52] max-w-2xl mx-auto text-lg">
              Join our community for immersive wellness experiences designed to
              nourish your mind, body, and spirit.
            </p>
          </div> */}

          <div className="">
            {/* <AnahataFlowEvent /> */}
            {/* <PanchaliSaadhanEvent /> */}
          </div>

          <div className="text-center mt-12">
            <Link href="/events">
              <button className="px-8 py-3 bg-primary text-white font-medium uppercase tracking-wider text-sm hover:bg-[#5a786d] transition-colors duration-300 rounded-lg">
                View All Sessions
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function AnahataFlowEvent() {
  return (
    <div className="py-16 px-4 sm:py-20 sm:px-6 bg-auto bg-no-repeat relative overflow-hidden">
      {/* Replace CSS background with Next.js Image component */}
      <div className="absolute inset-0 w-full h-full">
        <div className="hidden md:block">
          <Image
            src="/images/sound-healing.jpg"
            alt="Anahata Flow Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="md:hidden">
          <Image
            src="/images/sound-healing.jpg"
            alt="Anahata Flow Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/30"></div>
      {/* Floating decorative elements removed for clearer design */}{" "}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Link href="/events/anahata-flow">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans text-[#fff] mb-6 cursor-pointer hover:underline">
            Anahata Flow
          </h2>
        </Link>

        {/* Event details card */}
        <div className="bg-black/20 backdrop-blur-sm p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10 max-w-md mx-auto rounded-2xl">
          <div className="flex justify-center space-x-4 sm:space-x-6">
            <div className="text-center">
              <div className="text-white text-xs sm:text-sm uppercase tracking-wider mb-1">
                Date
              </div>
              <div className="text-white text-lg sm:text-xl font-light">
                NOV 22
              </div>
            </div>
            <div className="border-l border-white/30"></div>
            <div className="text-center">
              <div className="text-white text-xs sm:text-sm uppercase tracking-wider mb-1">
                Time
              </div>
              <div className="text-white text-lg sm:text-xl font-light">
                6 P.M.
              </div>
            </div>
          </div>
        </div>

        <div className="text-base sm:text-lg md:text-xl text-[#fff] leading-relaxed space-y-3 sm:space-y-4">
          <p>
            A heart-centered sound healing journey crafted to soften your
            emotional body and bring you back into harmony with yourself. Guided
            by Oshi's intuitive blend of crystal bowls, vocal toning, and
            frequency work, this session awakens the energy of the heart — the
            space where compassion, release, and renewal unfold.
          </p>
          <p>
            You'll be invited to slow down, breathe deeply, and allow
            vibrational medicine to move through your system. As sound ripples
            through your body, it helps dissolve heaviness, calm the nervous
            system, and create gentle openings where clarity and lightness can
            return.
          </p>
          <p>
            This is not just a sound bath — it is a space to feel, to let go,
            and to reconnect with the softness you often forget you carry.
            Anahata Flow is ideal for anyone seeking emotional balance,
            energetic reset, or a moment of pure presence within the stillness
            of Ojasen's natural surroundings.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link href="/events/anahata-flow">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-primary/90 text-white font-medium uppercase tracking-wider text-sm hover:bg-[#5a786d] transition-colors duration-300 rounded-lg border border-white/20 min-h-[44px]">
              Learn More
            </button>
          </Link>
          <Link href="/booking?event=anahata-flow">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent text-white font-medium uppercase tracking-wider text-sm hover:bg-white/10 transition-colors duration-300 rounded-lg border border-white/30 min-h-[44px]">
              Reserve Your Spot
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function PanchaliSaadhanEvent() {
  return (
    <div className="py-16 px-4 sm:py-20 sm:px-6 bg-auto bg-no-repeat bg-center relative overflow-hidden">
      {/* Replace CSS background with Next.js Image component */}
      <div className="absolute inset-0 w-full h-full">
        <div className="hidden md:block">
          <Image
            src="/images/panchali.jpeg"
            alt="Panchali Saadhan Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="md:hidden">
          <Image
            src="/images/panchali.jpeg"
            alt="Panchali Saadhan Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/30"></div>
      {/* Floating decorative elements removed for clearer design */}{" "}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Link href="/events/panchali-saadhan">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans text-[#fff] mb-6 cursor-pointer hover:underline">
            Panchali Sādhanā{" "}
          </h2>
        </Link>

        {/* Event details card */}
        <div className="bg-black/20 backdrop-blur-sm p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10 max-w-md mx-auto rounded-2xl">
          <div className="flex justify-center space-x-4 sm:space-x-6">
            <div className="text-center">
              <div className="text-white text-xs sm:text-sm uppercase tracking-wider mb-1">
                Date
              </div>
              <div className="text-white text-lg sm:text-xl font-light">
                NOV 29
              </div>
            </div>
            <div className="border-l border-white/30"></div>
            <div className="text-center">
              <div className="text-white text-xs sm:text-sm uppercase tracking-wider mb-1">
                Time
              </div>
              <div className="text-white text-lg sm:text-xl font-light">
                6 P.M.
              </div>
            </div>
          </div>
        </div>

        <div className="text-base sm:text-lg md:text-xl text-[#fff] leading-relaxed space-y-3 sm:space-y-4">
          <p>
            Panchali Sadhana is a sacred WOMEN'S gathering inspired by the
            strength and grace of Panchali. This evening is crafted to help you
            release emotional weight, reconnect with your heart, and step into a
            new cycle with clarity and intention.
          </p>
          <p>
            The journey weaves together a trauma-safe release ritual, an
            intention and manifest circle, sound healing with Oshi, lunar yoga
            and breathwork, energy clearing, and a symbolic fire offering to let
            go of what no longer serves you.
          </p>
          <p>
            You'll be guided through gentle New-Moon journaling, followed by a
            sisterhood sharing circle and a grounding tea ritual to close the
            night with softness.
          </p>
          <p>
            Panchali Sadhana is a space to be held, seen, and supported — a
            return to your inner flame, your truth, and your feminine wisdom.
            Come as you are. Leave renewed.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link href="/events/panchali-saadhan">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-primary/90 text-white font-medium uppercase tracking-wider text-sm hover:bg-[#5a786d] transition-colors duration-300 rounded-lg  border border-white/20 min-h-[44px]">
              Learn More
            </button>
          </Link>
          <Link href="/booking?event=panchali-saadhan">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent text-white font-medium uppercase tracking-wider text-sm hover:bg-white/10 transition-colors duration-300 rounded-lg border border-white/30 min-h-[44px]">
              Reserve Your Spot
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LocationMap() {
  return (
    <>
      <motion.div
        className="bg-[#f7faf6] px-6 text-[#191d18] pt-16 pb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-sm uppercase font-medium tracking-wider text-primary">
              Find Us
            </span>
            <h2 className="text-3xl font-light mt-2">Our Sanctuary Location</h2>
            <p className="text-[#525A52] max-w-2xl mx-auto text-lg mt-4">
              Nestled in the beautiful coastal town of Ahangama, our healing
              sanctuary offers a tranquil escape from the everyday.
            </p>
          </motion.div>

          <div className="bg-white rounded-4xl overflow-hidden border border-primary/20">
            <div className="h-96 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.8771573654867!2d80.34803657498867!3d6.01160059397367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae16d7d5dc86e37%3A0x13292a854c15ebff!2sThe%20Island%20Ahangama!5e0!3m2!1sen!2slk!4v1763119034083!5m2!1sen!2slk&maptype=satellite"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="p-8">
              <h3 className="text-2xl mb-4">Getting Here</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium mb-3">By Air</h4>
                  <p className="text-[#525A52]">
                    The nearest international airport is Bandaranaike
                    International Airport (CMB) in Colombo. From there, it's
                    approximately a 2-hour drive to Ahangama.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-3">By Road</h4>
                  <p className="text-[#525A52]">
                    Ahangama is easily accessible by road from major cities.
                    Regular buses and taxis operate to the area from Colombo and
                    other nearby towns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function FloodRelief() {
  return (
    <motion.div
      className="py-12 px-4 sm:py-16 sm:px-6 bg-[#f7faf6] relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="rounded-2xl overflow-hidden shadow-xl border border-primary/20 bg-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="relative w-full">
            <Image
              src="/flood-relief.jpeg"
              alt="Sri Lanka Flood Relief - Ojasen Healing Arts & The Island Ahangama"
              width={1200}
              height={1200}
              className="w-full h-auto"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              priority
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function FloodReliefAlternative() {
  return (
    <motion.div
      className="py-16 px-4 sm:py-20 sm:px-6 bg-[#f7faf6] relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-sm uppercase font-medium tracking-wider text-primary mb-2 block">
            Community Support
          </span>
          <h2 className="text-3xl md:text-4xl font-sans text-[#191d18] mb-4">
            Sri Lanka Flood Relief
          </h2>
          <p className="text-lg text-[#525A52] max-w-2xl mx-auto">
            Together with The Island Ahangama, we're supporting families
            affected by floods across Sri Lanka
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="rounded-3xl overflow-hidden shadow-2xl border border-primary/20 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
            <Image
              src="/images/flood-relief.jpeg"
              alt="Sri Lanka Flood Relief - Ojasen Healing Arts & The Island Ahangama"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
        </motion.div>

        {/* Description and CTA */}
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-base md:text-lg text-[#525A52] leading-relaxed space-y-4 mb-8">
            <p>
              As floods have affected families across Sri Lanka, many are left
              without the basics that bring comfort and stability. If you're
              looking for a safe way to support, we're here to help you reach
              those who need it most.
            </p>
            <p>
              We're collecting dry rations and key essentials to hand-deliver to
              families in Matara, Colombo, and Kelaniya impacted by the floods.
              Anyone who wants to contribute or volunteer is warmly encouraged.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-primary/10">
            <h3 className="text-xl md:text-2xl font-sans text-[#191d18] mb-6">
              Collection Points
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-medium text-[#191d18] mb-2">Colombo</h4>
                <p className="text-sm text-[#525A52] mb-1">11A1,</p>
                <p className="text-sm text-[#525A52] mb-1">
                  Henry Pamunuwa Mw,
                </p>
                <p className="text-sm text-[#525A52] mb-3">Maharagama</p>
                <a
                  href="tel:+94762777482"
                  className="text-primary hover:text-[#5a786d] text-sm font-medium"
                >
                  +94-762777482
                </a>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-[#191d18] mb-2">Ahangama</h4>
                <p className="text-sm text-[#525A52] mb-1">The Island,</p>
                <p className="text-sm text-[#525A52] mb-1">Palliyagoda,</p>
                <p className="text-sm text-[#525A52] mb-3">Ahangama</p>
                <a
                  href="tel:+94779545413"
                  className="text-primary hover:text-[#5a786d] text-sm font-medium"
                >
                  +94-779545413
                </a>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-[#191d18] mb-2">Matara</h4>
                <p className="text-sm text-[#525A52] mb-1">Calm Villa,</p>
                <p className="text-sm text-[#525A52] mb-1">Borolla Rd,</p>
                <p className="text-sm text-[#525A52] mb-3">Kamburugamuwa</p>
                <a
                  href="tel:+94770357432"
                  className="text-primary hover:text-[#5a786d] text-sm font-medium"
                >
                  +94-770357432
                </a>
              </div>
            </div>
          </div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/contact">
              <motion.button
                className="px-8 py-3 bg-primary text-white font-medium uppercase tracking-wider text-sm hover:bg-[#5a786d] transition-colors duration-300 rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface NavigationProps {
  forceTransparent?: boolean;
  logoSrc?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoClassName?: string;
}

function NavigationNew({
  forceTransparent = false,
  logoSrc: customLogoSrc,
  logoWidth: customLogoWidth,
  logoHeight: customLogoHeight,
  logoClassName,
}: NavigationProps) {
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
    // Use custom logo if provided, otherwise use default text logo
    return customLogoSrc || "/images/logo-text.png";
  };

  // Determine logo dimensions - now consistent across all states
  const getLogoDimensions = () => {
    // Use custom dimensions if provided, otherwise use default dimensions
    return {
      width: customLogoWidth || 160,
      height: customLogoHeight || 32,
    };
  };

  const logoSrc = getLogoSrc();
  const { width, height } = getLogoDimensions();

  return (
    <>
      <header
        className={`pt-15 fixed w-full z-50 transition-all duration-300 ${
          forceTransparent
            ? "bg-transparent py-4"
            : isHomePage && !scrolled
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
              className={`transition-all duration-300 flex items-center h-8 ${
                logoClassName || ""
              }`}
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
                onClick={() => trackNavigation("Account")}
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
                onClick={() => trackNavigation("Sign In")}
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
            <div className={`flex items-center h-8 ${logoClassName || ""}`}>
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
              onClick={() => {
                setIsOpen(false);
                trackNavigation(link.name);
              }}
            >
              {link.name}
            </Link>
          ))}

          {/* Authentication Links */}
          {session ? (
            <Link
              href="/dashboard"
              className="text-xl text-white hover:text-accent transition-colors duration-300 uppercase tracking-wider font-medium flex items-center mt-4"
              onClick={() => {
                setIsOpen(false);
                trackNavigation("Account");
              }}
            >
              <User size={20} className="mr-2" />
              Account
            </Link>
          ) : (
            <div className="flex flex-col space-y-4 mt-4">
              <Link
                href="/sign-in"
                className="text-xl text-white hover:text-accent transition-colors duration-300 uppercase tracking-wider font-medium px-6 py-3 border border-white/30 rounded-lg"
                onClick={() => {
                  setIsOpen(false);
                  trackNavigation("Sign In");
                }}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-xl  hover:text-accent transition-colors duration-300 uppercase tracking-wider font-medium px-6 py-3 bg-white text-primary rounded-lg"
                onClick={() => {
                  setIsOpen(false);
                  trackNavigation("Sign Up");
                }}
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
