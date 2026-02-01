"use client";

import { useState, useEffect } from "react";
import { Camera, Plus, Trash2, Loader2, Upload, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface VideoAngle {
  id: string;
  angleLabel: string;
  videoUrl: string;
  videoPublicId?: string;
  videoDuration?: number;
  isDefault: boolean;
  order: number;
}

interface AngleManagerProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AngleManager({
  courseId,
  moduleId,
  lessonId,
  lessonTitle,
  open,
  onOpenChange,
}: AngleManagerProps) {
  const [angles, setAngles] = useState<VideoAngle[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newAngleLabel, setNewAngleLabel] = useState("");

  useEffect(() => {
    if (open) {
      fetchAngles();
    }
  }, [open, lessonId]);

  const fetchAngles = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/coach/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/angles`
      );
      if (response.ok) {
        const data = await response.json();
        setAngles(data.angles);
      }
    } catch (error) {
      console.error("Error fetching angles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!newAngleLabel.trim()) {
      toast.error("Please enter an angle label first");
      return;
    }

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error("Video must be less than 500MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("Cloudinary not configured");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "roa_unsigned");
      formData.append("folder", "roa-courses");

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      const result = await new Promise<{
        secure_url: string;
        public_id: string;
        duration?: number;
      }>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
        );
        xhr.send(formData);
      });

      // Create angle entry
      const response = await fetch(
        `/api/coach/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/angles`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            angleLabel: newAngleLabel,
            videoUrl: result.secure_url,
            videoPublicId: result.public_id,
            videoDuration: result.duration ? Math.round(result.duration) : null,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save angle");

      toast.success(`Added "${newAngleLabel}" angle!`);
      setNewAngleLabel("");
      fetchAngles();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload video");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSetDefault = async (angleId: string) => {
    try {
      const response = await fetch(
        `/api/coach/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/angles/${angleId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isDefault: true }),
        }
      );

      if (!response.ok) throw new Error("Failed to set default");

      toast.success("Default angle updated!");
      fetchAngles();
    } catch (error) {
      console.error("Error setting default:", error);
      toast.error("Failed to update default");
    }
  };

  const handleDelete = async (angleId: string) => {
    if (!confirm("Delete this video angle?")) return;

    try {
      const response = await fetch(
        `/api/coach/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/angles/${angleId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Angle deleted!");
      fetchAngles();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete angle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Video Angles: {lessonTitle}
          </DialogTitle>
          <DialogDescription>
            Add multiple camera angles to give students different perspectives
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Current Angles */}
            {angles.length > 0 && (
              <div className="space-y-3">
                <Label>Current Angles</Label>
                {angles.map((angle) => (
                  <Card key={angle.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-20 w-32 bg-muted rounded overflow-hidden flex-shrink-0">
                        <video
                          src={angle.videoUrl}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{angle.angleLabel}</h4>
                          {angle.isDefault && (
                            <Badge variant="default" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </div>
                        {angle.videoDuration && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {Math.floor(angle.videoDuration / 60)}:
                            {(angle.videoDuration % 60)
                              .toString()
                              .padStart(2, "0")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!angle.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(angle.id)}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(angle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Add New Angle */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Add New Angle</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="Angle label (e.g., Overhead, Detail, Slow Mo)"
                  value={newAngleLabel}
                  onChange={(e) => setNewAngleLabel(e.target.value)}
                />
              </div>
              <div className="border-2 border-dashed rounded-lg p-6">
                {uploading ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading... {uploadProgress}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    <span className="text-sm font-medium">
                      Click to upload video
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      MP4, MOV, or WebM (max 500MB)
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      disabled={!newAngleLabel.trim()}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
