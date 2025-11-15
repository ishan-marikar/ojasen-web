import { Hero } from "@/components/shared/hero";

function SingingCircleHero() {
  return (
    <Hero
      title="Singing Circle"
      subtitle="Community Harmony"
      className="bg-[#f7faf6]"
    >
      <div className="text-[#525A52] text-center mt-8 text-lg tracking-wide max-w-3xl mx-auto px-4">
        Raise your voice in harmony with others in our sacred singing circles
      </div>
    </Hero>
  );
}

export default function Page() {
  return <SingingCircleHero />;
}
