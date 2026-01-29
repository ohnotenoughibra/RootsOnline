import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
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
  ],
  // Routes that can be accessed while signed out but need auth for full features
  ignoredRoutes: [
    "/api/stripe/webhook",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
