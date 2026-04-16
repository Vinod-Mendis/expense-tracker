"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, ImageIcon, ExternalLink } from "lucide-react";
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
        {receipt.type === "pdf" ? (
          <FileText className="w-3.5 h-3.5" />
        ) : (
          <ImageIcon className="w-3.5 h-3.5" />
        )}
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
            {receipt.type === "image" ? (
              <img
                src={receipt.url}
                alt="Receipt"
                className="w-full rounded-lg object-contain max-h-[60vh]"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{receipt.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF Document
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(receipt.url, "_blank")}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open PDF
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
