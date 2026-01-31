"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Loader2,
  SkipForward,
  AlertCircle,
  RotateCcw,
  Bookmark,
  StickyNote,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface BookmarkData {
  id: string;
  timestamp: number | null;
  label: string | null;
}

interface NoteData {
  id: string;
  timestamp: number | null;
  content: string;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onProgress?: (seconds: number) => void;
  onComplete?: () => void;
  onNextLesson?: () => void;
  autoPlay?: boolean;
  startTime?: number;
  title?: string;
  lessonId?: string;
  initialBookmarks?: BookmarkData[];
  initialNotes?: NoteData[];
}

export function VideoPlayer({
  src,
  poster,
  onProgress,
  onComplete,
  onNextLesson,
  autoPlay = false,
  startTime = 0,
  title,
  lessonId,
  initialBookmarks = [],
  initialNotes = [],
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Bookmark and notes state
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>(initialBookmarks);
  const [notes, setNotes] = useState<NoteData[]>(initialNotes);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [bookmarkLabel, setBookmarkLabel] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [bookmarkTimestamp, setBookmarkTimestamp] = useState(0);
  const [noteTimestamp, setNoteTimestamp] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      setHasError(false);
      // Resume from start time if provided
      if (startTime > 0 && startTime < video.duration) {
        video.currentTime = startTime;
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progressPercent = (video.currentTime / video.duration) * 100;
      setProgress(progressPercent);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowEndScreen(true);
      onComplete?.();
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
    };
  }, [onProgress, onComplete, startTime]);

  // Report progress periodically
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          onProgress?.(Math.floor(videoRef.current.currentTime));
        }
      }, 10000); // Every 10 seconds
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, onProgress]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    setShowEndScreen(false);
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const handleRetry = () => {
    const video = videoRef.current;
    if (!video) return;

    setHasError(false);
    setIsLoading(true);
    video.load();
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
    setShowEndScreen(false);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    video.currentTime = percentage * video.duration;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Bookmark handlers
  const openBookmarkDialog = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
    setBookmarkTimestamp(Math.floor(video.currentTime));
    setBookmarkLabel("");
    setShowBookmarkDialog(true);
  }, []);

  const handleAddBookmark = async () => {
    if (!lessonId) {
      toast.error("Cannot save bookmark for this lesson");
      return;
    }

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          timestamp: bookmarkTimestamp,
          label: bookmarkLabel || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to add bookmark");

      const bookmark = await res.json();
      setBookmarks((prev) => [...prev, bookmark]);
      setShowBookmarkDialog(false);
      toast.success("Bookmark saved!");
    } catch {
      toast.error("Failed to save bookmark");
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      const res = await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete bookmark");
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Bookmark deleted");
    } catch {
      toast.error("Failed to delete bookmark");
    }
  };

  // Note handlers
  const openNoteDialog = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
    setNoteTimestamp(Math.floor(video.currentTime));
    setNoteContent("");
    setShowNoteDialog(true);
  }, []);

  const handleAddNote = async () => {
    if (!lessonId || !noteContent.trim()) {
      toast.error("Please enter a note");
      return;
    }

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          timestamp: noteTimestamp,
          content: noteContent.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add note");

      const note = await res.json();
      setNotes((prev) => [...prev, note]);
      setShowNoteDialog(false);
      toast.success("Note saved!");
    } catch {
      toast.error("Failed to save note");
    }
  };

  // Jump to timestamp
  const jumpToTimestamp = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = seconds;
    video.play();
    setIsPlaying(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full"
        autoPlay={autoPlay}
        playsInline
        onClick={togglePlay}
      />

      {/* Loading overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
          <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
          <p className="text-lg font-medium mb-2">Video failed to load</p>
          <p className="text-sm text-gray-400 mb-4">
            Please check your connection and try again
          </p>
          <Button onClick={handleRetry} variant="secondary">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* End screen overlay */}
      {showEndScreen && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
          <p className="text-lg font-medium mb-4">Lesson Complete!</p>
          <div className="flex gap-3">
            <Button onClick={handleReplay} variant="outline" className="text-white border-white hover:bg-white/20">
              <RotateCcw className="h-4 w-4 mr-2" />
              Replay
            </Button>
            {onNextLesson && (
              <Button onClick={onNextLesson}>
                <SkipForward className="h-4 w-4 mr-2" />
                Next Lesson
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Play button overlay (when paused) */}
      {!isPlaying && !isLoading && !hasError && !showEndScreen && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <Play className="h-8 w-8 text-primary ml-1" />
          </div>
        </button>
      )}

      {/* Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress bar with markers */}
        <div
          className="mb-3 h-1 bg-white/30 rounded-full cursor-pointer group/progress relative"
          onClick={handleSeek}
        >
          {/* Bookmark markers */}
          {duration > 0 && bookmarks.map((bookmark) => (
            bookmark.timestamp !== null && (
              <div
                key={bookmark.id}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full cursor-pointer hover:scale-150 transition-transform z-10"
                style={{ left: `${(bookmark.timestamp / duration) * 100}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToTimestamp(bookmark.timestamp!);
                }}
                title={bookmark.label || `Bookmark at ${formatTime(bookmark.timestamp)}`}
              />
            )
          ))}
          {/* Note markers */}
          {duration > 0 && notes.map((note) => (
            note.timestamp !== null && (
              <div
                key={note.id}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full cursor-pointer hover:scale-150 transition-transform z-10"
                style={{ left: `${(note.timestamp / duration) * 100}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToTimestamp(note.timestamp!);
                }}
                title={note.content.substring(0, 50)}
              />
            )
          ))}
          {/* Progress fill */}
          <div
            className="h-full bg-primary rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <span className="text-xs text-white/80">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            {lessonId && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={openBookmarkDialog}
                title="Add bookmark at current time"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            )}

            {/* Note button */}
            {lessonId && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={openNoteDialog}
                title="Add note at current time"
              >
                <StickyNote className="h-4 w-4" />
              </Button>
            )}

            {/* Playback Speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-white hover:bg-white/20 text-xs px-2"
                >
                  {playbackSpeed}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-0">
                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                  <DropdownMenuItem
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={playbackSpeed === speed ? "bg-accent" : ""}
                  >
                    {speed}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Next Lesson */}
            {onNextLesson && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={onNextLesson}
                title="Next Lesson"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            )}

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bookmark Dialog */}
      <Dialog open={showBookmarkDialog} onOpenChange={setShowBookmarkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Timestamp: <span className="font-medium">{formatTime(bookmarkTimestamp)}</span>
              </p>
            </div>
            <div>
              <Input
                placeholder="Label (optional)"
                value={bookmarkLabel}
                onChange={(e) => setBookmarkLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddBookmark()}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowBookmarkDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBookmark}>Save Bookmark</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Timestamp: <span className="font-medium">{formatTime(noteTimestamp)}</span>
              </p>
            </div>
            <div>
              <Textarea
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote} disabled={!noteContent.trim()}>
                Save Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
