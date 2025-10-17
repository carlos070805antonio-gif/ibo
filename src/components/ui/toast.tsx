// components/ui/toast.tsx
"use client";

import React from "react";
import { cn } from "@/lib2/utils";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function Toast({ title, description, variant = "default" }: ToastProps) {
  return (
    <div
      className={cn(
        "max-w-sm w-full p-3 rounded-lg shadow-lg border transform transition-all animate-fadeIn",
        variant === "destructive"
          ? "bg-red-600 text-white border-red-700"
          : "bg-white text-gray-900 border-gray-200"
      )}
    >
      <div className="font-semibold">{title}</div>
      {description && <div className="text-sm opacity-90 mt-1">{description}</div>}
    </div>
  );
}
