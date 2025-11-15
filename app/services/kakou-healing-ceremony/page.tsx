import { Hero } from "@/components/shared/hero";

function KakouHealingCeremonyHero() {
  return (
    <Hero
      title="Kakou Healing Ceremony"
      subtitle="Sacred Ritual"
      className="bg-[#f7faf6]"
    >
      <div className="text-[#525A52] text-center mt-8 text-lg tracking-wide max-w-3xl mx-auto px-4">
        Experience the transformative power of ancient healing traditions
      </div>
    </Hero>
  );
}

export default function Page() {
  return <KakouHealingCeremonyHero />;
}
