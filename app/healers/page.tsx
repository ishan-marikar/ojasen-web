"use client";

import Image from "next/image";
import { PageLayout } from "@/components/shared/page-layout";
import { Hero } from "@/components/shared/hero";
import { HealerCard } from "@/components/shared/healer-card";
import { getDataService } from "@/lib/data-service";

function HealersHero() {
  return (
    <Hero
      title="Meet our experienced healers"
      subtitle="Our Healers"
      className="min-h-screen justify-center"
    >
      <div className="text-[#525A52] text-center mt-8 text-lg tracking-wide max-w-3xl mx-auto px-4">
        Our skilled practitioners bring years of expertise and a deep
        understanding of holistic wellness to guide your journey.
      </div>
    </Hero>
  );
}

function HealersSection() {
  const dataService = getDataService();
  const healers = dataService.getHealers();

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

export default function HealersPage() {
  return (
    <PageLayout>
      <HealersHero />
      <HealersSection />
    </PageLayout>
  );
}
