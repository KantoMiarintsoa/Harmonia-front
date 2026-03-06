"use client"

import { Sparkles, ListOrdered, CalendarClock, TrendingUp, HeartPulse, Loader2, AlertCircle, RefreshCw, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAi } from "@/features/ai/hooks/use-ai"
import { TaskPrioritizer } from "@/features/ai/_components/task-prioritizer"
import { DailyPlanner } from "@/features/ai/_components/daily-planner"
import { ProductivityCoach } from "@/features/ai/_components/productivity-coach"
import { BurnoutDetector } from "@/features/ai/_components/burnout-detector"

export default function AiPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">IA & Prédictions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Analyses intelligentes basées sur vos données personnelles</p>
        </div>
      </div>

      {/* API key notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Ces fonctionnalités utilisent l'API Claude (Anthropic). Ajoutez votre clé <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">ANTHROPIC_API_KEY</code> dans le fichier <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">.env.local</code> pour les activer.
        </p>
      </div>

      {/* 2x2 grid */}
      <div className="grid grid-cols-2 gap-6">
        <TaskPrioritizer />
        <DailyPlanner />
        <ProductivityCoach />
        <BurnoutDetector />
      </div>
    </div>
  )
}
