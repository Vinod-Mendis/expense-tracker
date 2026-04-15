import {
  Briefcase,
  Home,
  UtensilsCrossed,
  Car,
  Tv,
  Heart,
  ShoppingBag,
  Plane,
  GraduationCap,
  Dumbbell,
  Music,
  Coffee,
  Gift,
  PiggyBank,
  Zap,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export const ICON_OPTIONS: { name: string; icon: LucideIcon }[] = [
  { name: "Briefcase", icon: Briefcase },
  { name: "Home", icon: Home },
  { name: "UtensilsCrossed", icon: UtensilsCrossed },
  { name: "Car", icon: Car },
  { name: "Tv", icon: Tv },
  { name: "Heart", icon: Heart },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Plane", icon: Plane },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Dumbbell", icon: Dumbbell },
  { name: "Music", icon: Music },
  { name: "Coffee", icon: Coffee },
  { name: "Gift", icon: Gift },
  { name: "PiggyBank", icon: PiggyBank },
  { name: "Zap", icon: Zap },
  { name: "Wifi", icon: Wifi },
];

export const COLOR_OPTIONS = [
  "#10b981",
  "#3b82f6",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#14b8a6",
  "#6366f1",
  "#84cc16",
  "#06b6d4",
  "#a855f7",
];

export function getIcon(name: string): LucideIcon {
  return ICON_OPTIONS.find((i) => i.name === name)?.icon ?? Briefcase;
}
