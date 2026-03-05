export type TaskCategory = "travail" | "personnel" | "santé"
export type TaskStatus = "en cours" | "terminé"

export interface Task {
  id: string
  title: string
  description: string
  category: TaskCategory
  status: TaskStatus
  dueDate: string // ISO date string YYYY-MM-DD
  createdAt: string
}

export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; color: string; bg: string; border: string }> = {
  travail: {
    label: "Travail",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  personnel: {
    label: "Personnel",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  santé: {
    label: "Santé",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
}

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  "en cours": {
    label: "En cours",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  terminé: {
    label: "Terminé",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
}
