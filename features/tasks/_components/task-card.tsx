"use client"

import { Check, Pencil, Trash2, Clock } from "lucide-react"
import { Task, CATEGORY_CONFIG, STATUS_CONFIG } from "../types"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

export function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  const catCfg = CATEGORY_CONFIG[task.category]
  const statusCfg = STATUS_CONFIG[task.status]
  const isDone = task.status === "terminé"

  const today = new Date().toISOString().split("T")[0]
  const isOverdue = task.dueDate < today && !isDone

  return (
    <div
      className={`
        bg-white rounded-xl border p-4 shadow-sm
        transition-all hover:shadow-md
        ${isDone ? "opacity-70" : ""}
        ${isOverdue ? "border-red-200" : "border-gray-100"}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Toggle button */}
        <button
          onClick={() => onToggle(task.id)}
          className={`
            mt-0.5 h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
            ${isDone
              ? "bg-emerald-500 border-emerald-500"
              : "border-gray-300 hover:border-purple-400"
            }
          `}
        >
          {isDone && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-medium text-gray-800 truncate ${isDone ? "line-through text-gray-400" : ""}`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{task.description}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {/* Category */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${catCfg.bg} ${catCfg.color}`}
            >
              {catCfg.label}
            </span>

            {/* Status */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusCfg.bg} ${statusCfg.color}`}
            >
              {statusCfg.label}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  isOverdue ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-500"
                }`}
              >
                <Clock className="h-2.5 w-2.5" />
                {new Date(task.dueDate + "T00:00:00").toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 ml-1">
          <button
            onClick={() => onEdit(task)}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
