import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export const dynamic = "force-dynamic";

// POST - Create Stripe checkout session for course purchase
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();
    const { slug } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the course
    const course = await prisma.course.findUnique({
      where: { slug, status: "PUBLISHED" },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (!course.price) {
      return NextResponse.json(
        { error: "This course is not available for individual purchase" },
        { status: 400 }
      );
    }

    // Check if user already purchased this course
    const existingPurchase = await prisma.coursePurchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: "You have already purchased this course" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || undefined,
        metadata: {
          userId: user.id,
          clerkId: userId,
        },
      });
      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Create Stripe checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: course.title,
              description: course.shortDescription || `Access to ${course.title}`,
              images: course.coverImage ? [course.coverImage] : undefined,
            },
            unit_amount: course.price, // Price in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${slug}/learn?purchased=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${slug}?cancelled=true`,
      metadata: {
        userId: user.id,
        courseId: course.id,
        type: "course_purchase",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

// GET - Check if user has purchased the course
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();
    const { slug } = await params;

    if (!userId) {
      return NextResponse.json({ purchased: false });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ purchased: false });
    }

    const course = await prisma.course.findUnique({
      where: { slug },
      select: { id: true, price: true },
    });

    if (!course) {
      return NextResponse.json({ purchased: false });
    }

    const purchase = await prisma.coursePurchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    return NextResponse.json({
      purchased: !!purchase,
      price: course.price,
      priceFormatted: course.price ? `€${(course.price / 100).toFixed(2)}` : null,
    });
  } catch (error) {
    console.error("Error checking purchase:", error);
    return NextResponse.json({ purchased: false });
  }
}
