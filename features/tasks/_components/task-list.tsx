"use client"

import { ClipboardList } from "lucide-react"
import { Task } from "../types"
import { TaskCard } from "./task-card"
import { useI18n } from "@/contexts/i18n-context"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

export function TaskList({ tasks, onEdit, onDelete, onToggle }: TaskListProps) {
  const { locale } = useI18n()
  const labels = {
    en: { empty: "No tasks found", create: "Create your first task", inProgress: "In progress", done: "Done" },
    fr: { empty: "Aucune tâche trouvée", create: "Créez votre première tâche", inProgress: "En cours", done: "Terminées" },
    mg: { empty: "Tsy misy asa", create: "Mamorona asa voalohany", inProgress: "Am-piasana", done: "Vita" },
  }
  const l = labels[locale]

  const enCours = tasks.filter((t) => t.status === "en cours")
  const terminées = tasks.filter((t) => t.status === "terminé")

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-full bg-violet-50 dark:bg-violet-950 flex items-center justify-center mb-4">
          <ClipboardList className="h-7 w-7 text-violet-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">{l.empty}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{l.create}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {enCours.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
            {l.inProgress} ({enCours.length})
          </h3>
          <div className="space-y-2">
            {enCours.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
            ))}
          </div>
        </div>
      )}
      {terminées.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
            {l.done} ({terminées.length})
          </h3>
          <div className="space-y-2">
            {terminées.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
