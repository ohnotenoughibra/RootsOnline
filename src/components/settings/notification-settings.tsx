"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  isPushNotificationsSupported,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from "@/lib/push-notifications";

interface NotificationPreferences {
  newCourses: boolean;
  feedback: boolean;
  reminders: boolean;
  marketing: boolean;
}

export function NotificationSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    newCourses: true,
    feedback: true,
    reminders: true,
    marketing: false,
  });

  useEffect(() => {
    const checkStatus = async () => {
      setIsSupported(isPushNotificationsSupported());

      try {
        const res = await fetch("/api/push-subscription");
        const data = await res.json();

        if (data.subscribed) {
          setIsSubscribed(true);
          setPreferences(data.preferences);
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  const handleEnableNotifications = async () => {
    setIsSaving(true);
    try {
      const permission = await requestNotificationPermission();

      if (permission !== "granted") {
        toast.error("Notification permission denied");
        return;
      }

      const subscription = await subscribeToPushNotifications();
      if (!subscription) {
        toast.error("Failed to subscribe to notifications");
        return;
      }

      // Save subscription to server
      const res = await fetch("/api/push-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          preferences,
        }),
      });

      if (!res.ok) throw new Error("Failed to save subscription");

      setIsSubscribed(true);
      toast.success("Notifications enabled!");
    } catch (error) {
      console.error("Error enabling notifications:", error);
      toast.error("Failed to enable notifications");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsSaving(true);
    try {
      await unsubscribeFromPushNotifications();

      // Remove from server
      await fetch("/api/push-subscription", { method: "DELETE" });

      setIsSubscribed(false);
      toast.success("Notifications disabled");
    } catch (error) {
      console.error("Error disabling notifications:", error);
      toast.error("Failed to disable notifications");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferenceChange = async (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    if (isSubscribed) {
      try {
        await fetch("/api/push-subscription", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences: newPreferences }),
        });
      } catch (error) {
        console.error("Error updating preferences:", error);
        toast.error("Failed to update preferences");
        // Revert
        setPreferences(preferences);
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in your browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get notified about new courses, feedback, and training reminders.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">
              {isSubscribed ? "Notifications Enabled" : "Enable Notifications"}
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications on this device
            </p>
          </div>
          <Button
            variant={isSubscribed ? "destructive" : "default"}
            size="sm"
            onClick={
              isSubscribed
                ? handleDisableNotifications
                : handleEnableNotifications
            }
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSubscribed ? (
              "Disable"
            ) : (
              "Enable"
            )}
          </Button>
        </div>

        {/* Preferences */}
        {isSubscribed && (
          <div className="space-y-4 pt-4 border-t">
            <p className="text-sm font-medium">Notification Types</p>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-courses">New Courses</Label>
                <p className="text-sm text-muted-foreground">
                  When new courses are published
                </p>
              </div>
              <Switch
                id="new-courses"
                checked={preferences.newCourses}
                onCheckedChange={(checked) =>
                  handlePreferenceChange("newCourses", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="feedback">Training Feedback</Label>
                <p className="text-sm text-muted-foreground">
                  When coaches respond to your videos
                </p>
              </div>
              <Switch
                id="feedback"
                checked={preferences.feedback}
                onCheckedChange={(checked) =>
                  handlePreferenceChange("feedback", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reminders">Training Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Daily reminders to keep your streak
                </p>
              </div>
              <Switch
                id="reminders"
                checked={preferences.reminders}
                onCheckedChange={(checked) =>
                  handlePreferenceChange("reminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing">Promotions & Offers</Label>
                <p className="text-sm text-muted-foreground">
                  Special offers and announcements
                </p>
              </div>
              <Switch
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  handlePreferenceChange("marketing", checked)
                }
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
