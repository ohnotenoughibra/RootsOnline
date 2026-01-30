import { NextResponse } from "next/server";

// Stripe checkout is disabled for now
export async function POST() {
  return NextResponse.json(
    { error: "Payments coming soon! Stripe is not configured yet." },
    { status: 503 }
  );
}
