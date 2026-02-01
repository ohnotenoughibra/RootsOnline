"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { locales, localeNames, type Locale } from "@/lib/i18n/dictionaries";

const LOCALE_STORAGE_KEY = "roa-locale";

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (saved && locales.includes(saved)) {
      setCurrentLocale(saved);
    } else {
      // Try to detect from browser
      const browserLang = navigator.language.split("-")[0] as Locale;
      if (locales.includes(browserLang)) {
        setCurrentLocale(browserLang);
        localStorage.setItem(LOCALE_STORAGE_KEY, browserLang);
      }
    }
  }, []);

  const handleLocaleChange = (locale: Locale) => {
    setCurrentLocale(locale);
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    // Dispatch custom event for components to react
    window.dispatchEvent(new CustomEvent("locale-change", { detail: locale }));
    // Reload page to apply translations (simpler approach)
    window.location.reload();
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <Globe className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={currentLocale === locale ? "bg-accent" : ""}
          >
            {localeNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook to get current locale
export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (saved && locales.includes(saved)) {
      setLocale(saved);
    }

    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };

    window.addEventListener("locale-change", handleLocaleChange as EventListener);
    return () => {
      window.removeEventListener("locale-change", handleLocaleChange as EventListener);
    };
  }, []);

  return locale;
}
