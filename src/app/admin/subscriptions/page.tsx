"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Search, Building2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
}

export default function AdminSubscriptionsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/subscriptions/activate");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else if (response.status === 403) {
        toast.error("Admin access required");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate(userId: string) {
    const plan = selectedPlan[userId] || "annual";
    setActivating(userId);

    try {
      const response = await fetch("/api/admin/subscriptions/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Subscription activated for ${data.user.email}`);
        // Remove user from list
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to activate");
      }
    } catch (error) {
      console.error("Error activating:", error);
      toast.error("Failed to activate subscription");
    } finally {
      setActivating(null);
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8" />
            SEPA Subscriptions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manually activate subscriptions for bank transfer payments
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users list */}
        <Card>
          <CardHeader>
            <CardTitle>Inactive Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No inactive users found
              </p>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs font-mono text-primary mt-1">
                        Ref: ROA-{user.id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Select
                        value={selectedPlan[user.id] || "annual"}
                        onValueChange={(value) =>
                          setSelectedPlan({ ...selectedPlan, [user.id]: value })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annual">Annual (€99)</SelectItem>
                          <SelectItem value="monthly">1 Month</SelectItem>
                          <SelectItem value="3months">3 Months</SelectItem>
                          <SelectItem value="6months">6 Months</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        onClick={() => handleActivate(user.id)}
                        disabled={activating === user.id}
                      >
                        {activating === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
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
