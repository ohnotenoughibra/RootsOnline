import { NextResponse } from "next/server";

// Stripe webhook is disabled for now
export async function POST() {
  return NextResponse.json(
    { message: "Stripe webhooks are not configured yet" },
    { status: 200 }
  );
}
