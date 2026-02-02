"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ThumbsUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AnswerCardProps {
  answer: {
    id: string;
    content: string;
    isAccepted: boolean;
    upvotes: number;
    createdAt: Date;
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      imageUrl: string | null;
      role: string;
    };
  };
  questionId: string;
  isQuestionOwner: boolean;
  isAdmin: boolean;
  currentUserId?: string;
}

export function AnswerCard({
  answer,
  questionId,
  isQuestionOwner,
  isAdmin,
  currentUserId,
}: AnswerCardProps) {
  const router = useRouter();
  const [accepting, setAccepting] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);

    try {
      const response = await fetch(
        `/api/business/questions/${questionId}/answers/${answer.id}/accept`,
        { method: "POST" }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to accept answer");
      }

      toast.success("Answer accepted!");
      router.refresh();
    } catch (error) {
      console.error("Error accepting answer:", error);
      toast.error(error instanceof Error ? error.message : "Failed to accept");
    } finally {
      setAccepting(false);
    }
  };

  const handleUpvote = async () => {
    setUpvoting(true);

    try {
      const response = await fetch(
        `/api/business/questions/${questionId}/answers/${answer.id}/upvote`,
        { method: "POST" }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upvote");
      }

      router.refresh();
    } catch (error) {
      console.error("Error upvoting:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upvote");
    } finally {
      setUpvoting(false);
    }
  };

  const canAccept = (isQuestionOwner || isAdmin) && !answer.isAccepted;

  return (
    <Card className={answer.isAccepted ? "border-green-500 bg-green-50/50" : ""}>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          {/* Voting */}
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleUpvote}
              disabled={upvoting || !currentUserId}
            >
              {upvoting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ThumbsUp className="h-4 w-4" />
              )}
            </Button>
            <span className="text-sm font-medium">{answer.upvotes}</span>
            {answer.isAccepted && (
              <CheckCircle2 className="h-6 w-6 text-green-600 mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-sm max-w-none mb-4">
              <p className="whitespace-pre-wrap">{answer.content}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {answer.user.imageUrl && (
                    <img
                      src={answer.user.imageUrl}
                      alt=""
                      className="h-5 w-5 rounded-full"
                    />
                  )}
                  <span>
                    {answer.user.firstName} {answer.user.lastName}
                  </span>
                  {answer.user.role === "COACH" && (
                    <Badge variant="outline" className="text-[10px] py-0">
                      Coach
                    </Badge>
                  )}
                  {answer.user.role === "ADMIN" && (
                    <Badge variant="outline" className="text-[10px] py-0">
                      Admin
                    </Badge>
                  )}
                </div>
                <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
              </div>

              {canAccept && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAccept}
                  disabled={accepting}
                >
                  {accepting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Accept Answer
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
