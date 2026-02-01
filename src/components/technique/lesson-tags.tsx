"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface TechniqueTag {
  id: string;
  name: string;
  slug: string;
  discipline: string;
}

interface LessonTagsProps {
  lessonId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LessonTags({ lessonId, open, onOpenChange }: LessonTagsProps) {
  const [tags, setTags] = useState<TechniqueTag[]>([]);
  const [allTechniques, setAllTechniques] = useState<TechniqueTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, lessonId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch lesson tags and all techniques in parallel
      const [tagsRes, techniquesRes] = await Promise.all([
        fetch(`/api/lessons/${lessonId}/tags`),
        fetch("/api/techniques"),
      ]);

      if (tagsRes.ok) {
        const data = await tagsRes.json();
        setTags(data.tags);
      }

      if (techniquesRes.ok) {
        const data = await techniquesRes.json();
        setAllTechniques(data.techniques);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (technique: TechniqueTag) => {
    setAdding(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagId: technique.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add tag");
      }

      setTags((prev) => [...prev, technique]);
      toast.success(`Added "${technique.name}" tag`);
    } catch (error) {
      console.error("Error adding tag:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add tag");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveTag = async (technique: TechniqueTag) => {
    try {
      const response = await fetch(
        `/api/lessons/${lessonId}/tags?tagId=${technique.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to remove tag");
      }

      setTags((prev) => prev.filter((t) => t.id !== technique.id));
      toast.success(`Removed "${technique.name}" tag`);
    } catch (error) {
      console.error("Error removing tag:", error);
      toast.error("Failed to remove tag");
    }
  };

  const availableTechniques = allTechniques.filter(
    (t) => !tags.some((tag) => tag.id === t.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Technique Tags
          </DialogTitle>
          <DialogDescription>
            Tag this lesson with techniques it covers
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current tags */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Current Tags
              </label>
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No techniques tagged yet
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="text-sm pl-3 pr-1 py-1"
                    >
                      {tag.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1 hover:bg-destructive/20"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Add new tags */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Add Techniques
              </label>
              <Command className="border rounded-lg">
                <CommandInput placeholder="Search techniques..." />
                <CommandList className="max-h-48">
                  <CommandEmpty>No techniques found</CommandEmpty>
                  <CommandGroup>
                    {availableTechniques.map((technique) => (
                      <CommandItem
                        key={technique.id}
                        value={technique.name}
                        onSelect={() => handleAddTag(technique)}
                        disabled={adding}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        <span className="flex-1">{technique.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {technique.discipline}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
