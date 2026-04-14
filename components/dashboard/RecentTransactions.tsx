import { Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
}

const categoryColors: Record<string, string> = {
  Work: "bg-emerald-50 text-emerald-700",
  Housing: "bg-blue-50 text-blue-700",
  Food: "bg-orange-50 text-orange-700",
  Transport: "bg-purple-50 text-purple-700",
  Entertainment: "bg-pink-50 text-pink-700",
  Health: "bg-red-50 text-red-700",
};

export default function RecentTransactions({ transactions }: Props) {
  const recent = transactions.slice(0, 6);

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-zinc-900">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Recent Transactions
          </CardTitle>
          <a
            href="/transactions"
            className="text-xs text-emerald-600 hover:underline"
          >
            View all
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {recent.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  t.type === "income" ? "bg-emerald-50" : "bg-red-50",
                )}
              >
                {t.type === "income" ? (
                  <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium leading-tight">{t.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(t.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-normal hidden sm:inline-flex",
                  categoryColors[t.category],
                )}
              >
                {t.category}
              </Badge>
              <span
                className={cn(
                  "text-sm font-semibold",
                  t.type === "income" ? "text-emerald-600" : "text-red-400",
                )}
              >
                {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
