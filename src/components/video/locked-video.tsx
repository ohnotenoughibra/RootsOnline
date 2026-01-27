import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LockedVideoProps {
  poster?: string;
}

export function LockedVideo({ poster }: LockedVideoProps) {
  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
      {/* Background image (blurred) */}
      {poster && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Premium Content
        </h3>
        <p className="text-white/80 mb-6 max-w-sm">
          Subscribe to access this lesson and all premium content from our world-class coaches.
        </p>
        <Link href="/pricing">
          <Button size="lg" className="bg-white text-black hover:bg-white/90">
            Subscribe Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
