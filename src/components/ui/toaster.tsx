// components/ui/Toaster.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastContextType = {
  toast: (opts: { title: string; description?: string; variant?: "default" | "destructive" }) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function toast({ title, description, variant = "default" }: { title: string; description?: string; variant?: "default" | "destructive" }) {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* viewport dos toasts */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full p-3 rounded-lg shadow-lg border transform transition-all
              ${t.variant === "destructive" ? "bg-red-600 text-white border-red-700" : "bg-white text-gray-900 border-gray-200"}`}
          >
            <div className="font-semibold">{t.title}</div>
            {t.description && <div className="text-sm opacity-90 mt-1">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToasterProvider");
  return ctx;
}
