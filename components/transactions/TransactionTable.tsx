"use client";

import { Transaction } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Trash2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onSort: (field: "date" | "amount") => void;
  sortField: "date" | "amount";
  sortDir: "asc" | "desc";
}

const categoryColors: Record<string, string> = {
  Work: "bg-emerald-50 text-emerald-700",
  Housing: "bg-blue-50 text-blue-700",
  Food: "bg-orange-50 text-orange-700",
  Transport: "bg-purple-50 text-purple-700",
  Entertainment: "bg-pink-50 text-pink-700",
  Health: "bg-red-50 text-red-700",
};

export default function TransactionTable({
  transactions,
  onDelete,
  onSort,
  sortField,
  sortDir,
}: Props) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-10"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>
              <button
                onClick={() => onSort("date")}
                className="flex items-center gap-1 hover:text-foreground"
              >
                Date
                <ArrowUpDown
                  className={cn(
                    "w-3 h-3",
                    sortField === "date" && "text-emerald-500",
                  )}
                />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => onSort("amount")}
                className="flex items-center gap-1 hover:text-foreground"
              >
                Amount
                <ArrowUpDown
                  className={cn(
                    "w-3 h-3",
                    sortField === "amount" && "text-emerald-500",
                  )}
                />
              </button>
            </TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-12"
              >
                No transactions found.
              </TableCell>
            </TableRow>
          )}
          {transactions.map((t) => (
            <TableRow key={t.id} className="hover:bg-gray-50/50">
              <TableCell>
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center",
                    t.type === "income" ? "bg-emerald-50" : "bg-red-50",
                  )}
                >
                  {t.type === "income" ? (
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{t.title}</p>
                  {t.notes && (
                    <p className="text-xs text-muted-foreground">{t.notes}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs font-normal",
                    categoryColors[t.category],
                  )}
                >
                  {t.category}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(t.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell
                className={cn(
                  "text-sm font-semibold",
                  t.type === "income" ? "text-emerald-600" : "text-red-400",
                )}
              >
                {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 text-muted-foreground hover:text-red-400"
                  onClick={() => onDelete(t.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
