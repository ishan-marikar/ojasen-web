import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navigation } from "@/components/navigation";

function Hero() {
  return (
    <>
      <div className="flex flex-col items-center justify-top min-h-screen py-2 pt-28 relative overflow-hidden bg-[#f7faf6]">
        <div className="text-sm uppercase text-[#191d18] font-medium tracking-wider">
          Your wellness sanctuary
        </div>
        <h1 className="mx-3 text-4xl sm:text-5xl text-[#191d18] pt-4 text-center">
          Awaken the life within
        </h1>
        {/* Floating flowers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Background layer - subtle, more blurred */}
          <div className="absolute top-1/3 left-1/6 animate-float-slow animation-delay-0 depth-layer-1">
            <Image
              src="/images/hero/flower02.png"
              alt="Floating Flower"
              width={48}
              height={48}
              className="opacity-30 blur-[1px]"
            />
          </div>
          <div className="absolute top-1/4 right-1/5 animate-float-reverse animation-delay-2000 depth-layer-1">
            <Image
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              width={36}
              height={36}
              className="opacity-25 blur-[1.5px]"
            />
          </div>

          {/* Middle layer - medium visibility, medium blur */}
          <div className="absolute top-2/5 left-4/5 animate-float animation-delay-1000 depth-layer-2">
            <Image
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              width={52}
              height={52}
              className="opacity-50 blur-[0.5px]"
            />
          </div>

          {/* Foreground layer - clearer, less blurred */}
          <div className="absolute top-3/5 left-1/3 animate-float-diagonal animation-delay-3000 depth-layer-3">
            <Image
              src="/images/hero/flower02.png"
              alt="Floating Flower"
              width={60}
              height={60}
              className="opacity-70"
            />
          </div>
          <div className="absolute top-1/6 right-1/4 animate-float-scale animation-delay-4000 depth-layer-3">
            <Image
              src="/images/hero/flower03.png"
              alt="Floating Flower"
              width={44}
              height={44}
              className="opacity-60 blur-[0.25px]"
            />
          </div>
        </div>
        <div className="mt-3 relative z-10">
          <Image
            src="/images/hero/hero.png"
            alt="Facilitator"
            width={400}
            height={400}
            className="animate-float-meditate"
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
      <div className="bg-[#2b332d] px-6 text-[#dbeade] pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm uppercase font-medium tracking-wider text-primary pt-10 pb-4">
            About Us
          </span>
          <h3 className="text-3xl">Discover our holistic treatments</h3>
          <div className="pb-10 mt-6 text-lg">
            Our journey in the world of yoga and wellness started with a
            profound belief in the transformative power of self-care. Our
            mission is to guide individuals on a path to holistic health,
            happiness, and inner peace.
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
            Our vision is to be a haven for those seeking balance in their
            lives. We aspire to be a guiding light on your wellness journey,
            providing a sanctuary for self-discovery and healing.
          </div>
          <div className="my-3 mb-8">
            <LearnMoreButton />
          </div>
        </div>
      </div>
    </>
  );
}

