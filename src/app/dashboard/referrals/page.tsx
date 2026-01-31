"use client";

import { useEffect, useState } from "react";
import { Users, Loader2, Copy, Gift, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReferralData {
  referralCode: string;
  referralLink: string;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarned: number;
  referrals: Array<{
    id: string;
    referredUser: {
      firstName: string | null;
      lastName: string | null;
      createdAt: string;
    } | null;
    rewardAmount: number;
    completedAt: string | null;
  }>;
}

export default function ReferralsPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, []);

  async function fetchReferrals() {
    try {
      const response = await fetch("/api/referrals");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast.error("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    if (!data) return;
    navigator.clipboard.writeText(data.referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  function copyCode() {
    if (!data) return;
    navigator.clipboard.writeText(data.referralCode);
    toast.success("Referral code copied!");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Failed to load referral data</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Refer Friends</h1>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-primary">{data.successfulReferrals}</p>
            <p className="text-sm text-muted-foreground">Successful Referrals</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-yellow-500">{data.pendingReferrals}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-green-500">€{data.totalEarned}</p>
            <p className="text-sm text-muted-foreground">Total Earned</p>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Your Referral Link</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Share this link with friends. When they subscribe, you both get €20 credit!
          </p>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 bg-muted rounded-md px-4 py-2 text-sm truncate">
              {data.referralLink}
            </div>
            <Button onClick={copyLink} variant="default">
              {copied ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Or share code:</span>
            <Badge
              variant="secondary"
              className="text-lg cursor-pointer"
              onClick={copyCode}
            >
              {data.referralCode}
            </Badge>
          </div>
        </Card>

        {/* How It Works */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-bold">1</span>
              </div>
              <p className="font-medium">Share Your Link</p>
              <p className="text-sm text-muted-foreground">
                Send your unique link to friends interested in martial arts
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-bold">2</span>
              </div>
              <p className="font-medium">They Subscribe</p>
              <p className="text-sm text-muted-foreground">
                Your friend signs up and becomes a paying member
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-bold">3</span>
              </div>
              <p className="font-medium">Both Get €20</p>
              <p className="text-sm text-muted-foreground">
                You each receive €20 credit towards your subscription
              </p>
            </div>
          </div>
        </Card>

        {/* Referral History */}
        {data.referrals.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Referral History</h2>
            <div className="space-y-3">
              {data.referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {ref.referredUser?.firstName || "Anonymous"}{" "}
                      {ref.referredUser?.lastName || ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Joined {ref.completedAt && new Date(ref.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-green-600">
                    +€{ref.rewardAmount}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
