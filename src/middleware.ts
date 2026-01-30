<<<<<<< HEAD
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();
=======
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/courses",
  "/courses/(.*)",
  "/disciplines(.*)",
  "/pricing",
  "/about",
  "/contact",
  "/api/webhooks(.*)",
  "/api/stripe/webhook",
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});
>>>>>>> cdcd4417128e14fd9176a7394e42e535a0c32eda

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
