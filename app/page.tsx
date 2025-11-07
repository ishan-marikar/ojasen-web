import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";

function Navigation() {
  return <></>;
}

function Hero() {
  return (
    <>
      <div className="flex flex-col items-center justify-top min-h-screen py-2 pt-28 relative overflow-hidden bg-[#f7faf6]">
        <div className="text-sm uppercase text-[#191d18] font-medium tracking-wider">
          Your wellness sanctuary
        </div>
        <h1 className="mx-3 text-4xl text-[#191d18] pt-4 text-center">
          Awaken the life within
        </h1>
        {/* Floating flowers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Background layer - subtle, more blurred */}
          <div className="absolute top-1/3 left-1/6 animate-float-slow animation-delay-0 depth-layer-1">
            <Image
              src="/hero/flower02.png"
              alt="Floating Flower"
              width={48}
              height={48}
              className="opacity-30 blur-[1px]"
            />
          </div>
          <div className="absolute top-1/4 right-1/5 animate-float-reverse animation-delay-2000 depth-layer-1">
            <Image
              src="/hero/flower03.png"
              alt="Floating Flower"
              width={36}
              height={36}
              className="opacity-25 blur-[1.5px]"
            />
          </div>

          {/* Middle layer - medium visibility, medium blur */}
          <div className="absolute top-2/5 left-4/5 animate-float animation-delay-1000 depth-layer-2">
            <Image
              src="/hero/flower03.png"
              alt="Floating Flower"
              width={52}
              height={52}
              className="opacity-50 blur-[0.5px]"
            />
          </div>

          {/* Foreground layer - clearer, less blurred */}
          <div className="absolute top-3/5 left-1/3 animate-float-diagonal animation-delay-3000 depth-layer-3">
            <Image
              src="/hero/flower02.png"
              alt="Floating Flower"
              width={60}
              height={60}
              className="opacity-70"
            />
          </div>
          <div className="absolute top-1/6 right-1/4 animate-float-scale animation-delay-4000 depth-layer-3">
            <Image
              src="/hero/flower03.png"
              alt="Floating Flower"
              width={44}
              height={44}
              className="opacity-60 blur-[0.25px]"
            />
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <Image
            src="/hero/hero.png"
            alt="Facilitator"
            width={400}
            height={400}
            className=""
          />
        </div>
        <div className="text-[#525A52] text-center mt-4 text-lg tracking-wide">
          We aim to empower individuals to take charge of their well-being
          through education, resources, and personalized wellness programs
        </div>
        <div className="my-3 mb-8">
          <CallToActionButton />
        </div>
      </div>
    </>
  );
}

function CallToActionButton() {
  return (
    <button className="mt-6 rounded-lg bg-[#CDEDD4] hover:bg-[#CDEDD4] uppercase px-10 py-5 text-primary text-sm">
      Get Started
    </button>
  );
}

function LearnMoreButton() {
  return (
    <button className="mt-6 rounded-lg bg-[#CDEDD4] hover:bg-[#CDEDD4] uppercase px-10 py-5 text-primary text-sm">
      Learn More{" "}
    </button>
  );
}

function AboutUs() {
  return (
    <>
      <div className="bg-[#2b332d] px-6 text-[#dbeade] pt-20 pb-10">
        <span className="text-sm uppercase  font-medium tracking-wider text-primary pt-10 pb-4">
          About Us
        </span>
        <h3 className="text-3xl">Discover our deep anal "Bugra" treatment</h3>
        <div className="pb-10 mt-6 text-lg">
          Our journey in the world of yoga and wellness started with a profound
          belief in the transformative power of self-care. Our mission is to
          guide individuals on a path to holistic health, happiness, and inner
          peace.
        </div>
        <div className="flex justify-center pb-4">
          <Image
            src="/images/sound-healing.jpg"
            alt="Sound Healing"
            width={500}
            height={300}
            className="rounded-l-4xl rounded-tr-4xl"
          />
        </div>
        <div className="pb-1 mt-4 text-lg">
          Our vision is to be a haven for those seeking balance in their lives.
          We aspire to be a guiding light on your wellness journey, providing a
          sanctuary for self-discovery and healing.
        </div>
        <div className="my-3 mb-8">
          <LearnMoreButton />
        </div>{" "}
      </div>
    </>
  );
}

