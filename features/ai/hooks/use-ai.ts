"use client"

import { useState } from "react"

type AiType = "prioritize" | "planning" | "productivity" | "burnout"

export function useAi<T = unknown>(type: AiType) {
  const [result, setResult] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async (data: unknown) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error ?? "Erreur serveur")
      setResult(json.result as T)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return { result, loading, error, run }
}
