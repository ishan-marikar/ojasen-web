// Data service to manage application data and dependencies
import { Service, Healer, Session, BenefitItem } from "@/lib/types";

// Service data
export const servicesData: Service[] = [
  {
    title: "Yoga and Meditation",
    description:
      "Experience the harmony of body and mind through our guided yoga and meditation sessions.",
    icon: "/images/offerings/icon08-RNKGNCE.png",
    link: "/services/yoga-meditation",
  },
  {
    title: "Sound Healing",
    description:
      "Experience the power of sound healing in our serene sanctuary.",
    icon: "/images/offerings/icon-2-22-RNKGNCE.png",
    link: "/services/sound-healing",
  },
  {
    title: "Ice Bath and Breathwork",
    description:
      "Revitalize your body and mind with our invigorating ice bath and breathwork sessions.",
    icon: "/images/offerings/icon14-RNKGNCE.png",
    link: "/services/ice-bath-breathwork",
  },
  {
    title: "Ecstatic Dancing",
    description: "Dance your way to freedom and authentic self-expression.",
    icon: "/images/offerings/icon17-RNKGNCE.png",
    link: "/services/ecstatic-dancing",
  },
  {
    title: "Singing Circle",
    description:
      "Join our community in harmonious singing to uplift your spirit and connect with others.",
    icon: "/images/offerings/icon17-RNKGNCE.png",
    link: "/services/singing-circle",
  },
  {
    title: "Kakou Healing Ceremony",
    description:
      "Participate in our sacred Kakou healing ceremonies for deep spiritual transformation.",
    icon: "/images/offerings/icon24-RNKGNCE.png",
    link: "/services/kakou-healing-ceremony",
  },
  {
    title: "Energy Healing",
    description:
      "Balance your energy centers with our specialized healing sessions.",
    icon: "/images/offerings/icon-2-22-RNKGNCE.png",
    link: "/services/energy-healing",
  },
  {
    title: "Wellness Retreats",
    description:
      "Immerse yourself in transformative wellness experiences in our natural sanctuary.",
    icon: "/images/offerings/icon24-RNKGNCE.png",
    link: "/services/wellness-retreats",
  },
];

// Healer data
export const healersData: Healer[] = [
  {
    name: "Oshadi",
    role: "Sound Healer",
    image: "/images/healers/oshadi.png",
    link: "/healers/oshadi",
  },
  {
    name: "Alice",
    role: "Yoga Instructor",
    image: "/images/healers/alice.png",
    link: "/healers/alice",
  },
  {
    name: "Deborah",
    role: "Energy Healer",
    image: "/images/healers/deborah.png",
    link: "/healers/deborah",
  },
];

// Yoga and Meditation benefits
export const yogaBenefitsData: BenefitItem[] = [
  {
    title: "Physical Wellness",
    description: "Improved flexibility, strength, balance, and posture through mindful movement and alignment."
  },
  {
    title: "Mental Clarity",
    description: "Enhanced focus, concentration, and cognitive function through regular meditation practice."
  },
  {
    title: "Stress Reduction",
    description: "Lower cortisol levels and improved stress management through breathing techniques and mindfulness."
  },
  {
    title: "Emotional Balance",
    description: "Greater emotional regulation and resilience through self-awareness and inner reflection."
  }
];

// Oshadi's expertise
export const oshadiExpertiseData: BenefitItem[] = [
  {
    title: "Crystal Bowl Healing",
    description: "Mastery of crystal singing bowls tuned to specific chakra frequencies for deep healing."
  },
  {
    title: "Gong Therapy",
    description: "Expertise in therapeutic gong work for cellular healing and transformation."
  },
  {
    title: "Shamanic Journeying",
    description: "Guided shamanic practices for spiritual exploration and soul retrieval."
  },
  {
    title: "Energy Medicine",
    description: "Integration of various energy healing modalities for comprehensive wellness."
  }
];

// Yoga and Meditation sessions
export const yogaSessionsData: Session[] = [
  {
    title: "Hatha Yoga",
    duration: "60 minutes",
    description:
      "A gentle introduction to the most basic yoga postures focusing on alignment and breath awareness.",
  },
  {
    title: "Vinyasa Flow",
    duration: "75 minutes",
    description:
      "A dynamic practice that links breath with movement in a flowing sequence of postures.",
  },
  {
    title: "Restorative Yoga",
    duration: "90 minutes",
    description:
      "A deeply relaxing practice using props to support the body in passive poses for extended periods.",
  },
  {
    title: "Mindfulness Meditation",
    duration: "45 minutes",
    description:
      "Guided meditation focusing on present-moment awareness and breath observation.",
  },
];

// Oshadi's sessions
export const oshadiSessionsData: Session[] = [
  {
    title: "Private Sound Healing",
    duration: "60 minutes",
    description:
      "One-on-one session with crystal bowls and intuitive healing guidance.",
  },
  {
    title: "Group Sound Journey",
    duration: "90 minutes",
    description:
      "Shared healing experience in a group setting with various sound healing instruments.",
  },
  {
    title: "Shamanic Sound Bath",
    duration: "120 minutes",
    description:
      "Extended session combining sound healing with shamanic journeying techniques.",
  },
  {
    title: "Chakra Alignment",
    duration: "75 minutes",
    description:
      "Targeted session focusing on clearing and balancing specific energy centers.",
  },
];

// Data service functions
export const getDataService = () => {
  return {
    getServices: () => servicesData,
    getHealers: () => healersData,
    getYogaBenefits: () => yogaBenefitsData,
    getOshadiExpertise: () => oshadiExpertiseData,
    getYogaSessions: () => yogaSessionsData,
    getOshadiSessions: () => oshadiSessionsData,
  };
};