"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Paperclip, X, FileText, ImageIcon } from "lucide-react";

interface ReceiptFile {
  file: File;
  preview?: string;
  type: "image" | "pdf";
}

interface Props {
  value: ReceiptFile | null;
  onChange: (file: ReceiptFile | null) => void;
}

export default function ReceiptUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) return;

    const type = isImage ? "image" : "pdf";
    const preview = isImage ? URL.createObjectURL(file) : undefined;
    onChange({ file, preview, type });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  if (value) {
    return (
      <div className="relative rounded-xl border bg-gray-50 overflow-hidden">
        {value.type === "image" && value.preview ? (
          <img
            src={value.preview}
            alt="Receipt"
            className="w-full h-36 object-cover"
          />
        ) : (
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{value.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(value.file.size / 1024).toFixed(1)} KB · PDF
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        {value.type === "image" && (
          <div className="px-3 py-2 border-t bg-white">
            <p className="text-xs text-muted-foreground truncate">
              {value.file.name}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
        dragging
          ? "border-emerald-400 bg-emerald-50"
          : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50",
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <ImageIcon className="w-4 h-4" />
        <Paperclip className="w-4 h-4" />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Drop receipt here or{" "}
        <span className="text-emerald-600 font-medium">browse</span>
      </p>
      <p className="text-xs text-muted-foreground">
        JPG, PNG or PDF · max 10MB
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
