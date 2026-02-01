"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Check,
  X,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuizOption {
  id?: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface QuizQuestion {
  id?: string;
  question: string;
  imageUrl?: string;
  order: number;
  options: QuizOption[];
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  questions: QuizQuestion[];
  _count?: {
    attempts: number;
  };
}

interface QuizEditorProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuizEditor({
  courseId,
  moduleId,
  lessonId,
  lessonTitle,
  open,
  onOpenChange,
}: QuizEditorProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchQuizzes();
    }
  }, [open, lessonId]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/coach/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes`
      );
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingQuiz({
      id: "",
      title: `${lessonTitle} Quiz`,
      description: "",
      passingScore: 70,
      questions: [
        {
          question: "",
          order: 0,
          options: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    });
    setIsNew(true);
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editingQuiz) return;

    // Validate
    if (!editingQuiz.title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    for (const q of editingQuiz.questions) {
      if (!q.question.trim()) {
        toast.error("All questions must have text");
        return;
      }
      const filledOptions = q.options.filter((o) => o.text.trim());
      if (filledOptions.length < 2) {
        toast.error("Each question needs at least 2 options");
        return;
      }
      const hasCorrect = q.options.some((o) => o.isCorrect && o.text.trim());
      if (!hasCorrect) {
        toast.error("Each question needs a correct answer");
        return;
      }
    }

    setSaving(true);
    try {
      const url = isNew
        ? `/api/coach/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes`
        : `/api/coach/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes/${editingQuiz.id}`;

      const response = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingQuiz.title,
          description: editingQuiz.description,
          passingScore: editingQuiz.passingScore,
          questions: editingQuiz.questions.map((q, i) => ({
            question: q.question,
            imageUrl: q.imageUrl,
            order: i,
            options: q.options.filter((o) => o.text.trim()),
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to save quiz");

      toast.success(isNew ? "Quiz created!" : "Quiz updated!");
      await fetchQuizzes();
      setEditingQuiz(null);
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const response = await fetch(
        `/api/coach/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes/${quizId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete quiz");

      toast.success("Quiz deleted!");
      await fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    }
  };

  const addQuestion = () => {
    if (!editingQuiz) return;
    setEditingQuiz({
      ...editingQuiz,
      questions: [
        ...editingQuiz.questions,
        {
          question: "",
          order: editingQuiz.questions.length,
          options: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    if (!editingQuiz) return;
    setEditingQuiz({
      ...editingQuiz,
      questions: editingQuiz.questions.filter((_, i) => i !== index),
    });
  };

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    if (!editingQuiz) return;
    setEditingQuiz({
      ...editingQuiz,
      questions: editingQuiz.questions.map((q, i) =>
        i === index ? { ...q, ...updates } : q
      ),
    });
  };

  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    if (!editingQuiz) return;
    setEditingQuiz({
      ...editingQuiz,
      questions: editingQuiz.questions.map((q, qi) =>
        qi === questionIndex
          ? {
              ...q,
              options: q.options.map((o, oi) => ({
                ...o,
                isCorrect: oi === optionIndex,
              })),
            }
          : q
      ),
    });
  };

  const updateOptionText = (
    questionIndex: number,
    optionIndex: number,
    text: string
  ) => {
    if (!editingQuiz) return;
    setEditingQuiz({
      ...editingQuiz,
      questions: editingQuiz.questions.map((q, qi) =>
        qi === questionIndex
          ? {
              ...q,
              options: q.options.map((o, oi) =>
                oi === optionIndex ? { ...o, text } : o
              ),
            }
          : q
      ),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <HelpCircle className="h-5 w-5 inline mr-2" />
            Quizzes for: {lessonTitle}
          </DialogTitle>
          <DialogDescription>
            Create quizzes to test student understanding
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : editingQuiz ? (
          /* Quiz Editor Form */
          <div className="space-y-6 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Quiz Title</Label>
                <Input
                  value={editingQuiz.title}
                  onChange={(e) =>
                    setEditingQuiz({ ...editingQuiz, title: e.target.value })
                  }
                  placeholder="e.g., Guard Techniques Quiz"
                />
              </div>
              <div className="space-y-2">
                <Label>Passing Score (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={editingQuiz.passingScore}
                  onChange={(e) =>
                    setEditingQuiz({
                      ...editingQuiz,
                      passingScore: parseInt(e.target.value) || 70,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={editingQuiz.description || ""}
                onChange={(e) =>
                  setEditingQuiz({
                    ...editingQuiz,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of what this quiz covers..."
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Questions</Label>
                <Button variant="outline" size="sm" onClick={addQuestion}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Question
                </Button>
              </div>

              {editingQuiz.questions.map((question, qIndex) => (
                <Card key={qIndex}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">
                            Question {qIndex + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive h-8 w-8 p-0"
                            onClick={() => removeQuestion(qIndex)}
                            disabled={editingQuiz.questions.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(qIndex, { question: e.target.value })
                          }
                          placeholder="Enter your question..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Label className="text-sm text-muted-foreground mb-3 block">
                      Options (select the correct answer)
                    </Label>
                    <RadioGroup
                      value={String(
                        question.options.findIndex((o) => o.isCorrect)
                      )}
                      onValueChange={(value) =>
                        setCorrectOption(qIndex, parseInt(value))
                      }
                    >
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div
                            key={oIndex}
                            className={`flex items-center gap-3 p-2 rounded-md ${
                              option.isCorrect
                                ? "bg-green-50 border border-green-200"
                                : "bg-muted/50"
                            }`}
                          >
                            <RadioGroupItem
                              value={String(oIndex)}
                              id={`q${qIndex}-o${oIndex}`}
                            />
                            <Input
                              value={option.text}
                              onChange={(e) =>
                                updateOptionText(qIndex, oIndex, e.target.value)
                              }
                              placeholder={`Option ${oIndex + 1}`}
                              className="flex-1"
                            />
                            {option.isCorrect && (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingQuiz(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isNew ? "Create Quiz" : "Save Changes"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* Quiz List */
          <div className="py-4 space-y-4">
            {quizzes.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">
                  No quizzes yet for this lesson
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-end">
                  <Button onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Quiz
                  </Button>
                </div>

                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <HelpCircle className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1">
                          <h4 className="font-medium">{quiz.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">
                              {quiz.questions.length} questions
                            </Badge>
                            <Badge variant="outline">
                              Pass: {quiz.passingScore}%
                            </Badge>
                            {quiz._count && quiz._count.attempts > 0 && (
                              <Badge variant="default">
                                {quiz._count.attempts} attempts
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(quiz)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDelete(quiz.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
