import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Have a question about ROA? Get in touch with our support team. We typically respond within 24 hours.",
  openGraph: {
    title: "Contact Us | ROA",
    description:
      "Have a question about ROA? Get in touch with our support team. We typically respond within 24 hours.",
    url: `${siteConfig.url}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
