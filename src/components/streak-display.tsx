"use client";

import { useEffect, useState } from "react";
import { Flame, Trophy } from "lucide-react";

import { Card } from "@/components/ui/card";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveAt: string;
}

export function StreakDisplay() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreak();
  }, []);

  async function fetchStreak() {
    try {
      const response = await fetch("/api/streaks");
      if (response.ok) {
        const data = await response.json();
        setStreak(data);
      }
    } catch (error) {
      console.error("Error fetching streak:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !streak) {
    return null;
  }

  return (
    <Card className="p-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-full ${streak.currentStreak > 0 ? "bg-orange-100 dark:bg-orange-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
          <Flame className={`h-6 w-6 ${streak.currentStreak > 0 ? "text-orange-500" : "text-gray-400"}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{streak.currentStreak}</p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
      </div>
      <div className="h-10 w-px bg-border" />
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <Trophy className="h-6 w-6 text-yellow-500" />
        </div>
        <div>
          <p className="text-2xl font-bold">{streak.longestStreak}</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
      </div>
    </Card>
  );
}
