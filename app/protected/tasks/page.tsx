"use client"

import { useState } from "react"
import { Plus, List, CalendarDays } from "lucide-react"
import { useTasks } from "@/features/tasks/hooks/use-tasks"
import { TaskFormModal } from "@/features/tasks/_components/task-form-modal"
import { TaskList } from "@/features/tasks/_components/task-list"
import { TaskCalendar } from "@/features/tasks/_components/task-calendar"
import { Task, TaskCategory, CATEGORY_CONFIG } from "@/features/tasks/types"

type FilterCategory = TaskCategory | "toutes"
type View = "liste" | "calendrier"

const FILTERS: { value: FilterCategory; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  { value: "travail", label: "Travail" },
  { value: "personnel", label: "Personnel" },
  { value: "santé", label: "Santé" },
]

export default function TasksPage() {
  const { tasks, createTask, updateTask, deleteTask, toggleStatus, filterByCategory } = useTasks()

  const [view, setView] = useState<View>("liste")
  const [filter, setFilter] = useState<FilterCategory>("toutes")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filteredTasks = filterByCategory(filter)

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Supprimer cette tâche ?")) deleteTask(id)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Mes tâches</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tasks.length} tâche{tasks.length > 1 ? "s" : ""} au total</p>
        </div>

        <button
          onClick={() => { setEditingTask(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 h-10 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouvelle tâche
        </button>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between mb-5 gap-4">

        {/* Category filters */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-md transition-all
                ${filter === f.value
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView("liste")}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all
              ${view === "liste" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}
            `}
          >
            <List className="h-3.5 w-3.5" />
            Liste
          </button>
          <button
            onClick={() => setView("calendrier")}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all
              ${view === "calendrier" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}
            `}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Calendrier
          </button>
        </div>
      </div>

      {/* Content */}
      {view === "liste" ? (
        <TaskList
          tasks={filteredTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={toggleStatus}
        />
      ) : (
        <TaskCalendar
          tasks={filteredTasks}
          onEdit={handleEdit}
          onToggle={toggleStatus}
        />
      )}

      {/* Modal */}
      <TaskFormModal
        open={modalOpen}
        task={editingTask}
        onClose={handleModalClose}
        onCreate={createTask}
        onUpdate={updateTask}
      />
    </div>
  )
}
