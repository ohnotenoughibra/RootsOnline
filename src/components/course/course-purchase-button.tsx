"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CoursePurchaseButtonProps {
  courseSlug: string;
  price: number; // in cents
  className?: string;
}

export function CoursePurchaseButton({
  courseSlug,
  price,
  className,
}: CoursePurchaseButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/courses/${courseSlug}/purchase`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process purchase");
      setLoading(false);
    }
  };

  const formattedPrice = `€${(price / 100).toFixed(2)}`;

  return (
    <Button
      onClick={handlePurchase}
      disabled={loading}
      className={className}
      variant="outline"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Buy Course {formattedPrice}
        </>
      )}
    </Button>
  );
}
