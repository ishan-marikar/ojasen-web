"use client";

import Image from "next/image";
import { PageLayout } from "@/components/shared/page-layout";
import { Hero } from "@/components/shared/hero";
import { ServiceCard } from "@/components/shared/service-card";
import { getDataService } from "@/lib/data-service";

function ServicesHero() {
  return (
    <Hero
      title="Discover our healing services"
      subtitle="Holistic Wellness"
      backgroundImage="/images/hero-drone.jpg"
      className="min-h-screen justify-center"
    >
      <div className="text-[#525A52] text-center mt-8 text-lg tracking-wide max-w-3xl mx-auto px-4">
        Our comprehensive range of holistic wellness services designed to
        promote balance and well-being for mind, body, and spirit
      </div>
    </Hero>
  );
}

function ServicesOverview() {
  const dataService = getDataService();
  const services = dataService.getServices();

  return (
    <div className="bg-[#f7faf6] px-6 text-[#191d18] pt-20 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm uppercase font-medium tracking-wider text-primary">
            Our Offerings
          </span>
          <h2 className="text-3xl font-light mt-2">
            Holistic healing experiences
          </h2>
          <p className="text-[#525A52] max-w-2xl mx-auto text-lg mt-4">
            Each service is designed to promote balance and well-being for mind,
            body, and spirit through ancient wisdom and modern techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WellnessApproach() {
  return (
    <div className="bg-[#2b332d] px-6 text-[#dbeade] pt-20 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm uppercase font-medium tracking-wider text-primary pt-10 pb-4">
              Our Approach
            </span>
            <h2 className="text-3xl mb-6">Holistic Wellness Philosophy</h2>
            <div className="pb-6 text-lg">
              <p className="mb-4">
                Our holistic approach recognizes that true wellness encompasses
                the mind, body, and spirit. We believe in addressing the root
                causes of imbalance rather than just treating symptoms.
              </p>
              <p className="mb-4">
                Each service is carefully designed to work in harmony with your
                natural energy systems, promoting deep healing and sustainable
                well-being. Our experienced facilitators guide you through
                transformative experiences that empower you to take charge of
                your health journey.
              </p>
              <p>
                We combine ancient wisdom traditions with modern therapeutic
                techniques to create personalized healing experiences that
                resonate with your unique needs and goals.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/wellness-approach.jpg"
              alt="Wellness Approach"
              width={500}
              height={400}
              className="rounded-4xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <PageLayout>
      <ServicesHero />
      <ServicesOverview />
      <WellnessApproach />
    </PageLayout>
  );
}
