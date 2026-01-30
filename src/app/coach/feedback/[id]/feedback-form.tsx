"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeedbackFormProps {
  footageId: string;
}

export function FeedbackForm({ footageId }: FeedbackFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPublicId, setVideoPublicId] = useState("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a video file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("Video must be less than 100MB");
      return;
    }

    setVideoPreview(URL.createObjectURL(file));
    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "video");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      setVideoUrl(data.url);
      setVideoPublicId(data.publicId);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload video");
      setVideoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Please provide feedback content");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/footage/${footageId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          rating: rating ? parseInt(rating) : null,
          videoUrl: videoUrl || null,
          videoPublicId: videoPublicId || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit feedback");
      }

      router.refresh();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Written Feedback */}
      <div className="space-y-2">
        <Label htmlFor="content">Your Feedback</Label>
        <Textarea
          id="content"
          placeholder="Provide detailed feedback on technique, form, areas for improvement, etc."
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label htmlFor="rating">Rating (Optional)</Label>
        <Select value={rating} onValueChange={setRating}>
          <SelectTrigger>
            <SelectValue placeholder="Select a rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Needs Significant Work</SelectItem>
            <SelectItem value="2">2 - Below Average</SelectItem>
            <SelectItem value="3">3 - Average</SelectItem>
            <SelectItem value="4">4 - Good</SelectItem>
            <SelectItem value="5">5 - Excellent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Video Response */}
      <div className="space-y-2">
        <Label>Video Response (Optional)</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Record a video response to provide more detailed feedback
        </p>
        <div className="border-2 border-dashed rounded-lg p-4">
          {videoPreview ? (
            <div className="space-y-3">
              <video
                src={videoPreview}
                controls
                className="w-full rounded-md max-h-48"
              />
              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              )}
              {videoUrl && (
                <p className="text-sm text-green-600 text-center">
                  Video uploaded
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setVideoPreview(null);
                  setVideoUrl("");
                  setVideoPublicId("");
                }}
                className="w-full"
              >
                Remove Video
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center cursor-pointer py-4">
              <Video className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm">Click to upload video response</span>
              <span className="text-xs text-muted-foreground mt-1">
                MP4, MOV, or WebM (max 100MB)
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || isUploading || !content.trim()}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting Feedback...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </>
        )}
      </Button>
    </form>
  );
}
