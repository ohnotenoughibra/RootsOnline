import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";
  return first + last || "U";
}

export function calculateProgress(watched: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(Math.round((watched / total) * 100), 100);
}

export function getDisciplineLabel(discipline: string): string {
  const labels: Record<string, string> = {
    MMA: "MMA",
    KICKBOXING: "Kickboxing",
    GRAPPLING: "Grappling",
    BUSINESS: "Business",
  };
  return labels[discipline] || discipline;
}

export function getDisciplineColor(discipline: string): string {
  const colors: Record<string, string> = {
    MMA: "bg-red-500",
    KICKBOXING: "bg-orange-500",
    GRAPPLING: "bg-blue-500",
    BUSINESS: "bg-emerald-500",
  };
  return colors[discipline] || "bg-gray-500";
}

export function getLanguageLabel(language: string): string {
  const labels: Record<string, string> = {
    EN: "English",
    DE: "Deutsch",
    ES: "Español",
    PT: "Português",
    FR: "Français",
  };
  return labels[language] || language;
}

export function getLanguageFlag(language: string): string {
  const flags: Record<string, string> = {
    EN: "🇬🇧",
    DE: "🇩🇪",
    ES: "🇪🇸",
    PT: "🇵🇹",
    FR: "🇫🇷",
  };
  return flags[language] || "🌐";
}

export const SUPPORTED_LANGUAGES = [
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "ES", label: "Español", flag: "🇪🇸" },
  { code: "PT", label: "Português", flag: "🇵🇹" },
  { code: "FR", label: "Français", flag: "🇫🇷" },
] as const;
