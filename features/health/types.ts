export type MoodLevel = 1 | 2 | 3 | 4 | 5

export interface MoodEntry {
  id: string
  date: string // YYYY-MM-DD
  mood: MoodLevel
  note: string
  createdAt: string
}

export interface WaterEntry {
  date: string // YYYY-MM-DD
  glasses: number // target: 8
}

export interface SleepEntry {
  id: string
  date: string // YYYY-MM-DD
  hours: number
  quality: 1 | 2 | 3 // 1=bad 2=ok 3=good
  note: string
  createdAt: string
}

export interface ExerciseEntry {
  id: string
  date: string
  type: ExerciseType
  duration: number // minutes
  note: string
  createdAt: string
}

export type ExerciseType = "course" | "vélo" | "natation" | "musculation" | "yoga" | "marche" | "autre"

export const MOOD_CONFIG: Record<MoodLevel, { emoji: string; label: string; color: string; bg: string; chart: string }> = {
  5: { emoji: "😄", label: "Excellent",  color: "text-emerald-700", bg: "bg-emerald-50",  chart: "#10b981" },
  4: { emoji: "🙂", label: "Bien",       color: "text-blue-700",    bg: "bg-blue-50",     chart: "#3b82f6" },
  3: { emoji: "😐", label: "Neutre",     color: "text-amber-700",   bg: "bg-amber-50",    chart: "#f59e0b" },
  2: { emoji: "😔", label: "Pas bien",   color: "text-orange-700",  bg: "bg-orange-50",   chart: "#f97316" },
  1: { emoji: "😫", label: "Terrible",   color: "text-red-700",     bg: "bg-red-50",      chart: "#ef4444" },
}

export const SLEEP_QUALITY: Record<number, { label: string; color: string; bg: string }> = {
  3: { label: "Bonne",    color: "text-emerald-700", bg: "bg-emerald-50" },
  2: { label: "Moyenne",  color: "text-amber-700",   bg: "bg-amber-50"   },
  1: { label: "Mauvaise", color: "text-red-700",     bg: "bg-red-50"     },
}

export const EXERCISE_CONFIG: Record<ExerciseType, { label: string; emoji: string; color: string; bg: string }> = {
  course:      { label: "Course",      emoji: "🏃", color: "text-orange-700", bg: "bg-orange-50"  },
  vélo:        { label: "Vélo",        emoji: "🚴", color: "text-blue-700",   bg: "bg-blue-50"    },
  natation:    { label: "Natation",    emoji: "🏊", color: "text-cyan-700",   bg: "bg-cyan-50"    },
  musculation: { label: "Musculation", emoji: "🏋️", color: "text-violet-700", bg: "bg-violet-50"  },
  yoga:        { label: "Yoga",        emoji: "🧘", color: "text-pink-700",   bg: "bg-pink-50"    },
  marche:      { label: "Marche",      emoji: "🚶", color: "text-emerald-700",bg: "bg-emerald-50" },
  autre:       { label: "Autre",       emoji: "⚡", color: "text-gray-700",   bg: "bg-gray-50"    },
}

export const WATER_GOAL = 8
