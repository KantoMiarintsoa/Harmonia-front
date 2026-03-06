"use client"

import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { MoodEntry, MoodLevel, MOOD_CONFIG } from "../types"

interface Props {
  moods: MoodEntry[]
  onAdd: (mood: MoodLevel, note: string, date?: string) => void
  onDelete: (id: string) => void
  todayStr: string
}

export function MoodTracker({ moods, onAdd, onDelete, todayStr }: Props) {
  const [selected, setSelected] = useState<MoodLevel | null>(null)
  const [note, setNote] = useState("")
  const [date, setDate] = useState(todayStr)
  const [showAll, setShowAll] = useState(false)

  const todayMood = moods.find(m => m.date === todayStr)
  const displayMoods = showAll ? moods : moods.slice(0, 5)

  const handleSubmit = () => {
    if (!selected) return
    onAdd(selected, note, date)
    setSelected(null)
    setNote("")
    setDate(todayStr)
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Humeur du jour</h2>
        {todayMood && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${MOOD_CONFIG[todayMood.mood].bg} ${MOOD_CONFIG[todayMood.mood].color}`}>
            {MOOD_CONFIG[todayMood.mood].emoji} {MOOD_CONFIG[todayMood.mood].label}
          </span>
        )}
      </div>

      {/* Mood selector */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {([5, 4, 3, 2, 1] as MoodLevel[]).map((level) => {
          const cfg = MOOD_CONFIG[level]
          const isSelected = selected === level
          return (
            <button
              key={level}
              onClick={() => setSelected(isSelected ? null : level)}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all
                ${isSelected ? `${cfg.bg} ${cfg.color} border-current scale-105 shadow-sm` : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"}
              `}
            >
              <span className="text-2xl">{cfg.emoji}</span>
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 text-center leading-tight">{cfg.label}</span>
            </button>
          )
        })}
      </div>

      {/* Note + date + submit */}
      {selected && (
        <div className="space-y-3 mb-4 animate-in fade-in duration-200">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-violet-400"
          />
          <textarea
            placeholder="Ajouter une note (optionnel)..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full h-16 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none outline-none focus:ring-2 focus:ring-violet-400"
          />
          <button
            onClick={handleSubmit}
            className="w-full h-9 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Enregistrer l'humeur
          </button>
        </div>
      )}

      {/* History */}
      {moods.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Historique</p>
          {displayMoods.map(entry => {
            const cfg = MOOD_CONFIG[entry.mood]
            return (
              <div key={entry.id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg">{cfg.emoji}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {new Date(entry.date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                      </span>
                    </div>
                    {entry.note && <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{entry.note}</p>}
                  </div>
                </div>
                <button onClick={() => onDelete(entry.id)} className="shrink-0 h-6 w-6 flex items-center justify-center rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )
          })}
          {moods.length > 5 && (
            <button onClick={() => setShowAll(!showAll)} className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-gray-400 hover:text-violet-600 transition-colors">
              {showAll ? <><ChevronUp className="h-3 w-3" /> Voir moins</> : <><ChevronDown className="h-3 w-3" /> Voir tout ({moods.length})</>}
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
