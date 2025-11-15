import { Hero } from "@/components/shared/hero";

function WellnessRetreatsHero() {
  return (
    <Hero
      title="Wellness Retreats"
      subtitle="Immersive Experiences"
      className="bg-[#f7faf6]"
    >
      <div className="text-[#525A52] text-center mt-8 text-lg tracking-wide max-w-3xl mx-auto px-4">
        Immerse yourself in transformative wellness experiences in our natural
        sanctuary
      </div>
    </Hero>
  );
}

export default function Page() {
  return <WellnessRetreatsHero />;
}
