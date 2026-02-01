"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Loader2,
  Tag,
  PlayCircle,
  Filter,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Technique {
  id: string;
  name: string;
  slug: string;
  discipline: string;
  description?: string;
  _count: {
    lessons: number;
  };
}

const disciplineLabels: Record<string, string> = {
  MMA: "MMA",
  KICKBOXING: "Kickboxing",
  GRAPPLING: "Grappling",
};

export default function TechniquesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [discipline, setDiscipline] = useState(searchParams.get("discipline") || "all");

  useEffect(() => {
    fetchTechniques();
  }, [discipline]);

  const fetchTechniques = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (discipline && discipline !== "all") {
        params.set("discipline", discipline);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const response = await fetch(`/api/techniques?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTechniques(data.techniques);
      }
    } catch (error) {
      console.error("Error fetching techniques:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTechniques();

    // Update URL
    const params = new URLSearchParams();
    if (discipline && discipline !== "all") params.set("discipline", discipline);
    if (searchQuery) params.set("search", searchQuery);
    router.push(`/techniques?${params}`);
  };

  // Group techniques by discipline
  const techniquesByDiscipline = techniques.reduce<Record<string, Technique[]>>(
    (acc, technique) => {
      const disc = technique.discipline;
      if (!acc[disc]) acc[disc] = [];
      acc[disc].push(technique);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Technique Library
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse our comprehensive collection of martial arts techniques.
              Find specific techniques and discover lessons that cover them.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search techniques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={discipline} onValueChange={setDiscipline}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Disciplines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Disciplines</SelectItem>
                <SelectItem value="MMA">MMA</SelectItem>
                <SelectItem value="KICKBOXING">Kickboxing</SelectItem>
                <SelectItem value="GRAPPLING">Grappling</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Search</Button>
          </form>
        </div>
      </section>

      {/* Techniques List */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : techniques.length === 0 ? (
            <div className="text-center py-16">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold">No techniques found</h2>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? "Try a different search term"
                  : "Techniques will be added soon"}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(techniquesByDiscipline).map(([disc, techs]) => (
                <div key={disc}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    {disciplineLabels[disc] || disc}
                    <Badge variant="secondary">{techs.length} techniques</Badge>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {techs.map((technique) => (
                      <Link key={technique.id} href={`/techniques/${technique.slug}`}>
                        <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">
                                  {technique.name}
                                </h3>
                                {technique.description && (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {technique.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-3">
                                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {technique._count.lessons} lessons
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
