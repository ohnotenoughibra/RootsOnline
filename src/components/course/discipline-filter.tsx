"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const disciplines = [
  { value: null, label: "All" },
  { value: "MMA", label: "MMA" },
  { value: "KICKBOXING", label: "Kickboxing" },
  { value: "GRAPPLING", label: "Grappling" },
] as const;

export function DisciplineFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDiscipline = searchParams.get("discipline");

  const handleFilter = (discipline: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (discipline) {
      params.set("discipline", discipline);
    } else {
      params.delete("discipline");
    }
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {disciplines.map((discipline) => (
        <Button
          key={discipline.label}
          variant={currentDiscipline === discipline.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilter(discipline.value)}
          className={cn(
            "rounded-full",
            discipline.value === "MMA" && currentDiscipline === "MMA" && "bg-red-500 hover:bg-red-600",
            discipline.value === "KICKBOXING" && currentDiscipline === "KICKBOXING" && "bg-orange-500 hover:bg-orange-600",
            discipline.value === "GRAPPLING" && currentDiscipline === "GRAPPLING" && "bg-blue-500 hover:bg-blue-600"
          )}
        >
          {discipline.label}
        </Button>
      ))}
    </div>
  );
}
