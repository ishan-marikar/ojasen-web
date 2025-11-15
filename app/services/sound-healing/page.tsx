import { Hero } from "@/components/shared/hero";

function SoundHealingHero() {
  return (
    <Hero
      title="Sound Healing"
      subtitle="Vibrational Medicine"
      className="bg-[#f7faf6]"
    >
      <div className="text-[#525A52] text-center mt-8 text-lg tracking-wide max-w-3xl mx-auto px-4">
        Experience the power of sound healing in our serene sanctuary
      </div>
    </Hero>
  );
}

export default function Page() {
  return <SoundHealingHero />;
}
