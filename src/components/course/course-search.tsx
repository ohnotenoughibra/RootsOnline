"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CourseSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`/courses?${params.toString()}`);
    });
  }

  function handleClear() {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");

    startTransition(() => {
      router.push(`/courses?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-sm ml-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        name="search"
        placeholder="Search courses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-20"
      />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button type="submit" size="sm" className="h-7" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </form>
  );
}
