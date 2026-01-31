"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityDay {
  date: string;
  count: number;
}

interface TrainingCalendarProps {
  userId?: string;
}

export function TrainingCalendar({ userId }: TrainingCalendarProps) {
  const [activity, setActivity] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, [userId]);

  async function fetchActivity() {
    try {
      const response = await fetch("/api/activity/calendar");
      if (response.ok) {
        const data = await response.json();
        setActivity(data.activity || []);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setLoading(false);
    }
  }

  // Generate last 52 weeks of dates
  const weeks: Date[][] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from 52 weeks ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);
  // Adjust to start on Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let currentDate = new Date(startDate);
  let currentWeek: Date[] = [];

  while (currentDate <= today) {
    currentWeek.push(new Date(currentDate));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Create activity map
  const activityMap = new Map(
    activity.map((a) => [a.date.split("T")[0], a.count])
  );

  const getIntensity = (count: number): string => {
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-green-200 dark:bg-green-900";
    if (count <= 3) return "bg-green-400 dark:bg-green-700";
    if (count <= 5) return "bg-green-500 dark:bg-green-600";
    return "bg-green-600 dark:bg-green-500";
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Get month labels for the calendar
  const monthLabels: { month: string; col: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week[0];
    const month = firstDay.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ month: months[month], col: weekIndex });
      lastMonth = month;
    }
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Training Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const totalActivity = activity.reduce((acc, a) => acc + a.count, 0);
  const activeDays = activity.filter((a) => a.count > 0).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Training Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            {totalActivity} lessons in {activeDays} days
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {/* Month labels */}
          <div className="flex text-xs text-muted-foreground mb-1 ml-8">
            {monthLabels.map(({ month, col }, i) => (
              <span
                key={i}
                className="absolute"
                style={{ marginLeft: `${col * 14 + 32}px` }}
              >
                {month}
              </span>
            ))}
          </div>

          <div className="flex gap-0.5 mt-6">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground mr-2">
              <span className="h-3" />
              <span className="h-3">Mon</span>
              <span className="h-3" />
              <span className="h-3">Wed</span>
              <span className="h-3" />
              <span className="h-3">Fri</span>
              <span className="h-3" />
            </div>

            {/* Calendar grid */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.map((day, dayIndex) => {
                  const dateStr = day.toISOString().split("T")[0];
                  const count = activityMap.get(dateStr) || 0;
                  const isFuture = day > today;

                  return (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${
                        isFuture ? "bg-transparent" : getIntensity(count)
                      }`}
                      title={
                        isFuture
                          ? ""
                          : `${dateStr}: ${count} lesson${count !== 1 ? "s" : ""}`
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-0.5">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
              <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
              <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600" />
              <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
