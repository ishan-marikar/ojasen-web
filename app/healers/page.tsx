"use client";

import { ImageWithFallback as Image } from "@/components/shared/image-with-fallback";
import { PageLayout } from "@/components/shared/page-layout";
import { Hero } from "@/components/shared/hero";
import { HealerCard } from "@/components/shared/healer-card";
import { getDataService } from "@/lib/data-service";

function HealersHero() {
  return (
    <Hero
      title="Meet our experienced healers"
      subtitle="Our Healers"
      className="bg-[#f7faf6]"
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
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm uppercase font-medium tracking-wider text-primary">
            Our Healers
          </span>
          <h2 className="text-2xl sm:text-3xl font-light mt-2 mb-4 text-[#191d18]">
            Experienced wellness practitioners
          </h2>
          <p className="text-[#525A52] max-w-2xl mx-auto text-base sm:text-lg">
            Each of our healers brings unique expertise and a deep commitment to
            your wellness journey.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
