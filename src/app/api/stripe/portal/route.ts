import { NextResponse } from "next/server";

// Stripe portal is disabled for now
export async function POST() {
  return NextResponse.json(
    { error: "Billing portal coming soon! Stripe is not configured yet." },
    { status: 503 }
  );
}
