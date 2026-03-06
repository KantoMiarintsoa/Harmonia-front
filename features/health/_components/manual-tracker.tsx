"use client"

import { useState } from "react"
import { Droplets, Moon, Dumbbell, Save, Minus, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useConfirm } from "@/hooks/use-confirm"
import { ExerciseType, EXERCISE_CONFIG, WATER_GOAL } from "../types"

interface Props {
  todayWater: number
  todayStr: string
  onSetWater: (n: number) => void
  onAddSleep: (data: { date: string; hours: number; quality: 1 | 2 | 3; note: string }) => void
  onAddExercise: (data: { date: string; type: ExerciseType; duration: number; note: string }) => void
  onSuccess: (msg: string) => void
}

const SLEEP_QUALITY_OPTS: { value: 1 | 2 | 3; label: string; color: string; bg: string }[] = [
  { value: 1, label: "Mauvaise", color: "text-red-700 dark:text-red-400",          bg: "bg-red-50 dark:bg-red-950"          },
  { value: 2, label: "Moyenne",  color: "text-amber-700 dark:text-amber-400",      bg: "bg-amber-50 dark:bg-amber-950"      },
  { value: 3, label: "Bonne",    color: "text-emerald-700 dark:text-emerald-400",  bg: "bg-emerald-50 dark:bg-emerald-950"  },
]

const EXERCISE_TYPES = Object.keys(EXERCISE_CONFIG) as ExerciseType[]

export function ManualTracker({ todayWater, todayStr, onSetWater, onAddSleep, onAddExercise, onSuccess }: Props) {
  const [water, setWater] = useState(todayWater)
  const [sleep, setSleep] = useState({ hours: 7, quality: 3 as 1 | 2 | 3 })
  const [exercise, setExercise] = useState<{ type: ExerciseType; duration: number }>({ type: "course", duration: 30 })

  const { ask, confirmState, handleConfirm, handleCancel } = useConfirm()

  const handleWaterSave = async () => {
    const ok = await ask({
      title: `Enregistrer ${water} verre${water > 1 ? "s" : ""} d'eau ?`,
      message: `Cela remplacera votre hydratation d'aujourd'hui.`,
      confirmLabel: "Enregistrer",
      variant: "primary",
    })
    if (ok) {
      onSetWater(water)
      onSuccess(`Hydratation mise à jour : ${water} verre${water > 1 ? "s" : ""}`)
    }
  }

  const handleSleepSave = async () => {
    const qualityLabel = SLEEP_QUALITY_OPTS.find(q => q.value === sleep.quality)?.label ?? ""
    const ok = await ask({
      title: `Enregistrer ${sleep.hours}h de sommeil ?`,
      message: `Qualité : ${qualityLabel}. Cela remplacera votre entrée de sommeil d'aujourd'hui.`,
      confirmLabel: "Enregistrer",
      variant: "primary",
    })
    if (ok) {
      onAddSleep({ date: todayStr, hours: sleep.hours, quality: sleep.quality, note: "" })
      onSuccess(`Sommeil enregistré : ${sleep.hours}h`)
    }
  }

  const handleExerciseSave = async () => {
    const cfg = EXERCISE_CONFIG[exercise.type]
    const ok = await ask({
      title: `Enregistrer ${exercise.duration} min de ${cfg.label} ?`,
      message: `${cfg.emoji} Cette activité sera ajoutée à votre historique.`,
      confirmLabel: "Enregistrer",
      variant: "primary",
    })
    if (ok) {
      onAddExercise({ date: todayStr, type: exercise.type, duration: exercise.duration, note: "" })
      onSuccess(`${cfg.emoji} ${cfg.label} enregistré : ${exercise.duration} min`)
    }
  }

  const waterPct = Math.min((water / WATER_GOAL) * 100, 100)

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-7 w-7 rounded-lg bg-violet-50 dark:bg-violet-950 flex items-center justify-center">
            <Save className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Saisie rapide du jour</h2>
          <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full font-medium">
            {new Date(todayStr + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-5">

          {/* ── Water ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Hydratation</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setWater(Math.max(0, water - 1))}
                className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{water}</span>
                <span className="text-xs text-gray-400 ml-1">/ {WATER_GOAL}</span>
              </div>
              <button
                onClick={() => setWater(Math.min(WATER_GOAL + 4, water + 1))}
                className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="h-1.5 bg-blue-100 dark:bg-blue-950 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full transition-all duration-300" style={{ width: `${waterPct}%` }} />
            </div>
            <p className="text-[10px] text-center text-gray-400">
              {water >= WATER_GOAL ? "Objectif atteint !" : `${WATER_GOAL - water} verre(s) restant`}
            </p>

            <button onClick={handleWaterSave}
              className="w-full h-8 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5">
              <Save className="h-3 w-3" /> Enregistrer
            </button>
          </div>

          {/* ── Sleep ── */}
          <div className="space-y-3 border-x border-gray-100 dark:border-gray-700 px-5">
            <div className="flex items-center gap-2 mb-1">
              <Moon className="h-4 w-4 text-violet-500" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Sommeil</span>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Heures</label>
              <div className="flex items-center gap-2">
                <input
                  type="range" min="1" max="12" step="0.5"
                  value={sleep.hours}
                  onChange={e => setSleep({ ...sleep, hours: parseFloat(e.target.value) })}
                  className="flex-1 accent-violet-500"
                />
                <span className="text-sm font-bold text-violet-600 dark:text-violet-400 w-10 text-right">{sleep.hours}h</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Qualité</label>
              <div className="grid grid-cols-3 gap-1">
                {SLEEP_QUALITY_OPTS.map(q => (
                  <button key={q.value} onClick={() => setSleep({ ...sleep, quality: q.value })}
                    className={`py-1.5 rounded-lg text-[10px] font-medium border transition-all ${sleep.quality === q.value ? `${q.bg} ${q.color} border-current` : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700"}`}>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSleepSave}
              className="w-full h-8 bg-violet-500 hover:bg-violet-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5">
              <Save className="h-3 w-3" /> Enregistrer
            </button>
          </div>

          {/* ── Exercise ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Dumbbell className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Activité physique</span>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Type</label>
              <div className="grid grid-cols-4 gap-1">
                {EXERCISE_TYPES.map(type => {
                  const cfg = EXERCISE_CONFIG[type]
                  return (
                    <button key={type} onClick={() => setExercise({ ...exercise, type })}
                      className={`py-1.5 rounded-lg text-[10px] font-medium border flex flex-col items-center gap-0.5 transition-all ${exercise.type === type ? `${cfg.bg} ${cfg.color} border-current` : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700"}`}>
                      <span className="text-sm">{cfg.emoji}</span>
                      <span className="text-[8px] leading-tight">{cfg.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                Durée : <span className="text-orange-500 font-bold">{exercise.duration} min</span>
              </label>
              <input
                type="range" min="5" max="180" step="5"
                value={exercise.duration}
                onChange={e => setExercise({ ...exercise, duration: parseInt(e.target.value) })}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
                <span>5 min</span><span>3h</span>
              </div>
            </div>

            <button onClick={handleExerciseSave}
              className="w-full h-8 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5">
              <Save className="h-3 w-3" /> Enregistrer
            </button>
          </div>

        </div>
      </Card>

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        variant={confirmState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  )
}
