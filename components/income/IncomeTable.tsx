"use client";

import { Income } from "@/lib/types";
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
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import ReceiptViewer from "./ReceiptViewer";
import AddIncomeDialog from "./AddIncomeDialog";

interface Props {
  income: Income[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onEdit: (income: Income) => void;
  onSort: (field: "date" | "amount") => void;
  sortField: "date" | "amount";
  sortDir: "asc" | "desc";
}

const categoryColors: Record<string, string> = {
  Salary: "bg-emerald-50 text-emerald-700",
  Freelance: "bg-blue-50 text-blue-700",
  Investment: "bg-purple-50 text-purple-700",
  Business: "bg-orange-50 text-orange-700",
  Gift: "bg-pink-50 text-pink-700",
  Other: "bg-gray-100 text-gray-600",
};

export default function IncomeTable({
  income,
  loading,
  onDelete,
  onEdit,
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
                {sortField === "date" ? (
                  sortDir === "asc" ? (
                    <ArrowUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-emerald-500" />
                  )
                ) : (
                  <ArrowUpDown className="w-3 h-3" />
                )}
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => onSort("amount")}
                className="flex items-center gap-1 hover:text-foreground"
              >
                Amount
                {sortField === "amount" ? (
                  sortDir === "asc" ? (
                    <ArrowUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-emerald-500" />
                  )
                ) : (
                  <ArrowUpDown className="w-3 h-3" />
                )}
              </button>
            </TableHead>
            <TableHead>Receipt</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-12"
              >
                Loading...
              </TableCell>
            </TableRow>
          )}
          {!loading && income.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-12"
              >
                No income records found.
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            income.map((i) => (
              <TableRow key={i.id} className="hover:bg-gray-50/50">
                <TableCell>
                  <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{i.title}</p>
                    {i.notes && (
                      <p className="text-xs text-muted-foreground">{i.notes}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs font-normal",
                      categoryColors[i.category] ?? "bg-gray-100 text-gray-600",
                    )}
                  >
                    {i.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(i.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-sm font-semibold text-emerald-600">
                  +${i.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <ReceiptViewer income={i} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <AddIncomeDialog income={i} onEdit={onEdit} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 text-muted-foreground hover:text-red-400"
                      onClick={() => onDelete(i.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
