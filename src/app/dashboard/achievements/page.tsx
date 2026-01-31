"use client";

import { useEffect, useState } from "react";
import { Trophy, Lock, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Achievement {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  requirement: number;
  points: number;
  earned: boolean;
  earnedAt?: string;
}

interface AchievementData {
  achievements: Achievement[];
  earnedCount: number;
  totalCount: number;
  totalPoints: number;
}

export default function AchievementsPage() {
  const [data, setData] = useState<AchievementData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    try {
      const response = await fetch("/api/achievements");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12 text-center">
        <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Failed to load achievements</p>
      </div>
    );
  }

  const categories = [...new Set(data.achievements.map((a) => a.category))];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Achievements
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your progress and earn badges
          </p>
        </div>

        {/* Stats */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">
                  {data.earnedCount} / {data.totalCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  Achievements Earned
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                  {data.totalPoints}
                </p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
            <Progress
              value={(data.earnedCount / data.totalCount) * 100}
              className="h-3"
            />
          </CardContent>
        </Card>

        {/* Achievements by category */}
        {categories.map((category) => {
          const categoryAchievements = data.achievements.filter(
            (a) => a.category === category
          );
          const earnedInCategory = categoryAchievements.filter(
            (a) => a.earned
          ).length;

          return (
            <section key={category} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold capitalize">
                  {category.toLowerCase().replace("_", " ")}
                </h2>
                <Badge variant="secondary">
                  {earnedInCategory} / {categoryAchievements.length}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryAchievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`relative overflow-hidden transition-all ${
                      achievement.earned
                        ? "border-yellow-500/50 bg-yellow-50/5"
                        : "opacity-60"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`text-3xl ${
                            !achievement.earned && "grayscale"
                          }`}
                        >
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{achievement.name}</h3>
                            {achievement.earned ? (
                              <Badge
                                variant="default"
                                className="bg-yellow-500 text-yellow-950"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                {achievement.points}
                              </Badge>
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                          {achievement.earnedAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Earned{" "}
                              {new Date(achievement.earnedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}

        {data.achievements.length === 0 && (
          <Card className="p-8 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold">No achievements yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Start training to earn your first achievement!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
