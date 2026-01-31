import Link from "next/link";
import { CheckCircle, Play, Video, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SubscribeSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to the Academy!</h1>
          <p className="mt-4 text-muted-foreground">
            Your subscription is now active. You have full access to all courses
            and features.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">What you can do now:</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Play className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Watch all courses</p>
                  <p className="text-sm text-muted-foreground">
                    Unlimited access to MMA, Kickboxing, and Grappling content
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Video className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Upload training footage</p>
                  <p className="text-sm text-muted-foreground">
                    Get personalized feedback from our coaches
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Access coach feedback</p>
                  <p className="text-sm text-muted-foreground">
                    Improve your technique with expert guidance
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/courses">
            <Button size="lg">
              <Play className="h-4 w-4 mr-2" />
              Browse Courses
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
