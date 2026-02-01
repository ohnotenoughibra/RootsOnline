"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md p-8 text-center">
        <WifiOff className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
        <p className="text-muted-foreground mb-6">
          It looks like you've lost your internet connection. Some features may
          not be available until you're back online.
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => window.location.reload()}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <p className="text-sm text-muted-foreground">
            Don't worry - your progress is saved locally and will sync when
            you're back online.
          </p>
        </div>
      </Card>
    </div>
  );
}
