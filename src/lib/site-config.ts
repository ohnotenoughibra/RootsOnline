export const siteConfig = {
  name: "ROA - Roots Online Academy",
  shortName: "ROA",
  description:
    "World-class martial arts instruction from elite coaches. Learn MMA, Kickboxing, Grappling, and BJJ from anywhere in the world.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://rootsonline.academy",
  ogImage: "/og-image.jpg",
  links: {
    instagram: "https://instagram.com/rootsonline",
    youtube: "https://youtube.com/@rootsonline",
  },
  creator: "Roots Online Academy",
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
