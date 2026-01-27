import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12">
      <Card className="max-w-md w-full mx-4 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold">Welcome to ROA!</h1>

        <p className="mt-4 text-muted-foreground">
          Your subscription is now active. You have unlimited access to all our
          courses and content.
        </p>

        <div className="mt-8 space-y-3">
          <Link href="/courses" className="block">
            <Button className="w-full" size="lg">
              Browse Courses
            </Button>
          </Link>

          <Link href="/dashboard" className="block">
            <Button variant="outline" className="w-full" size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          A confirmation email has been sent to your inbox. If you have any
          questions, please contact our support team.
        </p>
      </Card>
    </div>
  );
}
