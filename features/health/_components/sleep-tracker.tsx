"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { SleepEntry, SLEEP_QUALITY } from "../types"

interface Props {
  entries: SleepEntry[]
  onAdd: (data: Omit<SleepEntry, "id" | "createdAt">) => void
  onDelete: (id: string) => void
  todayStr: string
}

const SLEEP_GOAL = 8

export function SleepTracker({ entries, onAdd, onDelete, todayStr }: Props) {
  const [form, setForm] = useState({ date: todayStr, hours: 7, quality: 3 as 1 | 2 | 3, note: "" })
  const [open, setOpen] = useState(false)

  const todayEntry = entries.find(e => e.date === todayStr)
  const avgHours = entries.slice(0, 7).length > 0
    ? entries.slice(0, 7).reduce((s, e) => s + e.hours, 0) / entries.slice(0, 7).length
    : 0

  const handleSubmit = () => {
    onAdd(form)
    setOpen(false)
    setForm({ date: todayStr, hours: 7, quality: 3, note: "" })
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Sommeil</h2>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-400 text-xs font-medium hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors"
        >
          <Plus className="h-3 w-3" /> Ajouter
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950">
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-0.5">Ce soir</p>
          <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {todayEntry ? `${todayEntry.hours}h` : "—"}
          </p>
          {todayEntry && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${SLEEP_QUALITY[todayEntry.quality].bg} ${SLEEP_QUALITY[todayEntry.quality].color}`}>
              {SLEEP_QUALITY[todayEntry.quality].label}
            </span>
          )}
        </div>
        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950">
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-0.5">Moy. 7j</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {avgHours > 0 ? `${avgHours.toFixed(1)}h` : "—"}
          </p>
          <p className="text-[10px] text-purple-500 dark:text-purple-400">objectif {SLEEP_GOAL}h</p>
        </div>
      </div>

      {/* Add form */}
      {open && (
        <div className="space-y-3 mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full h-8 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-xs text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-violet-400" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Heures</label>
              <input type="number" min="1" max="14" step="0.5" value={form.hours} onChange={e => setForm({ ...form, hours: parseFloat(e.target.value) || 0 })}
                className="w-full h-8 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-xs text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-violet-400" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Qualité</label>
            <div className="grid grid-cols-3 gap-1.5">
              {([3, 2, 1] as const).map(q => (
                <button key={q} type="button" onClick={() => setForm({ ...form, quality: q })}
                  className={`py-1.5 rounded-md text-[11px] font-medium border transition-all ${form.quality === q ? `${SLEEP_QUALITY[q].bg} ${SLEEP_QUALITY[q].color} border-current` : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"}`}>
                  {SLEEP_QUALITY[q].label}
                </button>
              ))}
            </div>
          </div>

          <textarea placeholder="Note..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
            className="w-full h-12 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none outline-none focus:ring-1 focus:ring-violet-400" />

          <button onClick={handleSubmit}
            className="w-full h-8 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-colors">
            Enregistrer
          </button>
        </div>
      )}

      {/* History */}
      <div className="space-y-1.5">
        {entries.slice(0, 5).map(entry => {
          const q = SLEEP_QUALITY[entry.quality]
          const pct = Math.min((entry.hours / SLEEP_GOAL) * 100, 100)
          return (
            <div key={entry.id} className="flex items-center gap-3 group">
              <div className="w-16 shrink-0">
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  {new Date(entry.date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" })}
                </p>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{entry.hours}h</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${q.bg} ${q.color}`}>{q.label}</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct >= 87 ? "bg-emerald-400" : pct >= 62 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
              <button onClick={() => onDelete(entry.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded text-gray-300 hover:text-red-500 transition-all">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