function Schedule() {
  return (
    <>
      <div className="bg-[#2b332d] px-6 text-[#dbeade] pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm uppercase font-medium tracking-wider text-[#CDEDD4]">
              Schedule
            </span>
            <h2 className="text-3xl font-light mt-2">
              Elevate your holistic journey
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Event
              date="29"
              month="Nov"
              title="Zen & Balance Retreat"
              description="Join us for a rejuvenating weekend retreat focused on finding inner peace and balance."
              location="The Island - Ahangama"
              time="7am - 9am"
              image="/images/events/event-01.jpg"
            />
            <Event
              date="05"
              month="Dec"
              title="Sound Healing Journey"
              description="Experience deep relaxation through the power of sound vibrations and crystal bowls."
              location="The Island - Ahangama"
              time="5pm - 7pm"
              image="/images/events/event-02.jpg"
            />
            <Event
              date="12"
              month="Dec"
              title="Ecstatic Dance Workshop"
              description="Free your body and soul through movement in our safe and judgment-free space."
              location="The Island - Ahangama"
              time="6pm - 8pm"
              image="/images/events/event-03.jpg"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function Event({
  date,
  month,
  title,
  description,
  location,
  time,
  image,
}: {
  date: string;
  month: string;
  title: string;
  description: string;
  location: string;
  time: string;
  image: string;
}) {
  return (
    <div className="bg-[#191d18]/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-[#68887d]/20 transition-all duration-300 hover:shadow-xl hover:border-[#68887d]/40">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-light text-[#CDEDD4]">{title}</h3>
            <p className="text-[#dbeade] mt-2 text-sm leading-relaxed">
              {description}
            </p>
          </div>
          <div className="bg-[#68887d] min-w-[50px] h-[50px] rounded-lg flex flex-col items-center justify-center">
            <span className="text-white text-lg font-medium">{date}</span>
            <span className="text-white text-xs uppercase">{month}</span>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex items-center text-[#CDEDD4] text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-[#CDEDD4] text-sm">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// NOTE: Packages is not finalised yet, skipping for now.
function Packages() {
  return <></>;
}

function Facilitators() {
  return <></>;
}

function Testimonials() {
  return <></>;
}

function FrequentlyAskedQuestions() {
  return <></>;
}

function Footer() {
  return <></>;
}

export default function Home() {
  return (
    <>
      <Navigation />
      <div className=" ">
        <Hero />
        <AboutUs />
        <Offerings />
        <Schedule />
        <Packages />
        <Facilitators />
        <Testimonials />
        <FrequentlyAskedQuestions />
      </div>
      <Footer />
    </>
  );
}

function Offerings() {
  // List of all offerings from NOTES.md lines 42-48
  const offerings = [
    {
      title: "Yoga and Meditation",
      description:
        "Experience the harmony of body and mind through our guided yoga and meditation sessions.",
      icon: "/images/offerings/icon08-RNKGNCE.png",
    },
    {
      title: "Sound Healing",
      description:
        "Experience the power of sound healing in our serene sanctuary.",
      icon: "/images/offerings/icon-2-22-RNKGNCE.png",
    },
    {
      title: "Ice Bath and Breathwork",
      description:
        "Revitalize your body and mind with our invigorating ice bath and breathwork sessions.",
      icon: "/images/offerings/icon14-RNKGNCE.png",
    },
    {
      title: "Singing Circle",
      description:
        "Join our community in harmonious singing to uplift your spirit and connect with others.",
      icon: "/images/offerings/icon17-RNKGNCE.png",
    },
    {
      title: "Cacou Healing Ceremony",
      description:
        "Participate in our sacred Kakou healing ceremonies for deep spiritual transformation.",
      icon: "/images/offerings/icon24-RNKGNCE.png",
    },
    {
      title: "Energy Healing",
      description:
        "Balance your energy centers with our specialized healing sessions.",
      icon: "/images/offerings/icon-2-22-RNKGNCE.png",
    },
  ];

  return (
    <>
      <div className="bg-[#f7faf6] px-6 text-[#191d18] pt-20 pb-10">
        <span className="text-sm uppercase  font-medium tracking-wider text-primary pt-10 pb-4">
          Healing Facilities
        </span>
        <h3 className="text-3xl">
          Find our diverse offerings to හීලින්ග් yourself
        </h3>
        <div className="pb-10 mt-6 text-lg">
          Our journey in the world of yoga and wellness started with a profound
          belief in the transformative power of self-care. Our mission is to
          guide individuals on a path to holistic health, happiness, and inner
          peace.
        </div>
        <div className="space-y-8">
          {offerings.map((offering, index) => (
            <Facility
              key={index}
              title={offering.title}
              description={offering.description}
              icon={offering.icon}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function Facility({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <>
      <div className="flex items-center">
        <img
          src={icon}
          alt={title}
          width={80}
          height={80}
          className="rounded-l-4xl rounded-tr-4xl mr-3"
        />
        <div>
          <h5 className="text-2xl">{title}</h5>
          <div className="py-2">{description}</div>
          <div className="text-primary font-medium cursor-pointer hover:text-[#2b332d] transition-all duration-300 inline-flex items-center group">
            Learn More
            <svg
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
