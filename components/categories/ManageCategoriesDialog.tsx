"use client";

import { useState } from "react";
import { Category } from "@/lib/types";
import { ICON_OPTIONS, COLOR_OPTIONS, getIcon } from "@/lib/category-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Tags } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
  onAdd: (c: Category) => void;
  onDelete: (id: string) => void;
  trigger?: React.ReactNode;
}

export default function ManageCategoriesDialog({
  categories,
  onAdd,
  onDelete,
  trigger,
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [icon, setIcon] = useState(ICON_OPTIONS[0].name);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      id: Date.now().toString(),
      name: name.trim(),
      color,
      icon,
    });
    setName("");
    setColor(COLOR_OPTIONS[0]);
    setIcon(ICON_OPTIONS[0].name);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="gap-2">
            <Tags className="w-4 h-4" /> Manage Categories
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Add new */}
          <div className="space-y-3 border rounded-xl p-4 bg-gray-50">
            <p className="text-sm font-medium">New Category</p>

            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                placeholder="e.g. Subscriptions"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white"
              />
            </div>

            {/* Icon picker */}
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <div className="grid grid-cols-8 gap-1.5">
                {ICON_OPTIONS.map(({ name: n, icon: Icon }) => (
                  <button
                    key={n}
                    onClick={() => setIcon(n)}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      icon === n
                        ? "text-white"
                        : "bg-white border hover:bg-gray-100 text-muted-foreground",
                    )}
                    style={icon === n ? { backgroundColor: color } : {}}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div className="space-y-1.5">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-6 h-6 rounded-full transition-transform",
                      color === c &&
                        "ring-2 ring-offset-2 ring-gray-400 scale-110",
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleAdd}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Add Category
            </Button>
          </div>

          {/* Existing categories */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Existing Categories</p>
            <ScrollArea className="h-48">
              <div className="space-y-1.5 pr-2">
                {categories.map((cat) => {
                  const Icon = getIcon(cat.icon);
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg border bg-white"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: cat.color + "20" }}
                        >
                          <Icon
                            className="w-3.5 h-3.5"
                            style={{ color: cat.color }}
                          />
                        </div>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-muted-foreground hover:text-red-400"
                        onClick={() => onDelete(cat.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
