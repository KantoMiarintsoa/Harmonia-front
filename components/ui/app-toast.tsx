"use client"

import { CheckCircle, XCircle, X } from "lucide-react"

export interface Toast {
  id: string
  type: "success" | "error"
  message: string
}

interface Props {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function AppToast({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl shadow-lg border text-sm font-medium
            animate-in slide-in-from-right-4 fade-in duration-200
            ${t.type === "success"
              ? "bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
              : "bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
            }`}
        >
          {t.type === "success"
            ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
            : <XCircle className="h-4 w-4 text-red-500 shrink-0" />
          }
          <span className="text-gray-800 dark:text-gray-100">{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="ml-1 h-5 w-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
