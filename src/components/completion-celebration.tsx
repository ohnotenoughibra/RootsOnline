"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, PartyPopper, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CompletionCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  type: "course" | "learning-path";
  title: string;
  certificateId?: string;
}

// Confetti particles
const confettiColors = [
  "#FFD700", // Gold
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
];

function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const randomX = Math.random() * 100;
  const randomRotation = Math.random() * 360;
  const duration = 2 + Math.random() * 2;

  return (
    <motion.div
      initial={{
        opacity: 1,
        y: -20,
        x: `${randomX}vw`,
        rotate: 0,
      }}
      animate={{
        opacity: 0,
        y: "100vh",
        rotate: randomRotation,
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className="fixed top-0 w-3 h-3 z-50 pointer-events-none"
      style={{ backgroundColor: color }}
    />
  );
}

export function CompletionCelebration({
  isOpen,
  onClose,
  type,
  title,
  certificateId,
}: CompletionCelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 0.5,
      }));
      setConfetti(particles);

      // Clear confetti after animation
      const timeout = setTimeout(() => {
        setConfetti([]);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          {confetti.map((particle) => (
            <ConfettiParticle
              key={particle.id}
              delay={particle.delay}
              color={particle.color}
            />
          ))}

          {/* Modal overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-primary/10" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>

              <CardContent className="pt-12 pb-8 px-8 text-center relative">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg"
                >
                  {type === "course" ? (
                    <Award className="h-10 w-10 text-white" />
                  ) : (
                    <PartyPopper className="h-10 w-10 text-white" />
                  )}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2"
                >
                  {type === "course" ? "Course Completed!" : "Learning Path Completed!"}
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-6"
                >
                  Congratulations! You've successfully completed{" "}
                  <span className="font-medium text-foreground">{title}</span>
                </motion.p>

                {/* Certificate info for courses */}
                {type === "course" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-muted rounded-lg p-4 mb-6"
                  >
                    <Award className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                    <p className="text-sm font-medium">Certificate Earned!</p>
                    <p className="text-xs text-muted-foreground">
                      Your certificate is ready to download
                    </p>
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                  {type === "course" && certificateId && (
                    <a href={`/api/certificates/${certificateId}/download`} download>
                      <Button className="w-full sm:w-auto">Download Certificate</Button>
                    </a>
                  )}
                  <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                    Continue Learning
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
