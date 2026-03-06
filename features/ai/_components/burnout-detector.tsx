"use client"

import { HeartPulse, Sparkles, Loader2, AlertCircle, RefreshCw, ShieldAlert, Shield, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAi } from "../hooks/use-ai"

interface RiskFactor { factor: string; level: "high" | "medium" | "low"; detail: string }
interface Result { riskLevel: "critique" | "modéré" | "faible"; riskScore: number; factors: RiskFactor[]; advice: string; urgentAction: string | null }

const RISK_CONFIG = {
  critique: {
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
    bar: "bg-red-500",
    Icon: ShieldAlert,
  },
  modéré: {
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-200 dark:border-amber-800",
    bar: "bg-amber-500",
    Icon: Shield,
  },
  faible: {
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    border: "border-emerald-200 dark:border-emerald-800",
    bar: "bg-emerald-500",
    Icon: ShieldCheck,
  },
}

const FACTOR_LEVEL_COLOR: Record<string, string> = {
  high:   "text-red-500",
  medium: "text-amber-500",
  low:    "text-emerald-500",
}

function buildData() {
  const tasks = JSON.parse(localStorage.getItem("harmonia_tasks") || "[]")
  const sleep = JSON.parse(localStorage.getItem("harmonia_sleep") || "[]")
  const exercise = JSON.parse(localStorage.getItem("harmonia_exercise") || "[]")
  const mood = JSON.parse(localStorage.getItem("harmonia_mood") || "[]")

  const overdue = tasks.filter((t: { dueDate: string; status: string }) =>
    t.dueDate && t.dueDate < new Date().toISOString().slice(0, 10) && t.status !== "terminé"
  ).length
  const pending = tasks.filter((t: { status: string }) => t.status !== "terminé").length

  const last7Sleep = sleep.slice(-7)
  const avgSleep = last7Sleep.length
    ? (last7Sleep.reduce((s: number, e: { hours: number }) => s + e.hours, 0) / last7Sleep.length).toFixed(1)
    : null

  const last7Mood = mood.slice(-7)
  const avgMood = last7Mood.length
    ? (last7Mood.reduce((s: number, e: { score: number }) => s + e.score, 0) / last7Mood.length).toFixed(1)
    : null

  const exerciseDaysLast7 = exercise.filter((e: { date: string }) => {
    const d = new Date(); d.setDate(d.getDate() - 7)
    return e.date >= d.toISOString().slice(0, 10)
  }).length

  return { pendingTasks: pending, overdueTasks: overdue, avgSleepLast7Days: avgSleep, avgMoodLast7Days: avgMood, exerciseDaysLast7 }
}

export function BurnoutDetector() {
  const { result, loading, error, run } = useAi<Result>("burnout")

  const handleRun = () => run(buildData())

  const cfg = result ? RISK_CONFIG[result.riskLevel] ?? RISK_CONFIG.faible : null

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950 flex items-center justify-center">
            <HeartPulse className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Détecteur de burnout</h2>
            <p className="text-[10px] text-gray-400">Surcharge · Risques · Prévention</p>
          </div>
        </div>
        <button onClick={handleRun} disabled={loading}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-medium transition-colors">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          {loading ? "Analyse…" : result ? <RefreshCw className="h-3 w-3" /> : "Analyser"}
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        L'IA détecte les signaux de surcharge ou de burnout à partir de vos données (tâches, sommeil, humeur, activité physique).
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
          {[1,2,3].map(i => <div key={i} className="h-10 rounded-lg bg-gray-100 dark:bg-gray-700" />)}
        </div>
      )}

      {/* Result */}
      {result && !loading && cfg && (
        <div className="space-y-3">
          {/* Risk level card */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
            <cfg.Icon className={`h-6 w-6 ${cfg.color} shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-bold ${cfg.color} capitalize`}>Risque {result.riskLevel}</span>
                <span className={`text-xs font-bold ${cfg.color}`}>{result.riskScore}/100</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div className={`h-full ${cfg.bar} rounded-full transition-all`} style={{ width: `${result.riskScore}%` }} />
              </div>
            </div>
          </div>

          {/* Urgent action */}
          {result.urgentAction && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900">
              <ShieldAlert className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-[11px] font-medium text-red-600 dark:text-red-400">{result.urgentAction}</p>
            </div>
          )}

          {/* Factors */}
          {result.factors.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Facteurs détectés</p>
              <div className="space-y-1.5">
                {result.factors.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <span className={`text-[10px] font-bold mt-0.5 shrink-0 ${FACTOR_LEVEL_COLOR[f.level] ?? "text-gray-400"}`}>●</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{f.factor}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advice */}
          <p className="text-xs text-gray-500 dark:text-gray-400 italic border-l-2 border-rose-300 pl-2">{result.advice}</p>
        </div>
      )}

      {/* Empty */}
      {!result && !loading && !error && (
        <div className="flex-1 flex items-center justify-center py-6">
          <p className="text-xs text-gray-400 text-center">Cliquez sur "Analyser" pour détecter<br />les risques de surcharge ou de burnout</p>
        </div>
      )}
    </Card>
  )
}
