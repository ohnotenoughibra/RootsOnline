"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, ChevronDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UniversalVideoPlayer } from "@/components/video/universal-video-player";

interface VideoAngle {
  id: string;
  angleLabel: string;
  videoUrl: string;
  videoDuration?: number;
  isDefault: boolean;
  order: number;
}

interface MultiAnglePlayerProps {
  lessonId: string;
  defaultVideoUrl?: string;
  title?: string;
  onProgress?: (seconds: number) => void;
  onComplete?: () => void;
  onNextLesson?: () => void;
}

export function MultiAnglePlayer({
  lessonId,
  defaultVideoUrl,
  title,
  onProgress,
  onComplete,
  onNextLesson,
}: MultiAnglePlayerProps) {
  const [angles, setAngles] = useState<VideoAngle[]>([]);
  const [currentAngle, setCurrentAngle] = useState<VideoAngle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    fetchAngles();
  }, [lessonId]);

  const fetchAngles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/lessons/${lessonId}/angles`);
      if (response.ok) {
        const data = await response.json();
        setAngles(data.angles);

        // Set default angle
        const defaultAngle =
          data.angles.find((a: VideoAngle) => a.isDefault) || data.angles[0];
        if (defaultAngle) {
          setCurrentAngle(defaultAngle);
        }
      }
    } catch (error) {
      console.error("Error fetching angles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAngleChange = (angle: VideoAngle) => {
    // Store current time before switching
    const video = document.querySelector("video");
    if (video) {
      setCurrentTime(video.currentTime);
    }
    setCurrentAngle(angle);
  };

  // Handle video loaded - seek to stored time when switching angles
  const handleVideoLoad = () => {
    const video = document.querySelector("video");
    if (video && currentTime > 0) {
      video.currentTime = currentTime;
    }
  };

  // If no extra angles, just use the default player
  if (!loading && angles.length === 0) {
    return (
      <UniversalVideoPlayer
        src={defaultVideoUrl || ""}
        title={title}
        lessonId={lessonId}
        onProgress={onProgress}
        onComplete={onComplete}
        onNextLesson={onNextLesson}
      />
    );
  }

  const videoSrc = currentAngle?.videoUrl || defaultVideoUrl || "";

  return (
    <div className="relative">
      {/* Video Player */}
      <div className="relative" onLoadedData={handleVideoLoad}>
        <UniversalVideoPlayer
          src={videoSrc}
          title={title}
          lessonId={lessonId}
          onProgress={onProgress}
          onComplete={onComplete}
          onNextLesson={onNextLesson}
        />
      </div>

      {/* Angle Selector */}
      {angles.length > 0 && (
        <div className="absolute top-4 right-4 z-10">
          {loading ? (
            <Button size="sm" variant="secondary" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-black/70 hover:bg-black/90 text-white border-0"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {currentAngle?.angleLabel || "Angle"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {angles.map((angle) => (
                  <DropdownMenuItem
                    key={angle.id}
                    onClick={() => handleAngleChange(angle)}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      {angle.angleLabel}
                    </span>
                    {currentAngle?.id === angle.id && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Angle Quick Switch Bar (for multiple angles) */}
      {angles.length > 1 && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-muted/50 rounded-lg">
          <Camera className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground mr-2">Angles:</span>
          <div className="flex gap-2 flex-wrap">
            {angles.map((angle) => (
              <Button
                key={angle.id}
                size="sm"
                variant={currentAngle?.id === angle.id ? "default" : "outline"}
                onClick={() => handleAngleChange(angle)}
                className="h-7 text-xs"
              >
                {angle.angleLabel}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
