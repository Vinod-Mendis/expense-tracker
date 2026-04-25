"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { X, ImageIcon } from "lucide-react";

interface ReceiptFile {
  file: File;
  preview?: string;
  type: "image";
}

interface Props {
  value: ReceiptFile | null;
  onChange: (file: ReceiptFile | null) => void;
}

export default function ReceiptUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const preview = URL.createObjectURL(file);
    onChange({ file, preview, type: "image" });
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
        <img
          src={value.preview}
          alt="Receipt"
          className="w-full h-36 object-cover"
        />
        <button
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <div className="px-3 py-2 border-t bg-white">
          <p className="text-xs text-muted-foreground truncate">
            {value.file.name}
          </p>
        </div>
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
      <ImageIcon className="w-5 h-5 text-muted-foreground" />
      <p className="text-sm text-muted-foreground text-center">
        Drop image here or{" "}
        <span className="text-emerald-600 font-medium">browse</span>
      </p>
      <p className="text-xs text-muted-foreground">
        JPG, PNG, WebP · max 10MB · saved as WebP
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
