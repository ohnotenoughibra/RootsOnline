import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// POST - track affiliate click and store in cookie
export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code required" }, { status: 400 });
    }

    // Store affiliate code in cookie for 30 days
    const cookieStore = await cookies();
    cookieStore.set("affiliate_code", code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking affiliate:", error);
    return NextResponse.json(
      { error: "Failed to track affiliate" },
      { status: 500 }
    );
  }
}

// GET - get current affiliate code from cookie
export async function GET() {
  try {
    const cookieStore = await cookies();
    const affiliateCode = cookieStore.get("affiliate_code")?.value;

    return NextResponse.json({ code: affiliateCode || null });
  } catch (error) {
    console.error("Error getting affiliate code:", error);
    return NextResponse.json({ code: null });
  }
}
