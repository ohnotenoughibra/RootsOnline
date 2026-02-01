"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Upload,
  FileText,
  Video,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Certification {
  id: string;
  title: string;
  slug: string;
  description: string;
  discipline: string;
  level: string;
  price: number;
  requiredWatchHours: number;
  minimumQuizScore: number;
  validityMonths: number;
}

export default function ApplyCertificationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [certification, setCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [formData, setFormData] = useState({
    videoSubmissionUrl: "",
    resumeUrl: "",
    additionalNotes: "",
  });

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        const response = await fetch(`/api/certifications/${slug}`);
        if (!response.ok) throw new Error("Certification not found");
        const data = await response.json();
        setCertification(data.certification);
      } catch (error) {
        console.error("Error fetching certification:", error);
        router.push("/certifications");
      } finally {
        setLoading(false);
      }
    };

    fetchCertification();
  }, [slug, router]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error("Video must be less than 500MB");
      return;
    }

    setUploadingVideo(true);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("Cloudinary not configured");

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("upload_preset", "roa_unsigned");
      uploadFormData.append("folder", "roa-certifications");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        { method: "POST", body: uploadFormData }
      );

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      setFormData({ ...formData, videoSubmissionUrl: result.secure_url });
      toast.success("Video uploaded successfully!");
    } catch (error) {
      console.error("Video upload error:", error);
      toast.error("Failed to upload video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.videoSubmissionUrl) {
      toast.error("Please upload your technique demonstration video");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/certifications/${slug}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Application failed");
      }

      toast.success("Application submitted successfully!");
      router.push(`/certifications/${slug}`);
    } catch (error) {
      console.error("Application error:", error);
      toast.error(error instanceof Error ? error.message : "Application failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!certification) return null;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href={`/certifications/${slug}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Certification
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Apply for Certification</h1>
          <p className="mt-2 text-muted-foreground">{certification.title}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Technique Demonstration
              </CardTitle>
              <CardDescription>
                Upload a video demonstrating your technical proficiency. This should include
                key techniques from the certification curriculum (5-10 minutes).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.videoSubmissionUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Video uploaded successfully</span>
                  </div>
                  <video
                    src={formData.videoSubmissionUrl}
                    controls
                    className="w-full rounded-md max-h-64"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({ ...formData, videoSubmissionUrl: "" })
                    }
                  >
                    Remove and Upload Different Video
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  {uploadingVideo ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Uploading video...
                      </span>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                      <span className="font-medium">Click to upload video</span>
                      <span className="text-sm text-muted-foreground mt-1">
                        MP4, MOV, or WebM (max 500MB)
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
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Information
              </CardTitle>
              <CardDescription>
                Optional: Share your background and any relevant experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resumeUrl">Resume/CV URL (optional)</Label>
                <Input
                  id="resumeUrl"
                  type="url"
                  placeholder="https://example.com/your-resume.pdf"
                  value={formData.resumeUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, resumeUrl: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Share your training background, teaching experience, or any other relevant information..."
                  value={formData.additionalNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, additionalNotes: e.target.value })
                  }
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {certification.price > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Application Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-lg">
                  <span>Total</span>
                  <span className="font-bold">
                    €{(certification.price / 100).toFixed(2)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  You will be redirected to payment after submitting your application.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Link href={`/certifications/${slug}`} className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting || !formData.videoSubmissionUrl}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : certification.price > 0 ? (
                "Submit & Pay"
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
