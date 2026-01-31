"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Loader2, Trash2, Play } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BookmarkedLesson {
  id: string;
  lessonId: string;
  createdAt: string;
  lesson: {
    id: string;
    title: string;
    module: {
      title: string;
      course: {
        id: string;
        title: string;
        slug: string;
        coverImage: string | null;
      };
    };
  };
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  async function fetchBookmarks() {
    try {
      const response = await fetch("/api/bookmarks");
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  }

  async function removeBookmark(lessonId: string) {
    setDeleting(lessonId);
    try {
      const response = await fetch(`/api/bookmarks/${lessonId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setBookmarks((prev) => prev.filter((b) => b.lessonId !== lessonId));
        toast.success("Bookmark removed");
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Bookmarks</h1>
        </div>

        {bookmarks.length === 0 ? (
          <Card className="p-12 text-center">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground mb-4">
              Save lessons to watch later by clicking the bookmark icon while viewing.
            </p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="p-4 flex gap-4">
                {bookmark.lesson.module.course.coverImage && (
                  <div className="relative w-32 h-20 rounded overflow-hidden shrink-0">
                    <Image
                      src={bookmark.lesson.module.course.coverImage}
                      alt={bookmark.lesson.module.course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{bookmark.lesson.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {bookmark.lesson.module.course.title} &bull; {bookmark.lesson.module.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/courses/${bookmark.lesson.module.course.slug}/lesson/${bookmark.lessonId}`}>
                    <Button size="sm" variant="default">
                      <Play className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBookmark(bookmark.lessonId)}
                    disabled={deleting === bookmark.lessonId}
                  >
                    {deleting === bookmark.lessonId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
