"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/store/user-store";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) return;

      if (!clerkUser) {
        setUser(null);
        return;
      }

      try {
        // Fetch user from our database
        const response = await fetch("/api/user/sync", {
          method: "POST",
        });

        if (response.ok) {
          const { user } = await response.json();
          setUser(user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error syncing user:", error);
        setLoading(false);
      }
    };

    syncUser();
  }, [clerkUser, isLoaded, setUser, setLoading]);

  return <>{children}</>;
}
