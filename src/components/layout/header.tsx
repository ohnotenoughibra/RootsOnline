"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  { name: "Courses", href: "/courses" },
  { name: "Techniques", href: "/techniques" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  // Subscribe to user state to trigger re-render when user data loads
  const { user: dbUser, isCoach, isAdmin } = useUserStore();
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          Roots
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center md:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                pathname === item.href
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop right section */}
        <div className="hidden md:flex md:items-center md:gap-x-4">
          <ThemeToggle />
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            {(isCoach() || isAdmin()) && (
              <Link href="/coach">
                <Button variant="ghost" size="sm">
                  Studio
                </Button>
              </Link>
            )}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="-m-2.5 p-2.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block py-2 text-base transition-colors",
                  pathname === item.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}

            <SignedIn>
              <div className="pt-4 mt-4 border-t space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base text-muted-foreground"
                >
                  Dashboard
                </Link>
                {(isCoach() || isAdmin()) && (
                  <Link
                    href="/coach"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base text-muted-foreground"
                  >
                    Coach Studio
                  </Link>
                )}
              </div>
            </SignedIn>

            <SignedOut>
              <div className="pt-4 mt-4 border-t flex flex-col gap-2">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
}
