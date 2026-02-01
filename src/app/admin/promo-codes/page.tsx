"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  Copy,
  Check,
  Tag,
  Percent,
  Euro,
  Calendar,
  Users,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountAmount: number;
  maxUses: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [bulkCreating, setBulkCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Single code form
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCode, setNewCode] = useState({
    code: "",
    description: "",
    discountType: "PERCENT",
    discountAmount: 10,
    maxUses: "",
    validUntil: "",
  });

  // Bulk form
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkOptions, setBulkOptions] = useState({
    count: 10,
    prefix: "ROA",
    description: "",
    discountType: "PERCENT",
    discountAmount: 10,
    maxUses: 1,
    validUntil: "",
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  async function fetchPromoCodes() {
    try {
      const response = await fetch("/api/admin/promo-codes");
      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data);
      } else if (response.status === 403) {
        toast.error("Admin access required");
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast.error("Failed to load promo codes");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newCode.code || !newCode.discountAmount) {
      toast.error("Code and discount amount are required");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCode,
          maxUses: newCode.maxUses ? parseInt(newCode.maxUses) : null,
          validUntil: newCode.validUntil || null,
        }),
      });

      if (response.ok) {
        const code = await response.json();
        setPromoCodes([code, ...promoCodes]);
        setShowCreateDialog(false);
        setNewCode({
          code: "",
          description: "",
          discountType: "PERCENT",
          discountAmount: 10,
          maxUses: "",
          validUntil: "",
        });
        toast.success("Promo code created!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create");
      }
    } catch (error) {
      console.error("Error creating:", error);
      toast.error("Failed to create promo code");
    } finally {
      setCreating(false);
    }
  }

  async function handleBulkCreate() {
    if (!bulkOptions.discountAmount) {
      toast.error("Discount amount is required");
      return;
    }

    setBulkCreating(true);
    try {
      const response = await fetch("/api/admin/promo-codes/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bulkOptions,
          validUntil: bulkOptions.validUntil || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPromoCodes([...data.codes, ...promoCodes]);
        setShowBulkDialog(false);
        toast.success(`Created ${data.count} promo codes!`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create");
      }
    } catch (error) {
      console.error("Error bulk creating:", error);
      toast.error("Failed to create promo codes");
    } finally {
      setBulkCreating(false);
    }
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        setPromoCodes(
          promoCodes.map((p) => (p.id === id ? { ...p, isActive: !isActive } : p))
        );
        toast.success(isActive ? "Code deactivated" : "Code activated");
      }
    } catch (error) {
      toast.error("Failed to update");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this promo code?")) return;

    try {
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPromoCodes(promoCodes.filter((p) => p.id !== id));
        toast.success("Promo code deleted");
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success("Code copied!");
  }

  function formatDiscount(type: string, amount: number) {
    return type === "PERCENT" ? `${amount}%` : `€${(amount / 100).toFixed(2)}`;
  }

  function getStatusBadge(code: PromoCode) {
    if (!code.isActive) return <Badge variant="secondary">Inactive</Badge>;
    if (code.validUntil && new Date(code.validUntil) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (code.maxUses && code.usedCount >= code.maxUses) {
      return <Badge variant="secondary">Depleted</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Tag className="h-8 w-8" />
              Promo Codes
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create and manage discount codes for subscriptions
            </p>
          </div>

          <div className="flex gap-3">
            {/* Bulk Create Dialog */}
            <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Bulk Generate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Generate Promo Codes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Number of Codes</Label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={bulkOptions.count}
                        onChange={(e) =>
                          setBulkOptions({ ...bulkOptions, count: parseInt(e.target.value) || 1 })
                        }
                      />
                    </div>
                    <div>
                      <Label>Prefix</Label>
                      <Input
                        value={bulkOptions.prefix}
                        onChange={(e) =>
                          setBulkOptions({ ...bulkOptions, prefix: e.target.value.toUpperCase() })
                        }
                        placeholder="ROA"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Discount Type</Label>
                      <Select
                        value={bulkOptions.discountType}
                        onValueChange={(value) =>
                          setBulkOptions({ ...bulkOptions, discountType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENT">Percentage</SelectItem>
                          <SelectItem value="FIXED">Fixed Amount (cents)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>
                        {bulkOptions.discountType === "PERCENT" ? "Discount %" : "Amount (cents)"}
                      </Label>
                      <Input
                        type="number"
                        value={bulkOptions.discountAmount}
                        onChange={(e) =>
                          setBulkOptions({
                            ...bulkOptions,
                            discountAmount: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Uses Per Code</Label>
                      <Input
                        type="number"
                        min="1"
                        value={bulkOptions.maxUses}
                        onChange={(e) =>
                          setBulkOptions({
                            ...bulkOptions,
                            maxUses: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Valid Until (optional)</Label>
                      <Input
                        type="date"
                        value={bulkOptions.validUntil}
                        onChange={(e) =>
                          setBulkOptions({ ...bulkOptions, validUntil: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description (optional)</Label>
                    <Input
                      value={bulkOptions.description}
                      onChange={(e) =>
                        setBulkOptions({ ...bulkOptions, description: e.target.value })
                      }
                      placeholder="Campaign name or purpose"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkCreate} disabled={bulkCreating}>
                    {bulkCreating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate {bulkOptions.count} Codes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Single Create Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Promo Code</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Code</Label>
                    <Input
                      value={newCode.code}
                      onChange={(e) =>
                        setNewCode({ ...newCode, code: e.target.value.toUpperCase() })
                      }
                      placeholder="SUMMER2026"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Discount Type</Label>
                      <Select
                        value={newCode.discountType}
                        onValueChange={(value) =>
                          setNewCode({ ...newCode, discountType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENT">Percentage</SelectItem>
                          <SelectItem value="FIXED">Fixed Amount (cents)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>
                        {newCode.discountType === "PERCENT" ? "Discount %" : "Amount (cents)"}
                      </Label>
                      <Input
                        type="number"
                        value={newCode.discountAmount}
                        onChange={(e) =>
                          setNewCode({
                            ...newCode,
                            discountAmount: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Max Uses (optional)</Label>
                      <Input
                        type="number"
                        value={newCode.maxUses}
                        onChange={(e) => setNewCode({ ...newCode, maxUses: e.target.value })}
                        placeholder="Unlimited"
                      />
                    </div>
                    <div>
                      <Label>Valid Until (optional)</Label>
                      <Input
                        type="date"
                        value={newCode.validUntil}
                        onChange={(e) =>
                          setNewCode({ ...newCode, validUntil: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description (optional)</Label>
                    <Input
                      value={newCode.description}
                      onChange={(e) =>
                        setNewCode({ ...newCode, description: e.target.value })
                      }
                      placeholder="Summer promotion 2026"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={creating}>
                    {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{promoCodes.length}</div>
              <div className="text-sm text-muted-foreground">Total Codes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {promoCodes.filter((c) => c.isActive).length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {promoCodes.reduce((sum, c) => sum + c.usedCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Uses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {promoCodes.filter(
                  (c) => c.validUntil && new Date(c.validUntil) < new Date()
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">Expired</div>
            </CardContent>
          </Card>
        </div>

        {/* Codes List */}
        <Card>
          <CardHeader>
            <CardTitle>All Promo Codes</CardTitle>
          </CardHeader>
          <CardContent>
            {promoCodes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No promo codes yet. Create one to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {promoCodes.map((code) => (
                  <div
                    key={code.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => copyCode(code.code)}
                        className="font-mono text-lg font-bold hover:text-primary transition-colors flex items-center gap-2"
                      >
                        {code.code}
                        {copiedCode === code.code ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {getStatusBadge(code)}
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {code.discountType === "PERCENT" ? (
                          <Percent className="h-4 w-4" />
                        ) : (
                          <Euro className="h-4 w-4" />
                        )}
                        <span className="font-medium text-foreground">
                          {formatDiscount(code.discountType, code.discountAmount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {code.usedCount}
                          {code.maxUses ? `/${code.maxUses}` : ""}
                        </span>
                      </div>

                      {code.validUntil && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(code.validUntil).toLocaleDateString()}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleToggleActive(code.id, code.isActive)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title={code.isActive ? "Deactivate" : "Activate"}
                      >
                        {code.isActive ? (
                          <ToggleRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(code.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
