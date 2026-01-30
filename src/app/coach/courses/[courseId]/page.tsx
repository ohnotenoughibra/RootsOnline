"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order: number;
  videoUrl: string | null;
  videoPublicId: string | null;
  videoDuration: number | null;
  isFreePreview: boolean;
  isPublished: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  discipline: string;
  status: string;
  coverImage: string | null;
  modules: Module[];
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newLessonData, setNewLessonData] = useState<{
    moduleId: string;
    title: string;
  } | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    moduleId: string;
    lesson: Lesson;
  } | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/coach/courses/${courseId}`);
      if (!response.ok) throw new Error("Course not found");
      const data = await response.json();
      setCourse(data.course);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course");
      router.push("/coach");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async (updates: Partial<Course>) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/coach/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update course");

      const { course: updated } = await response.json();
      setCourse(updated);
      toast.success("Course updated!");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    const newStatus = course?.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await handleSaveCourse({ status: newStatus } as Partial<Course>);
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;

    try {
      const response = await fetch(`/api/coach/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newModuleTitle }),
      });

      if (!response.ok) throw new Error("Failed to add module");

      await fetchCourse();
      setNewModuleTitle("");
      toast.success("Module added!");
    } catch (error) {
      console.error("Error adding module:", error);
      toast.error("Failed to add module");
    }
  };

  const handleAddLesson = async () => {
    if (!newLessonData?.title.trim() || !newLessonData?.moduleId) return;

    try {
      const response = await fetch(
        `/api/coach/courses/${courseId}/modules/${newLessonData.moduleId}/lessons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newLessonData.title }),
        }
      );

      if (!response.ok) throw new Error("Failed to add lesson");

      await fetchCourse();
      setNewLessonData(null);
      toast.success("Lesson added!");
    } catch (error) {
      console.error("Error adding lesson:", error);
      toast.error("Failed to add lesson");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module and all its lessons?"))
      return;

    try {
      const response = await fetch(
        `/api/coach/courses/${courseId}/modules/${moduleId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete module");

      await fetchCourse();
      toast.success("Module deleted!");
    } catch (error) {
      console.error("Error deleting module:", error);
      toast.error("Failed to delete module");
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const response = await fetch(
        `/api/coach/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete lesson");

      await fetchCourse();
      toast.success("Lesson deleted!");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson");
    }
  };

  const handleUpdateLesson = async (
    moduleId: string,
    lessonId: string,
    updates: Partial<Lesson>
  ) => {
    try {
      const response = await fetch(
        `/api/coach/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) throw new Error("Failed to update lesson");

      await fetchCourse();
      toast.success("Lesson updated!");
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Failed to update lesson");
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingLesson) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video must be less than 100MB");
      return;
    }

    setUploadingVideo(true);
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

      const result = await new Promise<{ secure_url: string; public_id: string; duration?: number }>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
        xhr.send(formData);
      });

      // Update lesson with video URL
      await handleUpdateLesson(editingLesson.moduleId, editingLesson.lesson.id, {
        videoUrl: result.secure_url,
        videoPublicId: result.public_id,
        videoDuration: result.duration ? Math.round(result.duration) : null,
      });

      setEditingLesson(null);
      toast.success("Video uploaded successfully!");
    } catch (error) {
      console.error("Video upload error:", error);
      toast.error("Failed to upload video");
    } finally {
      setUploadingVideo(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/coach"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Coach Studio
            </Link>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={course.status === "PUBLISHED" ? "default" : "secondary"}
              >
                {course.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {course.status === "PUBLISHED" && (
              <Link href={`/courses/${course.slug}`}>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </Link>
            )}
            <Button onClick={handlePublish} disabled={saving}>
              {course.status === "PUBLISHED" ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content - Course details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Basic information about your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={course.title}
                    onChange={(e) =>
                      setCourse({ ...course, title: e.target.value })
                    }
                    onBlur={() => handleSaveCourse({ title: course.title })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Discipline</Label>
                  <Select
                    value={course.discipline}
                    onValueChange={(value) =>
                      handleSaveCourse({ discipline: value } as Partial<Course>)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MMA">MMA</SelectItem>
                      <SelectItem value="KICKBOXING">Kickboxing</SelectItem>
                      <SelectItem value="GRAPPLING">Grappling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Input
                    value={course.shortDescription || ""}
                    onChange={(e) =>
                      setCourse({ ...course, shortDescription: e.target.value })
                    }
                    onBlur={() =>
                      handleSaveCourse({
                        shortDescription: course.shortDescription,
                      })
                    }
                    placeholder="Brief summary for course cards"
                    maxLength={300}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Full Description</Label>
                  <Textarea
                    value={course.description}
                    onChange={(e) =>
                      setCourse({ ...course, description: e.target.value })
                    }
                    onBlur={() =>
                      handleSaveCourse({ description: course.description })
                    }
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Modules & Lessons */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Curriculum</CardTitle>
                    <CardDescription>
                      Organize your course into modules and lessons
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add Module */}
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="New module title..."
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
                  />
                  <Button onClick={handleAddModule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                  </Button>
                </div>

                {course.modules.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No modules yet. Add your first module above.
                  </p>
                ) : (
                  <Accordion
                    type="multiple"
                    defaultValue={course.modules.map((m) => m.id)}
                    className="space-y-4"
                  >
                    {course.modules.map((module, moduleIndex) => (
                      <AccordionItem
                        key={module.id}
                        value={module.id}
                        className="border rounded-lg"
                      >
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              Module {moduleIndex + 1}: {module.title}
                            </span>
                            <Badge variant="secondary">
                              {module.lessons.length} lessons
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="flex justify-between items-center mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setNewLessonData({
                                  moduleId: module.id,
                                  title: "",
                                })
                              }
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Lesson
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteModule(module.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {module.lessons.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No lessons yet
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-md"
                                >
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    {lessonIndex + 1}.
                                  </span>
                                  <span className="flex-1 text-sm">
                                    {lesson.title}
                                  </span>
                                  {lesson.videoUrl ? (
                                    <Badge variant="default" className="bg-green-600">
                                      Video
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                      No Video
                                    </Badge>
                                  )}
                                  {lesson.isFreePreview && (
                                    <Badge variant="secondary">Free</Badge>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setEditingLesson({
                                        moduleId: module.id,
                                        lesson,
                                      })
                                    }
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    {lesson.videoUrl ? "Replace" : "Upload"}
                                  </Button>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={lesson.isFreePreview}
                                      onCheckedChange={(checked) =>
                                        handleUpdateLesson(
                                          module.id,
                                          lesson.id,
                                          { isFreePreview: checked }
                                        )
                                      }
                                    />
                                    <span className="text-xs text-muted-foreground">
                                      Free
                                    </span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive h-8 w-8 p-0"
                                    onClick={() =>
                                      handleDeleteLesson(module.id, lesson.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modules</span>
                  <span className="font-medium">{course.modules.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Lessons</span>
                  <span className="font-medium">
                    {course.modules.reduce(
                      (acc, m) => acc + m.lessons.length,
                      0
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Lesson Dialog */}
        <Dialog
          open={!!newLessonData}
          onOpenChange={(open) => !open && setNewLessonData(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lesson</DialogTitle>
              <DialogDescription>
                Create a new lesson in this module
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="lessonTitle">Lesson Title</Label>
              <Input
                id="lessonTitle"
                value={newLessonData?.title || ""}
                onChange={(e) =>
                  setNewLessonData((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                placeholder="e.g., Basic Guard Passes"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewLessonData(null)}>
                Cancel
              </Button>
              <Button onClick={handleAddLesson}>Add Lesson</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Lesson / Upload Video Dialog */}
        <Dialog
          open={!!editingLesson}
          onOpenChange={(open) => !open && setEditingLesson(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingLesson?.lesson.videoUrl ? "Replace Video" : "Upload Video"}
              </DialogTitle>
              <DialogDescription>
                Upload a video for: {editingLesson?.lesson.title}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {/* Current video preview */}
              {editingLesson?.lesson.videoUrl && (
                <div className="space-y-2">
                  <Label>Current Video</Label>
                  <video
                    src={editingLesson.lesson.videoUrl}
                    controls
                    className="w-full rounded-md max-h-48"
                  />
                </div>
              )}

              {/* Upload new video */}
              <div className="space-y-2">
                <Label>{editingLesson?.lesson.videoUrl ? "New Video" : "Video File"}</Label>
                <div className="border-2 border-dashed rounded-lg p-6">
                  {uploadingVideo ? (
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
                      <span className="text-sm font-medium">Click to upload video</span>
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
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingLesson(null)}
                disabled={uploadingVideo}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
