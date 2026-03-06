"use client"

import { TrendingUp, Sparkles, Loader2, AlertCircle, RefreshCw, CheckCircle2, Lightbulb } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAi } from "../hooks/use-ai"

interface Suggestion {
  category: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
}
interface Result { score: number; strengths: string[]; suggestions: Suggestion[]; weekSummary: string }

const IMPACT_CONFIG = {
  high:   { label: "Fort",   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950" },
  medium: { label: "Moyen",  color: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-950"     },
  low:    { label: "Faible", color: "text-gray-500 dark:text-gray-400",       bg: "bg-gray-100 dark:bg-gray-700"      },
}

function buildData() {
  const tasks = JSON.parse(localStorage.getItem("harmonia_tasks") || "[]")
  const sleep = JSON.parse(localStorage.getItem("harmonia_sleep") || "[]")
  const exercise = JSON.parse(localStorage.getItem("harmonia_exercise") || "[]")
  const mood = JSON.parse(localStorage.getItem("harmonia_mood") || "[]")

  const completed = tasks.filter((t: { status: string }) => t.status === "terminé").length
  const pending   = tasks.filter((t: { status: string }) => t.status !== "terminé").length
  const avgSleep  = sleep.length ? (sleep.reduce((s: number, e: { hours: number }) => s + e.hours, 0) / sleep.length).toFixed(1) : null
  const exerciseDays = exercise.length
  const avgMood   = mood.length ? (mood.reduce((s: number, e: { score: number }) => s + e.score, 0) / mood.length).toFixed(1) : null

  return { completedTasks: completed, pendingTasks: pending, avgSleepHours: avgSleep, exerciseDaysThisMonth: exerciseDays, avgMoodScore: avgMood }
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-red-500"
  const bgColor = score >= 75 ? "text-emerald-100 dark:text-emerald-900" : score >= 50 ? "text-amber-100 dark:text-amber-900" : "text-red-100 dark:text-red-900"
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-3xl font-bold ${color}`}>{score}</span>
      <span className="text-[10px] text-gray-400">/100</span>
    </div>
  )
}

export function ProductivityCoach() {
  const { result, loading, error, run } = useAi<Result>("productivity")

  const handleRun = () => run(buildData())

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Coach productivité</h2>
            <p className="text-[10px] text-gray-400">Analyse · Suggestions · Score</p>
          </div>
        </div>
        <button onClick={handleRun} disabled={loading}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium transition-colors">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          {loading ? "Analyse…" : result ? <RefreshCw className="h-3 w-3" /> : "Analyser"}
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        L'IA analyse vos habitudes (tâches, sommeil, exercice, humeur) et propose des optimisations personnalisées.
      </p>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
          <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-2 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-12 rounded-lg bg-gray-100 dark:bg-gray-700" />)}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Score + summary */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <ScoreRing score={result.score} />
            <p className="text-xs text-gray-500 dark:text-gray-400 italic flex-1">{result.weekSummary}</p>
          </div>

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Points forts</p>
              <div className="space-y-1">
                {result.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-gray-600 dark:text-gray-300">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Recommandations</p>
              <div className="space-y-2">
                {result.suggestions.map((sug, i) => {
                  const cfg = IMPACT_CONFIG[sug.impact] ?? IMPACT_CONFIG.low
                  return (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{sug.title}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color} shrink-0`}>{cfg.label}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{sug.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty */}
      {!result && !loading && !error && (
        <div className="flex-1 flex items-center justify-center py-6">
          <p className="text-xs text-gray-400 text-center">Cliquez sur "Analyser" pour recevoir<br />des conseils personnalisés</p>
        </div>
      )}
    </Card>
  )
}
