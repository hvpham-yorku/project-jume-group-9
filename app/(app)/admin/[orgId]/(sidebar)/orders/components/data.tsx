import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Circle, CircleOff, HelpCircle, Timer } from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-500 border border-yellow-500",
  },
  {
    value: "fulfilled",
    label: "Fulfilled",
    className: "bg-green-500/10 text-green-500 border border-green-500",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    className: "bg-red-500/10 text-red-500 border border-red-500",
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];
