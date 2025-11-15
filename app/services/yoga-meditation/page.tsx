"use client";

import { ImageWithFallback as Image } from "@/components/shared/image-with-fallback";
import { PageLayout } from "@/components/shared/page-layout";
import { Hero } from "@/components/shared/hero";
import { BenefitItem } from "@/components/shared/benefit-item";
import { SessionCard } from "@/components/shared/session-card";
import { getDataService } from "@/lib/data-service";

function YogaMeditationHero() {
  return (
    <Hero
      title="Yoga and Meditation"
      subtitle="Mind & Body Harmony"
      className="bg-[#f7faf6] min-h-screen justify-center"
    >
      <div className="text-[#525A52] text-center mt-8 text-lg tracking-wide max-w-3xl mx-auto px-4">
        Experience the harmony of body and mind through our guided yoga and
        meditation sessions
      </div>
    </Hero>
  );
}

function ServiceDetails() {
  const dataService = getDataService();
  const benefits = dataService.getYogaBenefits();

  return (
    <div className="bg-[#f7faf6] px-6 text-[#191d18] pt-20 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl mb-6">Harmonize Your Mind and Body</h2>
            <div className="pb-6 text-lg">
              <p className="mb-4">
                Our yoga and meditation sessions are designed to create a
                perfect balance between physical movement and mental stillness.
                Through carefully curated sequences and guided meditation
                practices, we help you connect with your inner self and find
                peace in the present moment.
              </p>
              <p className="mb-4">
                Whether you're a beginner or an experienced practitioner, our
                sessions are tailored to meet you where you are on your wellness
                journey. We offer various styles of yoga including Hatha,
                Vinyasa, and Restorative yoga, each designed to address
                different aspects of your well-being.
              </p>
              <p>
                Our meditation practices range from mindfulness and breath
                awareness to loving-kindness meditation, providing you with
                tools to cultivate inner peace and emotional resilience.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/hero-drone.jpg"
              alt="Yoga and Meditation"
              width={500}
              height={400}
              className="rounded-4xl shadow-lg"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-4xl border border-[#68887d]/20 mb-16">
          <h3 className="text-2xl mb-6">Benefits of Yoga and Meditation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <BenefitItem
                key={index}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionTypes() {
  const dataService = getDataService();
  const sessions = dataService.getYogaSessions();

  return (
    <div className="bg-[#2b332d] px-6 text-[#dbeade] pt-16 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm uppercase font-medium tracking-wider text-primary">
            Session Options
          </span>
          <h2 className="text-3xl font-light mt-2">Choose Your Practice</h2>
          <p className="text-[#c4c9c4] max-w-2xl mx-auto text-lg mt-4">
            We offer a variety of session types to suit your needs and
            experience level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sessions.map((session, index) => (
            <SessionCard
              key={index}
              title={session.title}
              duration={session.duration}
              description={session.description}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="rounded-lg bg-[#68887d] hover:bg-[#7a9a8d] text-white uppercase px-8 py-4 text-sm font-medium transition-colors duration-300">
            Book a Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default function YogaMeditationPage() {
  return (
    <PageLayout>
      <YogaMeditationHero />
      <ServiceDetails />
      <SessionTypes />
    </PageLayout>
  );
}