function Schedule() {
  return (
    <>
      <div className="bg-[#f7faf6] px-6 text-[#191d18] pt-20 pb-20 rounded-t-4xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm uppercase font-medium tracking-wider text-primary">
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
    <div className="bg-white backdrop-blur-sm rounded-4xl overflow-hidden shadow-lg border border-[#68887d]/20 transition-all duration-300 hover:shadow-xl hover:border-[#68887d]/40">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-l-4xl rounded-r-1xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-light text-[#191d18]">{title}</h3>
            <p className="text-[#525A52] mt-2 text-sm leading-relaxed">
              {description}
            </p>
          </div>
          <div className="bg-[#68887d] min-w-[50px] h-[50px] rounded-lg flex flex-col items-center justify-center">
            <span className="text-white text-lg font-medium">{date}</span>
            <span className="text-white text-xs uppercase">{month}</span>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex items-center text-[#191d18] text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-[#191d18] text-sm">
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
  return (
    <>
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
              Healers
            </span>
            <h2 className="text-3xl font-light mt-2 mb-4 text-[#191d18]">
              Meet our experienced healers
            </h2>
            <p className="text-[#525A52] max-w-2xl mx-auto text-lg">
              Our skilled practitioners bring years of expertise and a deep
              understanding of holistic wellness to guide your journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Healer
              name="Oshadi"
              role="Sound Healer"
              image="/images/healers/oshadi.png"
            />
            <Healer
              name="Alice"
              role="Yoga Instructor"
              image="/images/healers/alice.png"
            />
            <Healer
              name="Deborah"
              role="Energy Healer"
              image="/images/healers/deborah.png"
            />
          </div>
        </div>
        <p className="text-[#525A52] max-w-2xl mx-auto text-lg px-6 text-center mt-12">
          We are committed to providing a tranquil space where you can nurture
          your body, mind, and spirit.
        </p>
      </div>
    </>
  );
}

function Healer({
  name,
  role,
  image,
}: {
  name: string;
  role: string;
  image: string;
}) {
  return (
    <div className="group overflow-hidden rounded-3xl bg-white border border-[#68887d]/20 transition-all duration-500 hover:shadow-xl hover:border-[#68887d]/40 hover:-translate-y-2 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7faf6] to-white opacity-70 pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#68887d]/30 transition-all duration-500 pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0px_0px_rgba(255,255,255,0.1)] pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl shadow-[0_0_0px_1px_rgba(104,136,125,0)_inset] group-hover:shadow-[0_0_0px_1px_rgba(104,136,125,0.1)_inset] transition-all duration-500 pointer-events-none"></div>
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
      <div className="p-6 text-center relative">
        <h3 className="text-xl font-light text-[#191d18] mb-1">{name}</h3>
        <p className="text-[#68887d] text-sm uppercase tracking-wider mb-4">
          {role}
        </p>
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="text-xs uppercase tracking-wider text-[#68887d] border border-[#68887d]/40 rounded-full px-4 py-2 hover:bg-[#68887d] hover:text-white transition-colors duration-300">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Wellness Enthusiast",
      quote:
        "The healing sessions at Ojasen transformed my perspective on wellness. I've never felt more balanced and at peace with myself.",
      image: "/images/healers/alice.png",
    },
    {
      name: "Michael Chen",
      role: "Regular Practitioner",
      quote:
        "The sound healing sessions are truly magical. I leave each session feeling rejuvenated and deeply connected to my inner self.",
      image: "/images/healers/deborah.png",
    },
    {
      name: "Emma Rodriguez",
      role: "First-time Visitor",
      quote:
        "As a newcomer to holistic healing, I was welcomed with such warmth. The practitioners are knowledgeable and genuinely caring.",
      image: "/images/healers/oshadi.png",
    },
  ];

  return (
    <>
      <div className="bg-[#f7faf6] px-6 text-[#191d18] pt-20 pb-24 relative overflow-hidden">
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

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm uppercase font-medium tracking-wider text-primary">
              Testimonials
            </span>
            <h2 className="text-3xl font-light mt-2 mb-4 text-[#191d18]">
              What our clients say
            </h2>
            <p className="text-[#525A52] max-w-2xl mx-auto text-lg">
              Discover how our holistic approach has transformed the lives of
              our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                quote={testimonial.quote}
                image={testimonial.image}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function TestimonialCard({
  name,
  role,
  quote,
  image,
}: {
  name: string;
  role: string;
  quote: string;
  image: string;
}) {
  return (
    <div className="group overflow-hidden rounded-3xl bg-white border border-[#68887d]/20 transition-all duration-500 hover:shadow-xl hover:border-[#68887d]/40 hover:-translate-y-2 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7faf6] to-white opacity-70 pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#68887d]/30 transition-all duration-500 pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0px_0px_rgba(255,255,255,0.1)] pointer-events-none"></div>
      <div className="absolute inset-0 rounded-3xl shadow-[0_0_0px_1px_rgba(104,136,125,0)_inset] group-hover:shadow-[0_0_0px_1px_rgba(104,136,125,0.1)_inset] transition-all duration-500 pointer-events-none"></div>

      <div className="p-8 relative">
        <div className="flex items-center mb-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div>
            <h3 className="text-xl font-light text-[#191d18] mb-1">{name}</h3>
            <p className="text-[#68887d] text-sm uppercase tracking-wider">
              {role}
            </p>
          </div>
        </div>

        <div className="relative">
          <svg
            className="absolute -top-4 -left-2 text-[#68887d]/20 w-8 h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-[#525A52] text-lg italic pl-6 pt-2">{quote}</p>
        </div>
      </div>
    </div>
  );
}

function FrequentlyAskedQuestions() {
  const faqs = [
    {
      question: "What types of wellness services do you offer?",
      answer:
        "We offer a comprehensive range of holistic wellness services including yoga and meditation sessions, sound healing ceremonies, ice bath therapy, breathwork workshops, singing circles, and energy healing sessions. Each service is designed to promote balance and well-being for mind, body, and spirit.",
    },
    {
      question: "Do I need prior experience to participate in your sessions?",
      answer:
        "No prior experience is necessary. Our sessions are designed to accommodate all levels, from complete beginners to experienced practitioners. Our facilitators provide guidance and modifications to ensure everyone can participate comfortably.",
    },
    {
      question: "How often should I attend sessions for optimal benefits?",
      answer:
        "We recommend starting with 1-2 sessions per week and adjusting based on your personal goals and schedule. For deeper therapeutic benefits, some clients choose to attend 3-4 times per week. Our healers can provide personalized recommendations during your consultation.",
    },
    {
      question: "What should I bring to a session?",
      answer:
        "We provide all necessary equipment and materials for our sessions. We recommend wearing comfortable, loose-fitting clothing. For yoga sessions, bring a water bottle and a small towel. For sound healing, we suggest bringing a light blanket for comfort during the session.",
    },
    {
      question: "Do you offer packages or membership options?",
      answer:
        "Yes, we offer various package options and membership tiers to suit different needs and budgets. Our packages include multi-session discounts and additional benefits like priority booking and exclusive workshops. Contact us to learn more about our current offerings.",
    },
  ];

  return (
    <>
      <div className="bg-[#f7faf6] px-6 text-[#191d18] pt-20 pb-24 relative overflow-hidden">
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

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm uppercase font-medium tracking-wider text-primary">
              FAQ
            </span>
            <h2 className="text-3xl font-light mt-2 mb-4 text-[#191d18]">
              Frequently Asked Questions
            </h2>
            <p className="text-[#525A52] max-w-2xl mx-auto text-lg">
              Find answers to common questions about our services and wellness
              programs.
            </p>
          </div>

          <div className="max-w-3xl mx-auto w-full">
            <Accordion
              type="single"
              variant="solid"
              collapsible
              className="w-full space-y-4"
              indicator="plus"
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="rounded-lg bg-white border border-[#68887d]/20 transition-all duration-300 hover:border-[#68887d]/40"
                >
                  <AccordionTrigger className="px-6 py-5 text-left text-[#191d18] hover:no-underline">
                    <span className="text-lg font-light">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-[#525A52]">
                    <p className="text-base leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <>
      <div className="bg-[#2b332d] text-[#dbeade] pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-sans">Ojasen Healing Arts</h3>
              <p className="text-[#c4c9c4] text-lg leading-relaxed">
                Your sanctuary for holistic wellness and transformative healing
                experiences.
              </p>
              <div className="flex space-x-4 pt-2">
                <a
                  href="#"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xl font-sans">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                  >
                    Events
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-xl font-sans">Services</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                  >
                    Yoga & Meditation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                  >
                    Sound Healing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                  >
                    Energy Healing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                  >
                    Breathwork
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                  >
                    Wellness Retreats
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-xl font-sans">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-[#68887d] mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-[#c4c9c4] text-lg">
                    The Island, Palliyagoda, Ahangama, 80650
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-6 w-6 text-[#68887d] mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-[#c4c9c4] text-lg">
                    <a href="+tel:+94762777482">+94 076 277 7482</a>
                  </span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-6 w-6 text-[#68887d] mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-[#c4c9c4] text-lg">
                    <a href="mailto:info@ojasenhealingarts.com">
                      info@ojasenhealingarts.com
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#68887d]/30 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-[#c4c9c4] text-lg">
                &copy; {new Date().getFullYear()} Ojasen Healing Arts. All
                rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-[#c4c9c4] hover:text-white transition-colors duration-300 text-lg"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
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
      <div className="bg-[#f7faf6] px-6 text-[#191d18] pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm uppercase font-medium tracking-wider text-primary pt-10 pb-4">
            Healing Facilities
          </span>
          <h3 className="text-3xl">
            Find our diverse offerings to හීලින්ග් yourself
          </h3>
          <div className="pb-10 mt-6 text-lg">
            Our journey in the world of yoga and wellness started with a
            profound belief in the transformative power of self-care. Our
            mission is to guide individuals on a path to holistic health,
            happiness, and inner peace.
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
