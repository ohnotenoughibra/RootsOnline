import { create } from "zustand";
import type { User, SubscriptionStatus, Role } from "@/types";

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  updateSubscription: (status: SubscriptionStatus, endsAt?: Date | null) => void;
  hasActiveSubscription: () => boolean;
  isCoach: () => boolean;
  isAdmin: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  updateSubscription: (status, endsAt) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            subscriptionStatus: status,
            subscriptionEndsAt: endsAt || null,
          }
        : null,
    })),

  hasActiveSubscription: () => {
    const { user } = get();
    if (!user) return false;
    const activeStatuses: SubscriptionStatus[] = ["ACTIVE", "TRIALING"];
    return activeStatuses.includes(user.subscriptionStatus);
  },

  isCoach: () => {
    const { user } = get();
    if (!user) return false;
    const coachRoles: Role[] = ["COACH", "ADMIN"];
    return coachRoles.includes(user.role);
  },

  isAdmin: () => {
    const { user } = get();
    if (!user) return false;
    return user.role === "ADMIN";
  },
}));
