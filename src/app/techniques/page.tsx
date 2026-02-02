"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Play, BookOpen } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getDisciplineLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TechniqueTag {
  id: string;
  name: string;
  slug: string;
  discipline: "MMA" | "KICKBOXING" | "GRAPPLING";
  description: string | null;
  _count: {
    lessons: number;
  };
}

interface TechniqueCategory {
  name: string;
  techniques: TechniqueTag[];
}

// Organize techniques into categories based on their names
function categorizeTechniques(techniques: TechniqueTag[]): TechniqueCategory[] {
  const categories: Record<string, TechniqueTag[]> = {
    "Positions": [],
    "Submissions - Chokes": [],
    "Submissions - Joint Locks": [],
    "Leg Locks": [],
    "Sweeps": [],
    "Guard Passing": [],
    "Takedowns & Wrestling": [],
    "Escapes & Defense": [],
    "Back Attacks": [],
    "Striking - Punches": [],
    "Striking - Kicks": [],
    "Clinch Work": [],
    "Defense & Movement": [],
    "Other": [],
  };

  techniques.forEach((tech) => {
    const name = tech.name.toLowerCase();

    // Categorize based on keywords
    if (name.includes("guard") && !name.includes("pass") && !name.includes("retention")) {
      categories["Positions"].push(tech);
    } else if (name.includes("mount") || name.includes("control") || name.includes("position") || name.includes("turtle") || name.includes("50/50") || name.includes("saddle")) {
      categories["Positions"].push(tech);
    } else if (name.includes("choke") || name.includes("guillotine") || name.includes("darce") || name.includes("anaconda") || name.includes("rnc") || name.includes("rear naked") || name.includes("triangle") && !name.includes("arm")) {
      categories["Submissions - Chokes"].push(tech);
    } else if (name.includes("armbar") || name.includes("kimura") || name.includes("americana") || name.includes("omoplata") || name.includes("wrist")) {
      categories["Submissions - Joint Locks"].push(tech);
    } else if (name.includes("heel hook") || name.includes("knee bar") || name.includes("toe hold") || name.includes("calf") || name.includes("ankle") || name.includes("ashi") || name.includes("leg lock")) {
      categories["Leg Locks"].push(tech);
    } else if (name.includes("sweep") || name.includes("berimbolo")) {
      categories["Sweeps"].push(tech);
    } else if (name.includes("pass")) {
      categories["Guard Passing"].push(tech);
    } else if (name.includes("takedown") || name.includes("double leg") || name.includes("single leg") || name.includes("body lock") || name.includes("snap") || name.includes("arm drag") || name.includes("ankle pick") || name.includes("sprawl")) {
      categories["Takedowns & Wrestling"].push(tech);
    } else if (name.includes("escape") || name.includes("defense") || name.includes("retention")) {
      categories["Escapes & Defense"].push(tech);
    } else if (name.includes("back take") || name.includes("back attack") || name.includes("chair") || name.includes("kiss of") || name.includes("truck")) {
      categories["Back Attacks"].push(tech);
    } else if (name.includes("jab") || name.includes("cross") || name.includes("hook") || name.includes("uppercut") || name.includes("overhand") || name.includes("punch") || name.includes("combination")) {
      categories["Striking - Punches"].push(tech);
    } else if (name.includes("kick") || name.includes("teep") || name.includes("roundhouse")) {
      categories["Striking - Kicks"].push(tech);
    } else if (name.includes("clinch") || name.includes("knee") || name.includes("elbow") || name.includes("dirty boxing")) {
      categories["Clinch Work"].push(tech);
    } else if (name.includes("footwork") || name.includes("head movement") || name.includes("block") || name.includes("parry") || name.includes("slip") || name.includes("check") || name.includes("counter")) {
      categories["Defense & Movement"].push(tech);
    } else {
      categories["Other"].push(tech);
    }
  });

  // Convert to array and filter empty categories
  return Object.entries(categories)
    .filter(([_, techs]) => techs.length > 0)
    .map(([name, techniques]) => ({ name, techniques }));
}

