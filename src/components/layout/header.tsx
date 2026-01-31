"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import {
  Menu,
  Dumbbell,
  Home,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Video,
  Settings,
  Info,
  Mail,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

const navigation = [
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Pricing", href: "/pricing", icon: CreditCard },
];

const mobileNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Pricing", href: "/pricing", icon: CreditCard },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Mail },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isCoach, isAdmin } = useUserStore();
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">ROA</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-m-2.5">
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2">
                  <Dumbbell className="h-6 w-6 text-primary" />
                  <span>ROA</span>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-1">
                {/* Navigation links */}
                {mobileNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}

                <SignedIn>
                  <div className="my-4 border-t" />

                  {/* User section */}
                  <div className="mb-4 flex items-center gap-3 px-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {user?.firstName || "User"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                      pathname === "/dashboard"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>

                  {(isCoach() || isAdmin()) && (
                    <Link
                      href="/coach"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                        pathname.startsWith("/coach")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Video className="h-5 w-5" />
                      Coach Studio
                    </Link>
                  )}

                  {isAdmin() && (
                    <Link
                      href="/admin/subscriptions"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                        pathname.startsWith("/admin")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Settings className="h-5 w-5" />
                      Admin
                    </Link>
                  )}
                </SignedIn>

                <SignedOut>
                  <div className="my-4 border-t" />
                  <div className="flex flex-col gap-3 px-3">
                    <Link href="/sign-in" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setOpen(false)}>
                      <Button className="w-full">Get Started Free</Button>
                    </Link>
                  </div>
                </SignedOut>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop right section */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-4">
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
                  Coach Studio
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
      </nav>
    </header>
  );
}
