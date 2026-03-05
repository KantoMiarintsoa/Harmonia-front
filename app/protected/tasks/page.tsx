"use client"

import { useState } from "react"
import { Plus, List, CalendarDays } from "lucide-react"
import { useTasks } from "@/features/tasks/hooks/use-tasks"
import { TaskFormModal } from "@/features/tasks/_components/task-form-modal"
import { TaskList } from "@/features/tasks/_components/task-list"
import { TaskCalendar } from "@/features/tasks/_components/task-calendar"
import { Task, TaskCategory } from "@/features/tasks/types"
import { useI18n } from "@/contexts/i18n-context"

type FilterCategory = TaskCategory | "toutes"
type View = "liste" | "calendrier"

export default function TasksPage() {
  const { tasks, createTask, updateTask, deleteTask, toggleStatus, filterByCategory } = useTasks()
  const { locale } = useI18n()

  const [view, setView] = useState<View>("liste")
  const [filter, setFilter] = useState<FilterCategory>("toutes")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filteredTasks = filterByCategory(filter)

  const labels = {
    en: { title: "My tasks", count: (n: number) => `${n} task${n > 1 ? "s" : ""} total`, new: "New task", all: "All", list: "List", calendar: "Calendar", delete: "Delete this task?" },
    fr: { title: "Mes tâches", count: (n: number) => `${n} tâche${n > 1 ? "s" : ""} au total`, new: "Nouvelle tâche", all: "Toutes", list: "Liste", calendar: "Calendrier", delete: "Supprimer cette tâche ?" },
    mg: { title: "Asako", count: (n: number) => `${n} asa`, new: "Asa vaovao", all: "Rehetra", list: "Lisitra", calendar: "Kalenda", delete: "Hamafa ity asa ity?" },
  }
  const l = labels[locale]

  const FILTERS = [
    { value: "toutes" as FilterCategory, label: l.all },
    { value: "travail" as FilterCategory, label: locale === "en" ? "Work" : locale === "mg" ? "Asa" : "Travail" },
    { value: "personnel" as FilterCategory, label: locale === "en" ? "Personal" : locale === "mg" ? "Manokana" : "Personnel" },
    { value: "santé" as FilterCategory, label: locale === "en" ? "Health" : locale === "mg" ? "Fahasalamana" : "Santé" },
  ]

  const handleEdit = (task: Task) => { setEditingTask(task); setModalOpen(true) }
  const handleDelete = (id: string) => { if (confirm(l.delete)) deleteTask(id) }
  const handleModalClose = () => { setModalOpen(false); setEditingTask(null) }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{l.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{l.count(tasks.length)}</p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 h-10 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          {l.new}
        </button>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between mb-5 gap-4">
        {/* Category filters */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {FILTERS.map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filter === f.value
                  ? "bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {([
            { value: "liste" as View, icon: List, label: l.list },
            { value: "calendrier" as View, icon: CalendarDays, label: l.calendar },
          ]).map(({ value, icon: Icon, label }) => (
            <button key={value} onClick={() => setView(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                view === value
                  ? "bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "liste"
        ? <TaskList tasks={filteredTasks} onEdit={handleEdit} onDelete={handleDelete} onToggle={toggleStatus} />
        : <TaskCalendar tasks={filteredTasks} onEdit={handleEdit} onToggle={toggleStatus} />
      }

      <TaskFormModal open={modalOpen} task={editingTask} onClose={handleModalClose} onCreate={createTask} onUpdate={updateTask} />
    </div>
  )
}