export default function TechniquesPage() {
  const [techniques, setTechniques] = useState<TechniqueTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedTechnique, setSelectedTechnique] = useState<TechniqueTag | null>(null);

  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        const response = await fetch("/api/techniques");
        if (response.ok) {
          const data = await response.json();
          setTechniques(data.techniques || []);
        }
      } catch (error) {
        console.error("Error fetching techniques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechniques();
  }, []);

  // Filter techniques
  const filteredTechniques = techniques.filter((tech) => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiscipline = selectedDiscipline === "all" || tech.discipline === selectedDiscipline;
    return matchesSearch && matchesDiscipline;
  });

  // Categorize filtered techniques
  const categories = categorizeTechniques(filteredTechniques);

  // Get discipline stats
  const disciplineStats = {
    GRAPPLING: techniques.filter(t => t.discipline === "GRAPPLING").length,
    MMA: techniques.filter(t => t.discipline === "MMA").length,
    KICKBOXING: techniques.filter(t => t.discipline === "KICKBOXING").length,
  };

  const disciplines = [
    { id: "all", name: "All", count: techniques.length },
    { id: "GRAPPLING", name: "Grappling", count: disciplineStats.GRAPPLING },
    { id: "MMA", name: "MMA", count: disciplineStats.MMA },
    { id: "KICKBOXING", name: "Kickboxing", count: disciplineStats.KICKBOXING },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Technique Library
          </h1>
          <p className="mt-4 text-muted-foreground">
            Browse our complete library of martial arts techniques. Find specific moves,
            explore positions, and discover related content.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            {/* Discipline filters */}
            <div className="flex flex-wrap gap-2">
              {disciplines.map((discipline) => (
                <button
                  key={discipline.id}
                  onClick={() => setSelectedDiscipline(discipline.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    selectedDiscipline === discipline.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground/50"
                  )}
                >
                  {discipline.name} ({discipline.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search techniques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Categories List */}
              <div className="lg:col-span-2 space-y-12">
                {categories.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No techniques found matching your search.
                  </div>
                ) : (
                  categories.map((category) => (
                    <div key={category.name}>
                      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        {category.name}
                        <span className="text-sm font-normal text-muted-foreground">
                          ({category.techniques.length})
                        </span>
                      </h2>
                      <div className="space-y-2">
                        {category.techniques.map((tech) => (
                          <button
                            key={tech.id}
                            onClick={() => setSelectedTechnique(tech)}
                            className={cn(
                              "w-full text-left p-4 rounded-lg border transition-all",
                              selectedTechnique?.id === tech.id
                                ? "border-foreground bg-muted"
                                : "border-border hover:border-foreground/50"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium">{tech.name}</h3>
                                {tech.description && (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                    {tech.description}
                                  </p>
                                )}
                                <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                                  <span>{getDisciplineLabel(tech.discipline)}</span>
                                  {tech._count.lessons > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Play className="h-3 w-3" />
                                      {tech._count.lessons} lessons
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-4" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Selected Technique Detail */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  {selectedTechnique ? (
                    <div className="rounded-xl border p-6">
                      <p className="text-sm text-muted-foreground mb-2">
                        {getDisciplineLabel(selectedTechnique.discipline)}
                      </p>
                      <h3 className="text-xl font-bold mb-3">{selectedTechnique.name}</h3>

                      {selectedTechnique.description && (
                        <p className="text-muted-foreground mb-6">
                          {selectedTechnique.description}
                        </p>
                      )}

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Available Lessons</span>
                          <span className="font-medium">{selectedTechnique._count.lessons}</span>
                        </div>

                        {selectedTechnique._count.lessons > 0 ? (
                          <Link href={`/techniques/${selectedTechnique.slug}`}>
                            <Button className="w-full">
                              View Lessons
                            </Button>
                          </Link>
                        ) : (
                          <Button className="w-full" disabled variant="outline">
                            Coming Soon
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border p-6 text-center text-muted-foreground">
                      <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>Select a technique to see details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
