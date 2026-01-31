"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUPPORTED_LANGUAGES, getLanguageFlag, getLanguageLabel } from "@/lib/utils";

export function LanguageFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLanguage = searchParams.get("language");

  const handleLanguageChange = (language: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (language) {
      params.set("language", language);
    } else {
      params.delete("language");
    }

    router.push(`/courses?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {currentLanguage ? (
            <>
              <span>{getLanguageFlag(currentLanguage)}</span>
              <span className="hidden sm:inline">{getLanguageLabel(currentLanguage)}</span>
            </>
          ) : (
            <>
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">All Languages</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => handleLanguageChange(null)}>
          <Globe className="h-4 w-4 mr-2" />
          All Languages
        </DropdownMenuItem>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
