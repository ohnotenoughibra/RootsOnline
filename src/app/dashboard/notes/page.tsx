"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Loader2, Trash2, Clock, Edit2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LessonNote {
  id: string;
  content: string;
  timestamp: number | null;
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
      };
    };
  };
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<LessonNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  async function deleteNote(noteId: string) {
    setDeleting(noteId);
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        toast.success("Note deleted");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
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
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Notes</h1>
        </div>

        {notes.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No notes yet</h2>
            <p className="text-muted-foreground mb-4">
              Take notes while watching lessons to remember key techniques.
            </p>
            <Link href="/courses">
              <Button>Start Learning</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id} className="p-4">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <Link
                      href={`/courses/${note.lesson.module.course.slug}/lesson/${note.lesson.id}`}
                      className="font-semibold hover:underline"
                    >
                      {note.lesson.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {note.lesson.module.course.title} &bull; {note.lesson.module.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {note.timestamp !== null && (
                      <Badge variant="secondary" className="shrink-0">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimestamp(note.timestamp)}
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNote(note.id)}
                      disabled={deleting === note.id}
                    >
                      {deleting === note.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                  {note.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(note.createdAt).toLocaleDateString()} at{" "}
                  {new Date(note.createdAt).toLocaleTimeString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
