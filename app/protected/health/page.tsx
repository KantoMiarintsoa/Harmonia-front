"use client"

import { Heart, Smile, Droplets, Moon, Dumbbell } from "lucide-react"
import { useHealth } from "@/features/health/hooks/use-health"
import { MoodTracker } from "@/features/health/_components/mood-tracker"
import { WaterTracker } from "@/features/health/_components/water-tracker"
import { SleepTracker } from "@/features/health/_components/sleep-tracker"
import { ExerciseTracker } from "@/features/health/_components/exercise-tracker"
import { MOOD_CONFIG, WATER_GOAL } from "@/features/health/types"

export default function HealthPage() {
  const {
    moods, sleep, exercise,
    addMood, deleteMood,
    setWaterGlasses, todayWater,
    addSleep, deleteSleep,
    addExercise, deleteExercise,
    avgMood, avgSleep, totalExerciseThisWeek,
    todayStr,
  } = useHealth()

  const cardClass = "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"

  const todayMood = moods.find(m => m.date === todayStr)
  const todaySleep = sleep.find(s => s.date === todayStr)

  const kpis = [
    {
      icon: <Smile className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
      bg: "bg-amber-50 dark:bg-amber-950",
      label: "Humeur aujourd'hui",
      value: todayMood ? `${MOOD_CONFIG[todayMood.mood].emoji} ${MOOD_CONFIG[todayMood.mood].label}` : "—",
      sub: `Moy. 7j: ${avgMood > 0 ? avgMood.toFixed(1) : "—"} / 5`,
    },
    {
      icon: <Droplets className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950",
      label: "Hydratation",
      value: `${todayWater} / ${WATER_GOAL} verres`,
      sub: todayWater >= WATER_GOAL ? "Objectif atteint !" : `${WATER_GOAL - todayWater} verres restants`,
    },
    {
      icon: <Moon className="h-5 w-5 text-violet-500 dark:text-violet-400" />,
      bg: "bg-violet-50 dark:bg-violet-950",
      label: "Sommeil cette nuit",
      value: todaySleep ? `${todaySleep.hours}h` : "—",
      sub: `Moy. 7j: ${avgSleep > 0 ? avgSleep.toFixed(1) + "h" : "—"}`,
    },
    {
      icon: <Dumbbell className="h-5 w-5 text-orange-500 dark:text-orange-400" />,
      bg: "bg-orange-50 dark:bg-orange-950",
      label: "Activité cette semaine",
      value: `${totalExerciseThisWeek} min`,
      sub: `${Math.round(Math.min((totalExerciseThisWeek / 150) * 100, 100))}% de l'objectif OMS`,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-pink-50 dark:bg-pink-950 flex items-center justify-center">
          <Heart className="h-5 w-5 text-pink-500 dark:text-pink-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Santé & Bien-être</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Suivez vos habitudes de santé au quotidien</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`${cardClass} p-4 flex items-center gap-3`}>
            <div className={`h-10 w-10 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
              {kpi.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{kpi.label}</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{kpi.value}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-2 gap-6">
        <MoodTracker
          moods={moods}
          onAdd={addMood}
          onDelete={deleteMood}
          todayStr={todayStr}
        />
        <WaterTracker
          glasses={todayWater}
          onSet={setWaterGlasses}
        />
        <SleepTracker
          entries={sleep}
          onAdd={addSleep}
          onDelete={deleteSleep}
          todayStr={todayStr}
        />
        <ExerciseTracker
          entries={exercise}
          onAdd={addExercise}
          onDelete={deleteExercise}
          todayStr={todayStr}
          totalMinutesThisWeek={totalExerciseThisWeek}
        />
      </div>
    </div>
  )
}
