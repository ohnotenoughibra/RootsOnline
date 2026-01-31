"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Dumbbell,
  Target,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const EXPERIENCE_LEVELS = [
  {
    value: "BEGINNER",
    label: "Beginner",
    description: "New to martial arts or just starting out",
    icon: "🥋",
  },
  {
    value: "INTERMEDIATE",
    label: "Intermediate",
    description: "1-3 years of training experience",
    icon: "💪",
  },
  {
    value: "ADVANCED",
    label: "Advanced",
    description: "3+ years, competing or coaching",
    icon: "🏆",
  },
];

const TRAINING_GOALS = [
  { value: "fitness", label: "Get in shape", icon: "🔥" },
  { value: "self_defense", label: "Self-defense", icon: "🛡️" },
  { value: "competition", label: "Compete", icon: "🥊" },
  { value: "technique", label: "Improve technique", icon: "📈" },
  { value: "hobby", label: "Fun hobby", icon: "😊" },
  { value: "discipline", label: "Mental discipline", icon: "🧘" },
];

const DISCIPLINES = [
  { value: "MMA", label: "MMA", icon: "🤼" },
  { value: "KICKBOXING", label: "Kickboxing", icon: "🦵" },
  { value: "GRAPPLING", label: "Grappling", icon: "🤝" },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [trainingGoals, setTrainingGoals] = useState<string[]>([]);
  const [preferredDisciplines, setPreferredDisciplines] = useState<string[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  const handleGoalToggle = (goal: string) => {
    setTrainingGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleDisciplineToggle = (discipline: string) => {
    setPreferredDisciplines((prev) =>
      prev.includes(discipline)
        ? prev.filter((d) => d !== discipline)
        : [...prev, discipline]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceLevel,
          trainingGoals,
          preferredDisciplines,
        }),
      });
      onClose();
    } catch (error) {
      console.error("Failed to save onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      await fetch("/api/onboarding", { method: "PATCH" });
      onClose();
    } catch (error) {
      console.error("Failed to skip onboarding:", error);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!experienceLevel;
      case 1:
        return trainingGoals.length > 0;
      case 2:
        return preferredDisciplines.length > 0;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleSkip}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold">
              Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
            </DialogTitle>
            <p className="text-muted-foreground">
              Let&apos;s personalize your training experience.
            </p>
          </DialogHeader>

          {/* Progress indicator */}
          <div className="mt-6 flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="mt-8 min-h-[280px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    What&apos;s your experience level?
                  </div>
                  <div className="grid gap-3">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setExperienceLevel(level.value)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg border text-left transition-all",
                          experienceLevel === level.value
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-2xl">{level.icon}</span>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {level.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <Target className="h-5 w-5 text-primary" />
                    What are your training goals?
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select all that apply
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {TRAINING_GOALS.map((goal) => (
                      <button
                        key={goal.value}
                        onClick={() => handleGoalToggle(goal.value)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                          trainingGoals.includes(goal.value)
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-xl">{goal.icon}</span>
                        <span className="text-sm font-medium">{goal.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <Zap className="h-5 w-5 text-primary" />
                    Which disciplines interest you?
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll recommend courses based on your interests
                  </p>
                  <div className="grid gap-3">
                    {DISCIPLINES.map((discipline) => (
                      <button
                        key={discipline.value}
                        onClick={() => handleDisciplineToggle(discipline.value)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg border text-left transition-all",
                          preferredDisciplines.includes(discipline.value)
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-2xl">{discipline.icon}</span>
                        <span className="font-medium">{discipline.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip for now
            </Button>
            <div className="flex gap-2">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              {step < totalSteps - 1 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Get Started"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
