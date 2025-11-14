"use client";

import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { motion } from "framer-motion";

export default function () {
  return (
    <>
      <Navigation />
      <Hero />
      <About />
      <Schedule />
      <AnahataFlow />
      <PanchaliSaadhan />
      <LocationMap />
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <>
      <div
        className="w-full flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
      >
        <div className="bg-black/30 backdrop-blur-sm w-full h-full flex flex-col items-center justify-center py-20 px-4">
          <div className="max-w-4xl text-center space-y-6">
            <motion.img
              className="mx-auto"
              src="/images/logo-text.png"
              alt="Ojasen Healing Arts"
              width={300}
              height={100}
            />
            {/* <motion.h1
              className="text-4xl md:text-6xl font-sans text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Awaken the Life Within
            </motion.h1> */}
            <motion.div
              className="text-lg md:text-xl text-white font-light tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              YOGA | BREATHWORK | SOUND HEALING CEREMONIES | ICE BATH | RETREATS
              ENERGY HEALING | COLLECTIVE CIRCLES
            </motion.div>
            <motion.p
              className="text-base md:text-lg text-white max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A sanctuary for communities, where freedom, mindfulness, and
              holistic healing come together.
            </motion.p>
            <motion.button
              className="mt-8 px-8 py-3 bg-[#68887d] text-white font-medium uppercase tracking-wider text-sm hover:bg-[#556b62] transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Weekly Schedule & Bookings
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}

function About() {
  return (
    <>
      <motion.div
        style={{ backgroundImage: "url('/images/hero-drone.jpg')" }}
        className="bg-[#f7faf6] py-20 px-6 bg-cover bg-center bg-no-repeat"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-sans text-[white] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            A Sanctuary to Awaken Your Spirit
          </motion.h2>
          <div className="text-lg md:text-xl text-[white] leading-relaxed space-y-4">
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
      name: "Alice",
      role: "Yoga Instructor",
      image: "/images/healers/alice.png",
      link: "/healers/alice",
      availability: [
        { day: "Tuesday", time: "7:00 AM - 9:00 AM" },
        { day: "Thursday", time: "5:00 PM - 7:00 PM" },
        { day: "Saturday", time: "8:00 AM - 10:00 AM" },
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
          <div className="bg-white rounded-3xl border border-[#68887d]/20 overflow-hidden shadow-lg">
            {/* Days Header */}
            <div className="grid grid-cols-8 border-b border-[#68887d]/20">
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
                className="grid grid-cols-8 border-b border-[#68887d]/10 last:border-b-0 hover:bg-[#f7faf6]/50 transition-colors duration-200"
              >
                {/* Healer Info */}
                <div className="p-4 flex items-center">
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img
                        src={healer.image}
                        alt={healer.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-[#191d18] text-sm">
                        {healer.name}
                      </div>
                      <div className="text-[#68887d] text-xs uppercase tracking-wide">
                        {healer.role}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability for each day */}
                {daysOfWeek.map((day) => {
                  const times = getAvailabilityForDay(healer, day);
                  return (
                    <div key={day} className="p-4 border-l border-[#68887d]/10">
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
                className="px-8 py-3 bg-[#CDEDD4] text-[#2C332D] font-medium uppercase tracking-wider text-sm hover:bg-[#a8c9b3] transition-colors duration-300 rounded-lg"
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
            className="border-t border-[#68887d]/30 mt-12 pt-8 text-center text-[#c4c9c4]"
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

function AnahataFlow() {
  return (
    <>
      <motion.div
        style={{ backgroundImage: "url('/images/hero-night.jpg')" }}
        className="py-20 px-6 bg-cover bg-no-repeat bg-top relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Background layer - subtle, more blurred */}
          <div className="absolute top-1/4 left-1/5 animate-float-slow animation-delay-0 depth-layer-1">
            <img
              src="/images/hero/flower02.png"
              alt="Floating Flower"
              className="opacity-20 blur-[1px] w-12 h-12"
            />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-reverse animation-delay-2000 depth-layer-1">
            <img
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              className="opacity-15 blur-[1.5px] w-10 h-10"
            />
          </div>

          {/* Middle layer - medium visibility, medium blur */}
          <div className="absolute top-2/5 left-4/5 animate-float animation-delay-1000 depth-layer-2">
            <img
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              className="opacity-30 blur-[0.5px] w-14 h-14"
            />
          </div>

          {/* Foreground layer - clearer, less blurred */}
          <div className="absolute top-3/5 left-1/3 animate-float-diagonal animation-delay-3000 depth-layer-3">
            <img
              src="/images/hero/flower02.png"
              alt="Floating Flower"
              className="opacity-40 w-16 h-16"
            />
          </div>
          <div className="absolute top-1/6 right-1/3 animate-float-scale animation-delay-4000 depth-layer-3">
            <img
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              className="opacity-35 blur-[0.25px] w-11 h-11"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-sans text-[#fff] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Anahata Flow
          </motion.h2>

          {/* Event details card */}
          <motion.div
            className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <div className="text-white text-sm uppercase tracking-wider mb-1">
                  Date
                </div>
                <div className="text-white text-xl font-light">NOV 22</div>
              </div>
              <div className="border-l border-white/30"></div>
              <div className="text-center">
                <div className="text-white text-sm uppercase tracking-wider mb-1">
                  Time
                </div>
                <div className="text-white text-xl font-light">6 P.M.</div>
              </div>
            </div>
          </motion.div>

          <div className="text-lg md:text-xl text-[#fff] leading-relaxed space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="transition-all duration-700"
            >
              A heart-centered sound healing journey crafted to soften your
              emotional body and bring you back into harmony with yourself.
              Guided by Oshi's intuitive blend of crystal bowls, vocal toning,
              and frequency work, this session awakens the energy of the heart —
              the space where compassion, release, and renewal unfold.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="transition-all duration-700 delay-100"
            >
              You'll be invited to slow down, breathe deeply, and allow
              vibrational medicine to move through your system. As sound ripples
              through your body, it helps dissolve heaviness, calm the nervous
              system, and create gentle openings where clarity and lightness can
              return.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="transition-all duration-700 delay-200"
            >
              This is not just a sound bath — it is a space to feel, to let go,
              and to reconnect with the softness you often forget you carry.
              Anahata Flow is ideal for anyone seeking emotional balance,
              energetic reset, or a moment of pure presence within the stillness
              of Ojasen's natural surroundings.
            </motion.p>
          </div>

          {/* CTA Button */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link href="/booking">
              <button className="px-8 py-3 bg-[#68887d]/90 text-white font-medium uppercase tracking-wider text-sm hover:bg-[#5a786d] transition-colors duration-300 rounded-lg backdrop-blur-sm border border-white/20">
                Reserve Your Spot
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

function PanchaliSaadhan() {
  return (
    <>
      <motion.div
        style={{ backgroundImage: "url('/images/hero-fantasy.png')" }}
        className="py-20 px-6 bg-cover bg-no-repeat bg-top relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Background layer - subtle, more blurred */}
          <div className="absolute top-1/4 left-1/5 animate-float-slow animation-delay-0 depth-layer-1">
            <img
              src="/images/hero/flower02.png"
              alt="Floating Flower"
              className="opacity-20 blur-[1px] w-12 h-12"
            />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-reverse animation-delay-2000 depth-layer-1">
            <img
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              className="opacity-15 blur-[1.5px] w-10 h-10"
            />
          </div>

          {/* Middle layer - medium visibility, medium blur */}
          <div className="absolute top-2/5 left-4/5 animate-float animation-delay-1000 depth-layer-2">
            <img
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              className="opacity-30 blur-[0.5px] w-14 h-14"
            />
          </div>

          {/* Foreground layer - clearer, less blurred */}
          <div className="absolute top-3/5 left-1/3 animate-float-diagonal animation-delay-3000 depth-layer-3">
            <img
              src="/images/hero/flower02.png"
              alt="Floating Flower"
              className="opacity-40 w-16 h-16"
            />
          </div>
          <div className="absolute top-1/6 right-1/3 animate-float-scale animation-delay-4000 depth-layer-3">
            <img
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              className="opacity-35 blur-[0.25px] w-11 h-11"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-sans text-[#fff] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Panchali Sādhanā{" "}
          </motion.h2>

          {/* Event details card */}
          <motion.div
            className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <div className="text-white text-sm uppercase tracking-wider mb-1">
                  Date
                </div>
                <div className="text-white text-xl font-light">NOV 29</div>
              </div>
              <div className="border-l border-white/30"></div>
              <div className="text-center">
                <div className="text-white text-sm uppercase tracking-wider mb-1">
                  Time
                </div>
                <div className="text-white text-xl font-light">6 P.M.</div>
              </div>
            </div>
          </motion.div>

          <div className="text-lg md:text-xl text-[#fff] leading-relaxed space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="transition-all duration-700"
            >
              Panchali Sadhana is a sacred WOMEN”S gathering inspired by the
              strength and grace of Panchali. This evening is crafted to help
              you release emotional weight, reconnect with your heart, and step
              into a new cycle with clarity and intention.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="transition-all duration-700 delay-100"
            >
              The journey weaves together a trauma-safe release ritual, an
              intention and manifest circle, sound healing with Oshi, lunar yoga
              and breathwork, energy clearing, and a symbolic fire offering to
              let go of what no longer serves you. You’ll be guided through
              gentle New-Moon journaling, followed by a sisterhood sharing
              circle and a grounding tea ritual to close the night with
              softness.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="transition-all duration-700 delay-200"
            >
              Panchali Sadhana is a sacred WOMEN”S gathering inspired by the
              strength and grace of Panchali. This evening is crafted to help
              you release emotional weight, reconnect with your heart, and step
              into a new cycle with clarity and intention. The journey weaves
              together a trauma-safe release ritual, an intention and manifest
              circle, sound healing with Oshi, lunar yoga and breathwork, energy
              clearing, and a symbolic fire offering to let go of what no longer
              serves you. You’ll be guided through gentle New-Moon journaling,
              followed by a sisterhood sharing circle and a grounding tea ritual
              to close the night with softness. Panchali Sadhana is a space to
              be held, seen, and supported — a return to your inner flame, your
              truth, and your feminine wisdom. Come as you are. Leave renewed.
            </motion.p>
          </div>

          {/* CTA Button */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link href="/booking">
              <button className="px-8 py-3 bg-[#68887d]/90 text-white font-medium uppercase tracking-wider text-sm hover:bg-[#5a786d] transition-colors duration-300 rounded-lg backdrop-blur-sm border border-white/20">
                Reserve Your Spot
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

function LocationMap() {
  return (
    <>
      <motion.div
        className="w-full py-16 px-6 bg-[#f7faf6]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-sans text-[#191d18] mb-4">
              Find Us
            </h2>
            <p className="text-lg text-[#525A52] max-w-2xl mx-auto">
              Located in the heart of Ahangama, Sri Lanka. Come experience our
              sanctuary surrounded by nature.
            </p>
          </motion.div>

          <div className="rounded-3xl overflow-hidden shadow-lg border border-[#68887d]/20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.8771573654867!2d80.34803657498867!3d6.01160059397367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae16d7d5dc86e37%3A0x13292a854c15ebff!2sThe%20Island%20Ahangama!5e0!3m2!1sen!2slk!4v1763119034083!5m2!1sen!2slk&&t=h&&layer=c
"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </div>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-white rounded-2xl px-6 py-4 border border-[#68887d]/20 shadow-sm">
              <p className="text-[#191d18] font-medium">
                The Island Ahangama, Sri Lanka
              </p>
              <p className="text-[#525A52] mt-1">📞 +94 76 277 7482</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
