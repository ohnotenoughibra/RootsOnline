import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Get unlimited access to world-class martial arts instruction. Start for €19.99/month or save with our €199/year annual plan. Cancel anytime.",
  openGraph: {
    title: "Pricing - Train Like a Champion | ROA",
    description:
      "Get unlimited access to world-class martial arts instruction. Start for €19.99/month or save with our €199/year annual plan.",
    url: `${siteConfig.url}/pricing`,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
