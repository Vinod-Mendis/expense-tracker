"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { Income } from "@/lib/types";

interface Props {
  income: Income;
}

export default function ReceiptViewer({ income }: Props) {
  const [open, setOpen] = useState(false);
  const receipt = income.receipt;
  if (!receipt) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-muted-foreground hover:text-emerald-600 gap-1.5"
        onClick={() => setOpen(true)}
      >
        <ImageIcon className="w-3.5 h-3.5" />
        Receipt
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium truncate">
              {receipt.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <img
              src={receipt.url}
              alt="Receipt"
              className="w-full rounded-lg object-contain max-h-[60vh]"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
