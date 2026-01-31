"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { OnboardingModal } from "./onboarding-modal";

export function OnboardingCheck() {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasChecked) return;

    // Don't show onboarding on auth pages
    if (
      pathname?.startsWith("/sign-in") ||
      pathname?.startsWith("/sign-up") ||
      pathname?.startsWith("/api")
    ) {
      return;
    }

    const checkOnboarding = async () => {
      try {
        const response = await fetch("/api/onboarding");
        const data = await response.json();
        if (!data.completed) {
          setShowOnboarding(true);
        }
        setHasChecked(true);
      } catch (error) {
        console.error("Failed to check onboarding:", error);
        setHasChecked(true);
      }
    };

    checkOnboarding();
  }, [isLoaded, isSignedIn, pathname, hasChecked]);

  if (!showOnboarding) return null;

  return (
    <OnboardingModal
      isOpen={showOnboarding}
      onClose={() => setShowOnboarding(false)}
    />
  );
}
