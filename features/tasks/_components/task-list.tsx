"use client"

import { ClipboardList } from "lucide-react"
import { Task } from "../types"
import { TaskCard } from "./task-card"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

export function TaskList({ tasks, onEdit, onDelete, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-full bg-violet-50 flex items-center justify-center mb-4">
          <ClipboardList className="h-7 w-7 text-violet-400" />
        </div>
        <p className="text-gray-500 font-medium">Aucune tâche trouvée</p>
        <p className="text-sm text-gray-400 mt-1">Créez votre première tâche</p>
      </div>
    )
  }

  // Group: en cours first, then terminé
  const enCours = tasks.filter((t) => t.status === "en cours")
  const terminées = tasks.filter((t) => t.status === "terminé")

  return (
    <div className="space-y-6">
      {enCours.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            En cours ({enCours.length})
          </h3>
          <div className="space-y-2">
            {enCours.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}

      {terminées.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Terminées ({terminées.length})
          </h3>
          <div className="space-y-2">
            {terminées.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
