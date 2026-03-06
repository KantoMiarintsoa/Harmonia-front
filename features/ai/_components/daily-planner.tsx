"use client"

import { CalendarClock, Sparkles, Loader2, AlertCircle, RefreshCw, Clock, Tag } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAi } from "../hooks/use-ai"

interface PlannedTask {
  time: string
  title: string
  duration: number
  category: string
  tip: string
}
interface Result { plan: PlannedTask[]; dayTheme: string; totalMinutes: number }

const CATEGORY_COLORS: Record<string, string> = {
  travail:     "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  santé:       "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  personnel:   "bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400",
  famille:     "bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400",
  finance:     "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  loisirs:     "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
}

function getCategoryStyle(cat: string) {
  return CATEGORY_COLORS[cat.toLowerCase()] ?? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
}

function buildData() {
  const raw = localStorage.getItem("harmonia_tasks")
  if (!raw) return { tasks: [], today: new Date().toISOString().slice(0, 10) }
  const tasks = JSON.parse(raw)
  const pending = tasks
    .filter((t: { status: string }) => t.status !== "terminé")
    .map(({ id, title, category, dueDate, priority }: { id: string; title: string; category: string; dueDate: string; priority: string }) => ({ id, title, category, dueDate, priority }))
  return { tasks: pending, today: new Date().toISOString().slice(0, 10) }
}

export function DailyPlanner() {
  const { result, loading, error, run } = useAi<Result>("planning")

  const handleRun = () => {
    const data = buildData()
    if (data.tasks.length === 0) { alert("Aucune tâche en cours pour générer un planning."); return }
    run(data)
  }

  const totalHours = result ? Math.floor(result.totalMinutes / 60) : 0
  const totalMins  = result ? result.totalMinutes % 60 : 0

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-violet-50 dark:bg-violet-950 flex items-center justify-center">
            <CalendarClock className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Planning quotidien</h2>
            <p className="text-[10px] text-gray-400">Génération automatique · IA</p>
          </div>
        </div>
        <button onClick={handleRun} disabled={loading}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-medium transition-colors">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          {loading ? "Génération…" : result ? <RefreshCw className="h-3 w-3" /> : "Générer"}
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        L'IA organise vos tâches en un planning horaire optimisé pour la journée, en tenant compte de vos priorités et catégories.
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
          {[1,2,3,4].map(i => <div key={i} className="h-10 rounded-lg bg-gray-100 dark:bg-gray-700" />)}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400 italic border-l-2 border-violet-300 pl-2">{result.dayTheme}</p>
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {totalHours > 0 ? `${totalHours}h${totalMins > 0 ? totalMins : ""}` : `${totalMins}min`}
            </span>
          </div>
          <div className="space-y-1.5">
            {result.plan.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span className="text-[10px] font-mono font-bold text-gray-400 mt-0.5 w-10 shrink-0">{item.time}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{item.title}</span>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${getCategoryStyle(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">{item.duration} min</span>
                    {item.tip && <span className="text-[10px] text-gray-400 truncate">· {item.tip}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!result && !loading && !error && (
        <div className="flex-1 flex items-center justify-center py-6">
          <p className="text-xs text-gray-400 text-center">Cliquez sur "Générer" pour obtenir<br />votre planning de la journée</p>
        </div>
      )}
    </Card>
  )
}
