
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, change, className }) => {
  return (
    <div className={cn("stats-card animate-slide-in", className)}>
      <span className="stats-icon">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {change && (
        <div className="mt-2">
          <span
            className={cn(
              "text-xs font-medium",
              change.positive ? "text-green-500" : "text-red-500"
            )}
          >
            {change.positive ? "+" : "-"} {change.value}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">desde ontem</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
