"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Plus,
  Send,
  Reply,
  Pin,
  Lock,
  Loader2,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore } from "@/store/user-store";

interface Author {
  id: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: string;
}

interface DiscussionReply {
  id: string;
  content: string;
  author: Author;
  isCoachAnswer: boolean;
  createdAt: string;
  children?: DiscussionReply[];
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: Author;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  createdAt: string;
  _count: {
    replies: number;
  };
  replies?: DiscussionReply[];
}

interface DiscussionSectionProps {
  courseId?: string;
  lessonId?: string;
}

export function DiscussionSection({ courseId, lessonId }: DiscussionSectionProps) {
  const { user } = useUserStore();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [expandedDiscussion, setExpandedDiscussion] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loadingDiscussion, setLoadingDiscussion] = useState<string | null>(null);

  const isSubscribed = Boolean(
    user &&
      (user.role === "ADMIN" ||
        user.role === "COACH" ||
        user.subscriptionStatus === "ACTIVE" ||
        user.subscriptionStatus === "TRIALING")
  );

  useEffect(() => {
    fetchDiscussions();
  }, [courseId, lessonId]);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (courseId) params.set("courseId", courseId);
      if (lessonId) params.set("lessonId", lessonId);

      const response = await fetch(`/api/discussions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDiscussions(data.discussions);
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setPosting(true);
    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          courseId,
          lessonId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create discussion");
      }

      toast.success("Discussion created!");
      setNewPostOpen(false);
      setNewTitle("");
      setNewContent("");
      fetchDiscussions();
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create discussion");
    } finally {
      setPosting(false);
    }
  };

  const handleExpandDiscussion = async (discussionId: string) => {
    if (expandedDiscussion === discussionId) {
      setExpandedDiscussion(null);
      return;
    }

    setLoadingDiscussion(discussionId);
    try {
      const response = await fetch(`/api/discussions/${discussionId}`);
      if (response.ok) {
        const data = await response.json();
        setDiscussions((prev) =>
          prev.map((d) =>
            d.id === discussionId ? { ...d, replies: data.discussion.replies } : d
          )
        );
        setExpandedDiscussion(discussionId);
      }
    } catch (error) {
      console.error("Error fetching discussion:", error);
    } finally {
      setLoadingDiscussion(null);
    }
  };

  const handleReply = async (discussionId: string, parentId?: string) => {
    if (!replyContent.trim()) {
      toast.error("Reply content is required");
      return;
    }

    setPosting(true);
    try {
      const response = await fetch(`/api/discussions/${discussionId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          parentId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to post reply");
      }

      toast.success("Reply posted!");
      setReplyingTo(null);
      setReplyContent("");
      // Refresh the discussion
      handleExpandDiscussion(discussionId);
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error(error instanceof Error ? error.message : "Failed to post reply");
    } finally {
      setPosting(false);
    }
  };

  const getInitials = (author: Author) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName[0]}${author.lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  const getAuthorName = (author: Author) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    }
    return "User";
  };

  const renderReply = (reply: DiscussionReply, discussionId: string, depth = 0) => (
    <div
      key={reply.id}
      className={`border-l-2 ${depth > 0 ? "border-muted ml-4" : "border-primary/20"} pl-4 py-3`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={reply.author.imageUrl} />
          <AvatarFallback className="text-xs">{getInitials(reply.author)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{getAuthorName(reply.author)}</span>
            {reply.author.role === "COACH" && (
              <Badge variant="secondary" className="text-xs">Coach</Badge>
            )}
            {reply.author.role === "ADMIN" && (
              <Badge className="text-xs">Admin</Badge>
            )}
            {reply.isCoachAnswer && (
              <Badge variant="default" className="text-xs bg-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Answer
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="mt-1 text-sm whitespace-pre-wrap">{reply.content}</p>
          {isSubscribed && depth < 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-7 text-xs"
              onClick={() => setReplyingTo(reply.id)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          )}
          {replyingTo === reply.id && (
            <div className="mt-2 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                rows={2}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleReply(discussionId, reply.id)}
                  disabled={posting}
                >
                  {posting && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {reply.children?.map((child) => renderReply(child, discussionId, depth + 1))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Discussion
          </CardTitle>
          {isSubscribed && (
            <Button size="sm" onClick={() => setNewPostOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Post
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No discussions yet</p>
            {isSubscribed && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setNewPostOpen(true)}
              >
                Start the first discussion
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleExpandDiscussion(discussion.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={discussion.author.imageUrl} />
                      <AvatarFallback>
                        {getInitials(discussion.author)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {discussion.isPinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                        {discussion.isLocked && (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <h4 className="font-medium">{discussion.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                        <span>{getAuthorName(discussion.author)}</span>
                        {discussion.author.role !== "STUDENT" && (
                          <Badge variant="secondary" className="text-xs">
                            {discussion.author.role}
                          </Badge>
                        )}
                        <span>
                          {formatDistanceToNow(new Date(discussion.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {discussion._count.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {discussion.viewCount}
                        </span>
                      </div>
                    </div>
                    {loadingDiscussion === discussion.id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : expandedDiscussion === discussion.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedDiscussion === discussion.id && (
                  <div className="border-t bg-muted/30 p-4">
                    <p className="text-sm whitespace-pre-wrap mb-4">
                      {discussion.content}
                    </p>

                    {/* Replies */}
                    {discussion.replies && discussion.replies.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <h5 className="font-medium text-sm">
                          {discussion.replies.length} Replies
                        </h5>
                        {discussion.replies.map((reply) =>
                          renderReply(reply, discussion.id)
                        )}
                      </div>
                    )}

                    {/* Reply form */}
                    {isSubscribed && !discussion.isLocked && (
                      <div className="pt-4 border-t">
                        {replyingTo === `discussion-${discussion.id}` ? (
                          <div className="space-y-2">
                            <Textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Write your reply..."
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleReply(discussion.id)}
                                disabled={posting}
                              >
                                {posting && (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                )}
                                <Send className="h-4 w-4 mr-1" />
                                Post Reply
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setReplyingTo(`discussion-${discussion.id}`)
                            }
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* New Post Dialog */}
      <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a Discussion</DialogTitle>
            <DialogDescription>
              Ask a question or share your thoughts with the community
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="What would you like to discuss?"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPostOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost} disabled={posting}>
              {posting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Post Discussion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
