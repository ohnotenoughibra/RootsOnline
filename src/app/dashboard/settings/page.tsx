"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Settings, CreditCard, Bell, Shield, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SubscriptionData {
  status: string;
  plan: string | null;
  endsAt: string | null;
}

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  async function fetchSubscription() {
    try {
      const response = await fetch("/api/user/subscription");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoadingSubscription(false);
    }
  }

  async function openBillingPortal() {
    setLoadingPortal(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to open billing portal");
      }
    } catch (error) {
      console.error("Error opening portal:", error);
      toast.error("Failed to open billing portal");
    } finally {
      setLoadingPortal(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Profile & Security
              </CardTitle>
              <CardDescription>
                Manage your account details and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user?.fullName || "User"}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <Button variant="outline" onClick={() => openUserProfile()}>
                  Edit Profile
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password & Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Update your password or enable two-factor authentication
                  </p>
                </div>
                <Button variant="outline" onClick={() => openUserProfile()}>
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription & Billing
              </CardTitle>
              <CardDescription>
                Manage your subscription and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingSubscription ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground">Loading subscription...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Plan</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            subscription?.status === "ACTIVE" ? "default" : "secondary"
                          }
                        >
                          {subscription?.status || "INACTIVE"}
                        </Badge>
                        {subscription?.plan && (
                          <span className="text-sm text-muted-foreground">
                            {subscription.plan}
                          </span>
                        )}
                      </div>
                      {subscription?.endsAt && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {subscription.status === "ACTIVE" ? "Renews" : "Ends"}{" "}
                          {new Date(subscription.endsAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {subscription?.status === "ACTIVE" ? (
                      <Button
                        variant="outline"
                        onClick={openBillingPortal}
                        disabled={loadingPortal}
                      >
                        {loadingPortal ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Manage Subscription
                      </Button>
                    ) : (
                      <Button asChild>
                        <a href="/pricing">Subscribe</a>
                      </Button>
                    )}
                  </div>
                  {subscription?.status === "ACTIVE" && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Payment Method</p>
                          <p className="text-sm text-muted-foreground">
                            Update your card or billing information
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={openBillingPortal}
                          disabled={loadingPortal}
                        >
                          Update
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Billing History</p>
                          <p className="text-sm text-muted-foreground">
                            View and download past invoices
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={openBillingPortal}
                          disabled={loadingPortal}
                        >
                          View Invoices
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive updates and reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new courses and features
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="streak-reminders" className="font-medium">
                    Streak Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded to train and keep your streak alive
                  </p>
                </div>
                <Switch id="streak-reminders" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="feedback-notifications" className="font-medium">
                    Feedback Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Be notified when a coach provides feedback on your footage
                  </p>
                </div>
                <Switch id="feedback-notifications" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" onClick={() => openUserProfile()}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
