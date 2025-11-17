"use client";

import { useEffect, useState } from "react";
import { IconSparkles } from "@tabler/icons-react";

export function AIUsageCard() {
  const [stats, setStats] = useState({
    currentMonth: 0,
    percentageChange: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats/queries");
        if (response.ok) {
          const data = await response.json();
          setStats({
            currentMonth: data.currentMonth,
            percentageChange: data.percentageChange,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
    // Refresh every 10 seconds for more responsive updates
    const interval = setInterval(fetchStats, 10000);
    
    // Listen for custom event to refresh immediately
    const handleRefresh = () => fetchStats();
    window.addEventListener("refreshStats", handleRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("refreshStats", handleRefresh);
    };
  }, []);

  const progressPercentage = Math.min((stats.currentMonth / 500) * 100, 100);

  return (
    <div className="mx-6 mt-auto mb-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-purple-500/10 border border-primary/20 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <IconSparkles className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-semibold">AI Usage</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">This month</span>
          <span className="font-bold">
            {stats.loading ? "..." : `${stats.currentMonth} queries`}
          </span>
        </div>
        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {stats.loading ? (
            "Loading..."
          ) : stats.percentageChange === 0 ? (
            "Same as last month"
          ) : (
            <>
              <span className={stats.percentageChange > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                {Math.abs(stats.percentageChange)}%
              </span>{" "}
              {stats.percentageChange > 0 ? "more" : "less"} than last month
            </>
          )}
        </p>
      </div>
    </div>
  );
}
