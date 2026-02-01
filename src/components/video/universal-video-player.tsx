"use client";

import { useState, useEffect } from "react";
import { VideoPlayer } from "./video-player";
import { Loader2, AlertCircle, RotateCcw, SkipForward, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UniversalVideoPlayerProps {
  src: string;
  poster?: string;
  onProgress?: (seconds: number) => void;
  onComplete?: () => void;
  onNextLesson?: () => void;
  autoPlay?: boolean;
  startTime?: number;
  title?: string;
  lessonId?: string;
}

// Helper to detect video source type
function getVideoSourceType(url: string): "youtube" | "vimeo" | "direct" {
  if (!url) return "direct";

  // YouTube patterns
  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("youtube-nocookie.com")
  ) {
    return "youtube";
  }

  // Vimeo patterns
  if (url.includes("vimeo.com") || url.includes("player.vimeo.com")) {
    return "vimeo";
  }

  return "direct";
}

// Extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Handle youtu.be format
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com/watch?v= format
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];

  // Handle youtube.com/embed/ format
  const embedMatch = url.match(/embed\/([^?&]+)/);
  if (embedMatch) return embedMatch[1];

  // Handle youtube.com/v/ format
  const vMatch = url.match(/youtube\.com\/v\/([^?&]+)/);
  if (vMatch) return vMatch[1];

  return null;
}

// Extract Vimeo video ID
function getVimeoVideoId(url: string): string | null {
  if (!url) return null;

  // Handle vimeo.com/123456 format
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (match) return match[1];

  // Handle player.vimeo.com/video/123456 format
  const playerMatch = url.match(/player\.vimeo\.com\/video\/(\d+)/);
  if (playerMatch) return playerMatch[1];

  return null;
}

// YouTube Embed Component
function YouTubeEmbed({
  videoId,
  autoPlay,
  startTime = 0,
  onComplete,
  onNextLesson,
}: {
  videoId: string;
  autoPlay?: boolean;
  startTime?: number;
  onComplete?: () => void;
  onNextLesson?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);

  // Build YouTube embed URL with parameters
  const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  embedUrl.searchParams.set("rel", "0"); // Don't show related videos
  embedUrl.searchParams.set("modestbranding", "1"); // Minimal branding
  embedUrl.searchParams.set("enablejsapi", "1"); // Enable JS API
  if (autoPlay) embedUrl.searchParams.set("autoplay", "1");
  if (startTime > 0) embedUrl.searchParams.set("start", String(Math.floor(startTime)));

  useEffect(() => {
    // Listen for YouTube player events via postMessage
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube-nocookie.com") return;

      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // YouTube sends playerState changes
        // 0 = ended, 1 = playing, 2 = paused
        if (data.event === "onStateChange" && data.info === 0) {
          setShowEndScreen(true);
          onComplete?.();
        }
      } catch {
        // Ignore parsing errors
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComplete]);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
  };

  const handleReplay = () => {
    setShowEndScreen(false);
    // Reload iframe to restart video
    const iframe = document.querySelector(`iframe[src*="${videoId}"]`) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = embedUrl.toString();
    }
  };

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-10">
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

      {showEndScreen && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-10">
          <p className="text-lg font-medium mb-4">Lesson Complete!</p>
          <div className="flex gap-3">
            <Button
              onClick={handleReplay}
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
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

      <iframe
        src={embedUrl.toString()}
        className={cn(
          "w-full h-full",
          (isLoading || hasError || showEndScreen) && "invisible"
        )}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

// Vimeo Embed Component
function VimeoEmbed({
  videoId,
  autoPlay,
  startTime = 0,
  onComplete,
  onNextLesson,
}: {
  videoId: string;
  autoPlay?: boolean;
  startTime?: number;
  onComplete?: () => void;
  onNextLesson?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);

  // Build Vimeo embed URL
  const embedUrl = new URL(`https://player.vimeo.com/video/${videoId}`);
  embedUrl.searchParams.set("byline", "0");
  embedUrl.searchParams.set("portrait", "0");
  if (autoPlay) embedUrl.searchParams.set("autoplay", "1");
  if (startTime > 0) embedUrl.searchParams.set("t", `${Math.floor(startTime)}s`);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
  };

  const handleReplay = () => {
    setShowEndScreen(false);
    const iframe = document.querySelector(`iframe[src*="${videoId}"]`) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = embedUrl.toString();
    }
  };

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-10">
          <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
          <p className="text-lg font-medium mb-2">Video failed to load</p>
          <Button onClick={handleRetry} variant="secondary">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {showEndScreen && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-10">
          <p className="text-lg font-medium mb-4">Lesson Complete!</p>
          <div className="flex gap-3">
            <Button
              onClick={handleReplay}
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
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

      <iframe
        src={embedUrl.toString()}
        className={cn(
          "w-full h-full",
          (isLoading || hasError || showEndScreen) && "invisible"
        )}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

export function UniversalVideoPlayer({
  src,
  poster,
  onProgress,
  onComplete,
  onNextLesson,
  autoPlay = false,
  startTime = 0,
  title,
  lessonId,
}: UniversalVideoPlayerProps) {
  const sourceType = getVideoSourceType(src);

  // YouTube video
  if (sourceType === "youtube") {
    const videoId = getYouTubeVideoId(src);
    if (!videoId) {
      return (
        <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <p>Invalid YouTube URL</p>
          </div>
        </div>
      );
    }

    return (
      <YouTubeEmbed
        videoId={videoId}
        autoPlay={autoPlay}
        startTime={startTime}
        onComplete={onComplete}
        onNextLesson={onNextLesson}
      />
    );
  }

  // Vimeo video
  if (sourceType === "vimeo") {
    const videoId = getVimeoVideoId(src);
    if (!videoId) {
      return (
        <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <p>Invalid Vimeo URL</p>
          </div>
        </div>
      );
    }

    return (
      <VimeoEmbed
        videoId={videoId}
        autoPlay={autoPlay}
        startTime={startTime}
        onComplete={onComplete}
        onNextLesson={onNextLesson}
      />
    );
  }

  // Direct video file - use existing VideoPlayer
  return (
    <VideoPlayer
      src={src}
      poster={poster}
      onProgress={onProgress}
      onComplete={onComplete}
      onNextLesson={onNextLesson}
      autoPlay={autoPlay}
      startTime={startTime}
      title={title}
      lessonId={lessonId}
    />
  );
}
