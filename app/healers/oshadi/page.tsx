"use client";

import { ImageWithFallback as Image } from "@/components/shared/image-with-fallback";
import { PageLayout } from "@/components/shared/page-layout";
import { Hero } from "@/components/shared/hero";
import { BenefitItem } from "@/components/shared/benefit-item";
import { SessionCard } from "@/components/shared/session-card";
import { getDataService } from "@/lib/data-service";

function OshadiHero() {
  return (
    <Hero title="Oshadi" subtitle="Meet Our Healer" className="bg-[#f7faf6]">
      <div className="text-xl text-primary mt-2">Sound Healer</div>
      <div className="mt-8 relative z-10">
        <Image
          src="/images/healers/oshadi.png"
          alt="Oshadi"
          width={300}
          height={300}
          className="rounded-full border-4 border-primary/30 shadow-lg"
        />
      </div>
    </Hero>
  );
}

function HealerDetails() {
  const dataService = getDataService();
  const expertise = dataService.getOshadiExpertise();

  return (
    <div className="bg-[#f7faf6] px-6 text-[#191d18] pt-20 pb-16">
      <div className="max-w-6xl mx-auto mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl mb-6">About Oshadi</h2>
            <div className="pb-6 text-lg">
              <p className="mb-4">
                Oshadi is the founder and head facilitator at Ojasen Healing
                Arts. With over 15 years of experience in sound healing and
                vibrational medicine, she has dedicated her life to helping
                others discover their inner harmony and connection to the
                natural world.
              </p>
              <p className="mb-4">
                Her journey into healing began during her own personal
                transformation through sound therapy. After experiencing
                profound healing herself, she felt called to share these
                powerful modalities with others. Oshadi has studied with master
                healers across the globe and continues to deepen her practice
                through ongoing learning and personal exploration.
              </p>
              <p>
                Oshadi's approach combines traditional wisdom with contemporary
                healing techniques. She believes in the power of sound to
                activate our body's natural healing abilities and create
                profound shifts in consciousness. Her sessions are known for
                their deep compassion and intuitive guidance.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/healers/oshadi.png"
              alt="Oshadi"
              width={500}
              height={400}
              className="rounded-4xl shadow-lg"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-4xl border border-primary/20 mb-16">
          <h3 className="text-2xl mb-6">Oshadi's Expertise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((item, index) => (
              <BenefitItem
                key={index}
                title={item.title}
                description={item.description}
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
  const sessions = dataService.getOshadiSessions();

  return (
    <div className="bg-[#2b332d] px-6 text-[#dbeade] pt-16 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm uppercase font-medium tracking-wider text-primary">
            Session Options
          </span>
          <h2 className="text-3xl font-light mt-2">Work with Oshadi</h2>
          <p className="text-[#c4c9c4] max-w-2xl mx-auto text-lg mt-4">
            Oshadi offers a variety of healing sessions to suit your individual
            needs.
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
          <button className="rounded-lg bg-primary hover:bg-[#7a9a8d] text-white uppercase px-8 py-4 text-sm font-medium transition-colors duration-300">
            Book a Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OshadiPage() {
  return (
    <PageLayout>
      {/* <OshadiHero /> */}
      <HealerDetails />
      <SessionTypes />
    </PageLayout>
  );
}
