"use client"

import { useState } from "react"
import { Toast } from "@/components/ui/toast"

type ToastVariant = "default" | "destructive"

export function useToast() {
  const [toasts, setToasts] = useState<
    { id: string; title: string; description?: string; variant?: ToastVariant }[]
  >([])

  function toast({
    title,
    description,
    variant = "default",
  }: {
    title: string
    description?: string
    variant?: ToastVariant
  }) {
    const id = Math.random().toString(36).substring(2)
    setToasts([...toasts, { id, title, description, variant }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  return { toast, toasts }
}
