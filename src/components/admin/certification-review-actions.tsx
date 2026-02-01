"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Eye,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CertificationReviewActionsProps {
  applicationId: string;
  currentStatus: string;
  applicantName: string;
  certificationTitle: string;
  videoUrl: string | null;
  additionalNotes: string | null;
  watchedHours: number;
}

export function CertificationReviewActions({
  applicationId,
  currentStatus,
  applicantName,
  certificationTitle,
  videoUrl,
  additionalNotes,
  watchedHours,
}: CertificationReviewActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const handleAction = async () => {
    if (!action) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/certifications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "approve" ? "APPROVED" : "REJECTED",
          reviewNotes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update application");
      }

      toast.success(
        action === "approve"
          ? `Certification approved for ${applicantName}`
          : `Application rejected for ${applicantName}`
      );

      setReviewDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const openReviewDialog = (actionType: "approve" | "reject") => {
    setAction(actionType);
    setReviewNotes("");
    setReviewDialogOpen(true);
  };

  const canTakeAction = currentStatus === "PENDING" || currentStatus === "IN_REVIEW";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDetailsDialogOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          {videoUrl && (
            <DropdownMenuItem
              onClick={() => window.open(videoUrl, "_blank")}
            >
              <Eye className="h-4 w-4 mr-2" />
              Watch Video
            </DropdownMenuItem>
          )}
          {canTakeAction && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openReviewDialog("approve")}
                className="text-green-600"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openReviewDialog("reject")}
                className="text-red-600"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {applicantName} - {certificationTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground">Watch Hours</Label>
              <p className="font-medium">{watchedHours.toFixed(1)} hours</p>
            </div>
            {additionalNotes && (
              <div>
                <Label className="text-muted-foreground">Applicant Notes</Label>
                <p className="mt-1 text-sm whitespace-pre-wrap">{additionalNotes}</p>
              </div>
            )}
            {videoUrl && (
              <div>
                <Label className="text-muted-foreground">Technique Video</Label>
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-md mt-2 max-h-64"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Action Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "approve" ? "Approve Certification" : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? `Grant ${certificationTitle} certification to ${applicantName}`
                : `Reject ${applicantName}'s application for ${certificationTitle}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reviewNotes">
              Review Notes {action === "reject" && "(Required)"}
            </Label>
            <Textarea
              id="reviewNotes"
              placeholder={
                action === "approve"
                  ? "Optional notes about the approval..."
                  : "Please explain the reason for rejection..."
              }
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={loading || (action === "reject" && !reviewNotes.trim())}
              variant={action === "approve" ? "default" : "destructive"}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : action === "approve" ? (
                "Approve & Issue Certificate"
              ) : (
                "Reject Application"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
