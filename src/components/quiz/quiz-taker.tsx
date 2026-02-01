"use client";

import { useState, useEffect } from "react";
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  imageUrl?: string;
  options: QuizOption[];
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  questions: QuizQuestion[];
  bestScore?: number;
  hasPassed?: boolean;
}

interface QuizResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  passingScore: number;
  results: Record<string, {
    correct: boolean;
    correctOptionId: string;
    explanation?: string;
  }>;
}

interface QuizTakerProps {
  quizId: string;
  onComplete?: (passed: boolean, score: number) => void;
}

export function QuizTaker({ quizId, onComplete }: QuizTakerProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${quizId}`);
      if (!response.ok) throw new Error("Failed to fetch quiz");
      const data = await response.json();
      setQuiz(data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      toast.error("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    const unanswered = quiz.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) throw new Error("Failed to submit quiz");

      const data = await response.json();
      setResult(data);
      onComplete?.(data.passed, data.score);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    setCurrentQuestion(0);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Quiz not found</p>
        </CardContent>
      </Card>
    );
  }

  // Show results
  if (result) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {result.passed ? (
              <Trophy className="h-16 w-16 text-yellow-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {result.passed ? "Congratulations!" : "Keep Practicing!"}
          </CardTitle>
          <CardDescription>
            {result.passed
              ? "You passed the quiz!"
              : `You need ${result.passingScore}% to pass`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{result.score}%</div>
            <p className="text-muted-foreground">
              {result.correctCount} of {result.totalQuestions} correct
            </p>
          </div>

          <Progress value={result.score} className="h-3" />

          {/* Show answers breakdown */}
          <div className="space-y-4 pt-4">
            <h4 className="font-medium">Your Answers:</h4>
            {quiz.questions.map((question, index) => {
              const questionResult = result.results[question.id];
              const userAnswer = answers[question.id];
              const isCorrect = questionResult?.correct;

              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        {index + 1}. {question.question}
                      </p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          Your answer:{" "}
                          <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                            {question.options.find((o) => o.id === userAnswer)?.text}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-green-600">
                            Correct answer:{" "}
                            {question.options.find(
                              (o) => o.id === questionResult?.correctOptionId
                            )?.text}
                          </p>
                        )}
                        {questionResult?.explanation && (
                          <p className="text-muted-foreground italic mt-2">
                            {questionResult.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRetake} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Quiz taking view
  const question = quiz.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / quiz.questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {quiz.title}
            </CardTitle>
            {quiz.description && (
              <CardDescription className="mt-1">
                {quiz.description}
              </CardDescription>
            )}
          </div>
          <div className="text-right">
            <Badge variant="outline">Pass: {quiz.passingScore}%</Badge>
            {quiz.bestScore !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                Best: {quiz.bestScore}%
              </p>
            )}
          </div>
        </div>
        <Progress value={progress} className="mt-4" />
        <p className="text-sm text-muted-foreground mt-2">
          {answeredCount} of {quiz.questions.length} answered
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question navigation */}
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((q, index) => (
            <Button
              key={q.id}
              variant={currentQuestion === index ? "default" : answers[q.id] ? "secondary" : "outline"}
              size="sm"
              className="w-10 h-10"
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {/* Current question */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">
            {currentQuestion + 1}. {question.question}
          </h3>

          {question.imageUrl && (
            <img
              src={question.imageUrl}
              alt="Question illustration"
              className="w-full max-w-md rounded-lg mb-4"
            />
          )}

          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${
                    answers[question.id] === option.id
                      ? "bg-primary/5 border-primary"
                      : ""
                  }`}
                  onClick={() => handleAnswer(question.id, option.id)}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          {currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting || answeredCount < quiz.questions.length}
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentQuestion(
                  Math.min(quiz.questions.length - 1, currentQuestion + 1)
                )
              }
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
