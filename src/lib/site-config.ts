export const siteConfig = {
  name: "Roots Collective",
  shortName: "Roots",
  description:
    "Learn MMA, kickboxing, and grappling from coaches who care. We're a group of friends growing the martial arts community together.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://rootscollective.at",
  ogImage: "/og-image.jpg",
  links: {
    instagram: "https://instagram.com/rootscollective_ibk",
    youtube: "https://youtube.com/@rootscollective",
  },
  creator: "Roots Collective",
  keywords: [
    "martial arts",
    "MMA",
    "kickboxing",
    "grappling",
    "BJJ",
    "Brazilian Jiu-Jitsu",
    "online courses",
    "training",
    "self defense",
    "combat sports",
    "leg locks",
    "wrestling",
    "muay thai",
    "dutch kickboxing",
  ],
  authors: [{ name: "ROA", url: "https://rootsonline.academy" }],
  pricing: {
    monthly: { amount: 19.99, currency: "EUR", label: "€19.99/month" },
    annual: { amount: 199, currency: "EUR", label: "€199/year" },
  },
  support: {
    email: "support@rootsonline.academy",
  },
};

export type SiteConfig = typeof siteConfig;
