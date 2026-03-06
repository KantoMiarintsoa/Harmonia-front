"use client"

import { ListOrdered, Sparkles, Loader2, AlertCircle, RefreshCw, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAi } from "../hooks/use-ai"
import Link from "next/link"

interface PrioritizedTask {
  id: string
  title: string
  priority: "haute" | "moyenne" | "faible"
  score: number
  reason: string
}
interface Result { prioritized: PrioritizedTask[]; summary: string }

const PRIORITY_CONFIG = {
  haute:   { color: "text-red-600 dark:text-red-400",    bg: "bg-red-50 dark:bg-red-950",    bar: "bg-red-500"    },
  moyenne: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950", bar: "bg-amber-500" },
  faible:  { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950", bar: "bg-emerald-400" },
}

function buildData() {
  const raw = localStorage.getItem("harmonia_tasks")
  if (!raw) return []
  const tasks = JSON.parse(raw)
  return tasks.filter((t: { status: string }) => t.status !== "terminé").map(({ id, title, category, dueDate }: { id: string; title: string; category: string; dueDate: string }) => ({ id, title, category, dueDate }))
}

export function TaskPrioritizer() {
  const { result, loading, error, run } = useAi<Result>("prioritize")

  const handleRun = () => {
    const data = buildData()
    if (data.length === 0) { alert("Aucune tâche en cours à prioriser."); return }
    run(data)
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
            <ListOrdered className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Priorisation intelligente</h2>
            <p className="text-[10px] text-gray-400">Urgence · Énergie · Habitudes</p>
          </div>
        </div>
        <button onClick={handleRun} disabled={loading}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium transition-colors">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          {loading ? "Analyse…" : result ? <RefreshCw className="h-3 w-3" /> : "Analyser"}
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        L'IA analyse vos tâches en cours et les classe par ordre de priorité selon leur urgence, votre énergie et vos habitudes.
      </p>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
          <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-12 rounded-lg bg-gray-100 dark:bg-gray-700" />)}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 italic border-l-2 border-violet-300 pl-2">{result.summary}</p>
          <div className="space-y-2">
            {result.prioritized.map((task, i) => {
              const cfg = PRIORITY_CONFIG[task.priority]
              return (
                <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg} border-transparent`}>
                  <span className="text-xs font-bold text-gray-400 mt-0.5 w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{task.title}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color} shrink-0`}>{task.priority}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className={`h-full ${cfg.bar} rounded-full`} style={{ width: `${task.score}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400">{task.score}/100</span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{task.reason}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <Link href="/protected/tasks" className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline">
            Gérer les tâches <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Empty */}
      {!result && !loading && !error && (
        <div className="flex-1 flex items-center justify-center py-6">
          <p className="text-xs text-gray-400 text-center">Cliquez sur "Analyser" pour obtenir<br />une priorisation intelligente de vos tâches</p>
        </div>
      )}
    </Card>
  )
}
