import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  iconClass?: string;
}

export default function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  trend,
  iconClass,
}: StatCardProps) {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900">
      <CardContent className="p-5 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {sub && (
            <p
              className={cn(
                "text-xs font-medium",
                trend === "up" && "text-emerald-500",
                trend === "down" && "text-red-400",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {sub}
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-2.5 rounded-xl",
            iconClass ?? "bg-emerald-50 dark:bg-emerald-950",
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              iconClass ? "text-white" : "text-emerald-600",
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
