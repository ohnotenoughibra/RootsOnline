"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Video, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UploadFootagePage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discipline: "",
    videoUrl: "",
    videoPublicId: "",
  });
  const [error, setError] = useState("");

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file");
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError("Video must be less than 100MB");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setError("");

    // Upload directly to Cloudinary (bypasses Vercel's 4.5MB limit)
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      if (!cloudName) {
        throw new Error("Cloudinary is not configured");
      }

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("upload_preset", "roa_unsigned");
      uploadFormData.append("folder", "roa-footage");

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));

        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
        xhr.send(uploadFormData);
      });

      setFormData((prev) => ({
        ...prev,
        videoUrl: result.secure_url,
        videoPublicId: result.public_id,
      }));
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload video");
      setVideoFile(null);
      setVideoPreview(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!formData.discipline) {
      setError("Please select a discipline");
      return;
    }

    if (!formData.videoUrl) {
      setError("Please upload a video");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/footage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit footage");
      }

      router.push("/footage");
      router.refresh();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit footage");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/footage"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Footage
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Upload Training Footage</CardTitle>
            <p className="text-sm text-muted-foreground">
              Submit your training video for coach review and feedback
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Video Upload */}
              <div className="space-y-2">
                <Label>Video</Label>
                <div className="border-2 border-dashed rounded-lg p-6">
                  {videoPreview ? (
                    <div className="space-y-4">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full rounded-md max-h-64"
                      />
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading video... {uploadProgress}%
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {formData.videoUrl && (
                        <p className="text-sm text-green-600 text-center">
                          Video uploaded successfully
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreview(null);
                          setFormData((prev) => ({
                            ...prev,
                            videoUrl: "",
                            videoPublicId: "",
                          }));
                        }}
                        className="w-full"
                      >
                        Remove Video
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <Video className="h-12 w-12 text-muted-foreground mb-4" />
                      <span className="text-sm font-medium">
                        Click to upload video
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        MP4, MOV, or WebM (max 100MB)
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Sparring session - Working on jab combinations"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you're working on, specific techniques you want feedback on, etc."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Discipline */}
              <div className="space-y-2">
                <Label htmlFor="discipline">Discipline</Label>
                <Select
                  value={formData.discipline}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, discipline: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MMA">MMA</SelectItem>
                    <SelectItem value="KICKBOXING">Kickboxing</SelectItem>
                    <SelectItem value="GRAPPLING">Grappling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-4">
                <Link href="/footage" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isUploading || isSubmitting || !formData.videoUrl}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit for Review
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
