"use client"

import { useState } from "react"
import { Plus, Trash2, Flame } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ExerciseEntry, ExerciseType, EXERCISE_CONFIG } from "../types"

interface Props {
  entries: ExerciseEntry[]
  onAdd: (data: Omit<ExerciseEntry, "id" | "createdAt">) => void
  onDelete: (id: string) => void
  todayStr: string
  totalMinutesThisWeek: number
}

export function ExerciseTracker({ entries, onAdd, onDelete, todayStr, totalMinutesThisWeek }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ date: todayStr, type: "course" as ExerciseType, duration: 30, note: "" })

  const WEEKLY_GOAL = 150 // WHO recommendation minutes/week
  const weekPct = Math.min((totalMinutesThisWeek / WEEKLY_GOAL) * 100, 100)

  const handleSubmit = () => {
    onAdd(form)
    setOpen(false)
    setForm({ date: todayStr, type: "course", duration: 30, note: "" })
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Activité physique</h2>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 text-xs font-medium hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
        >
          <Plus className="h-3 w-3" /> Ajouter
        </button>
      </div>

      {/* Weekly progress */}
      <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">Cette semaine</span>
          </div>
          <span className="text-xs font-bold text-orange-700 dark:text-orange-300">
            {totalMinutesThisWeek} / {WEEKLY_GOAL} min
          </span>
        </div>
        <div className="h-2 bg-orange-100 dark:bg-orange-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full transition-all duration-500"
            style={{ width: `${weekPct}%` }} />
        </div>
        {totalMinutesThisWeek >= WEEKLY_GOAL && (
          <p className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold mt-1">🎉 Objectif OMS atteint !</p>
        )}
      </div>

      {/* Add form */}
      {open && (
        <div className="space-y-3 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
          {/* Exercise type */}
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Type d'activité</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(EXERCISE_CONFIG) as ExerciseType[]).map(type => {
                const cfg = EXERCISE_CONFIG[type]
                return (
                  <button key={type} type="button" onClick={() => setForm({ ...form, type })}
                    className={`py-2 rounded-lg text-xs font-medium border flex flex-col items-center gap-0.5 transition-all ${form.type === type ? `${cfg.bg} ${cfg.color} border-current` : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"}`}>
                    <span>{cfg.emoji}</span>
                    <span className="text-[9px] leading-tight text-center">{cfg.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Durée (min)</label>
              <input type="number" min="5" max="300" value={form.duration} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
                className="w-full h-8 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-xs text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-violet-400" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full h-8 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-xs text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-violet-400" />
            </div>
          </div>

          <input placeholder="Note..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
            className="w-full h-8 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-xs text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-violet-400" />

          <button onClick={handleSubmit}
            className="w-full h-8 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-colors">
            Enregistrer
          </button>
        </div>
      )}

      {/* History */}
      <div className="space-y-2">
        {entries.slice(0, 5).map(entry => {
          const cfg = EXERCISE_CONFIG[entry.type]
          return (
            <div key={entry.id} className="flex items-center gap-3 group py-1.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
              <div className={`h-8 w-8 rounded-lg ${cfg.bg} flex items-center justify-center text-base shrink-0`}>
                {cfg.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{entry.duration} min</span>
                </div>
                <div className="flex items-center justify-between">
                  {entry.note
                    ? <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{entry.note}</p>
                    : <span />
                  }
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                    {new Date(entry.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
              <button onClick={() => onDelete(entry.id)}
                className="opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded text-gray-300 hover:text-red-500 transition-all shrink-0">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )
        })}
        {entries.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">Aucune activité enregistrée</p>
        )}
      </div>
    </Card>
  )
}
