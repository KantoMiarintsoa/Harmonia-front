"use client"

import { useState, useCallback } from "react"
import { Toast } from "@/components/ui/app-toast"

export function useAppToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: "success" | "error", message: string) => {
    const id = crypto.randomUUID()
    setToasts(t => [...t, { id, type, message }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  return { toasts, addToast, dismiss }
}
