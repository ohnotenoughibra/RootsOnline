import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UserProvider } from "@/components/providers/user-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ROA - Roots Online Academy",
    template: "%s | ROA",
  },
  description:
    "World-class martial arts instruction from elite coaches. Learn MMA, Kickboxing, and Grappling from anywhere in the world.",
  keywords: [
    "martial arts",
    "MMA",
    "kickboxing",
    "grappling",
    "BJJ",
    "online courses",
    "training",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <UserProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="bottom-right" />
          </UserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
