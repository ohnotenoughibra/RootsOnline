"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Copy,
  CheckCircle,
  DollarSign,
  Users,
  TrendingUp,
  CreditCard,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AffiliateData {
  enrolled: boolean;
  affiliate?: {
    affiliateCode: string;
    commissionRate: number;
    status: string;
    totalReferrals: number;
    totalEarnings: number;
    pendingPayout: number;
    paidOut: number;
    conversions: Array<{
      id: string;
      amount: number;
      commission: number;
      status: string;
      createdAt: string;
    }>;
    payouts: Array<{
      id: string;
      amount: number;
      method: string;
      status: string;
      processedAt: string | null;
      createdAt: string;
    }>;
  };
}

export default function AffiliatePage() {
  const [data, setData] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [newPaypalEmail, setNewPaypalEmail] = useState("");
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  async function fetchAffiliateData() {
    try {
      const response = await fetch("/api/affiliate");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
      toast.error("Failed to load affiliate data");
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll() {
    if (!paypalEmail) {
      toast.error("Please enter your PayPal email");
      return;
    }

    setEnrolling(true);
    try {
      const response = await fetch("/api/affiliate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paypalEmail }),
      });

      if (response.ok) {
        toast.success("Welcome to the affiliate program!");
        fetchAffiliateData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to enroll");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      toast.error("Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  }

  async function handleUpdatePaypal() {
    if (!newPaypalEmail) {
      toast.error("Please enter a PayPal email");
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch("/api/affiliate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paypalEmail: newPaypalEmail }),
      });

      if (response.ok) {
        toast.success("PayPal email updated");
        setNewPaypalEmail("");
        fetchAffiliateData();
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      console.error("Error updating:", error);
      toast.error("Failed to update");
    } finally {
      setUpdating(false);
    }
  }

  function copyCode() {
    if (!data?.affiliate) return;
    navigator.clipboard.writeText(data.affiliate.affiliateCode);
    setCopied("code");
    toast.success("Affiliate code copied!");
    setTimeout(() => setCopied(null), 2000);
  }

  function copyLink() {
    if (!data?.affiliate) return;
    const link = `${window.location.origin}?ref=${data.affiliate.affiliateCode}`;
    navigator.clipboard.writeText(link);
    setCopied("link");
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(null), 2000);
  }

  function formatCurrency(cents: number) {
    return `€${(cents / 100).toFixed(2)}`;
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "APPROVED":
      case "COMPLETED":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "REJECTED":
      case "FAILED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "REFUNDED":
        return <Badge variant="outline">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not enrolled - show enrollment form
  if (!data?.enrolled) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Affiliate Program</h1>
            <p className="mt-2 text-muted-foreground">
              Earn 20% commission on every sale you refer
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold text-lg">1</span>
                  </div>
                  <p className="font-medium">Share Your Link</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get a unique affiliate link to share with your audience
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold text-lg">2</span>
                  </div>
                  <p className="font-medium">Track Conversions</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    When someone subscribes through your link, you earn commission
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold text-lg">3</span>
                  </div>
                  <p className="font-medium">Get Paid</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive 20% of every subscription payment, monthly via PayPal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Join the Program</h2>

              <div className="bg-muted/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  An active subscription is required to join the affiliate program.
                  This ensures our affiliates are genuine members of our community.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="paypal">PayPal Email (for payouts)</Label>
                  <Input
                    id="paypal"
                    type="email"
                    placeholder="your-email@paypal.com"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={handleEnroll}
                  disabled={enrolling || !paypalEmail}
                  className="w-full"
                >
                  {enrolling ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <DollarSign className="h-4 w-4 mr-2" />
                  )}
                  Become an Affiliate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const affiliate = data.affiliate!;
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}?ref=${affiliate.affiliateCode}`;

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <DollarSign className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
            <p className="text-muted-foreground">
              Earn {affiliate.commissionRate}% commission on every referral
            </p>
          </div>
        </div>

        {/* Status Banner */}
        {affiliate.status !== "ACTIVE" && (
          <Card className="mb-6 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800 dark:text-yellow-200">
                Your affiliate account is currently {affiliate.status.toLowerCase()}.
                Please contact support if you have questions.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{affiliate.totalReferrals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(affiliate.totalEarnings)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(affiliate.pendingPayout)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(affiliate.paidOut)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Affiliate Link */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 bg-muted rounded-md px-4 py-2 text-sm truncate font-mono">
                {referralLink}
              </div>
              <Button onClick={copyLink}>
                {copied === "link" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Affiliate Code:</span>
              <Badge
                variant="secondary"
                className="text-lg cursor-pointer font-mono"
                onClick={copyCode}
              >
                {affiliate.affiliateCode}
                {copied === "code" ? (
                  <CheckCircle className="h-3 w-3 ml-2" />
                ) : (
                  <Copy className="h-3 w-3 ml-2" />
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Conversions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            {affiliate.conversions.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No conversions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Share your link to start earning commissions
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {affiliate.conversions.map((conversion) => (
                  <div
                    key={conversion.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        Sale: {formatCurrency(conversion.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(conversion.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-green-600">
                          +{formatCurrency(conversion.commission)}
                        </p>
                        {getStatusBadge(conversion.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payout History */}
        {affiliate.payouts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {affiliate.payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{formatCurrency(payout.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        via {payout.method} •{" "}
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>{getStatusBadge(payout.status)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPaypal">Update PayPal Email</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="newPaypal"
                    type="email"
                    placeholder="your-email@paypal.com"
                    value={newPaypalEmail}
                    onChange={(e) => setNewPaypalEmail(e.target.value)}
                  />
                  <Button
                    onClick={handleUpdatePaypal}
                    disabled={updating || !newPaypalEmail}
                  >
                    {updating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Update"
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Payouts are processed monthly for balances over €50. Commission is paid
                once the referred subscription remains active for 30 days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
