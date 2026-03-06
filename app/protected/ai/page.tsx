"use client"

import { Sparkles, Info } from "lucide-react"
import { TaskPrioritizer } from "@/features/ai/_components/task-prioritizer"
import { DailyPlanner } from "@/features/ai/_components/daily-planner"
import { ProductivityCoach } from "@/features/ai/_components/productivity-coach"
import { BurnoutDetector } from "@/features/ai/_components/burnout-detector"
import { useI18n } from "@/contexts/i18n-context"

const LABELS = {
  en: {
    title: "AI & Predictions", subtitle: "Intelligent analyses based on your personal data",
    noticePre: "These features use the Claude API (Anthropic). Add your",
    noticeMid: "key in the",
    noticePost: "file to activate them.",
  },
  fr: {
    title: "IA & Prédictions", subtitle: "Analyses intelligentes basées sur vos données personnelles",
    noticePre: "Ces fonctionnalités utilisent l'API Claude (Anthropic). Ajoutez votre clé",
    noticeMid: "dans le fichier",
    noticePost: "pour les activer.",
  },
  mg: {
    title: "IA & Fitsapana", subtitle: "Famakafakana hendry miorina amin'ny angonao manokana",
    noticePre: "Ireo endri-javatra ireo dia mampiasa ny Claude API. Ampidiro ny fanalahidim-panazavana",
    noticeMid: "ao amin'ny rakitra",
    noticePost: "mba hampiasa azy.",
  },
}

export default function AiPage() {
  const { locale } = useI18n()
  const l = LABELS[locale]

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{l.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{l.subtitle}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700 dark:text-amber-300">
          {l.noticePre}{" "}
          <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">ANTHROPIC_API_KEY</code>{" "}
          {l.noticeMid}{" "}
          <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">.env.local</code>{" "}
          {l.noticePost}
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
