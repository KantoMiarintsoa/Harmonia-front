"use client"

import Link from "next/link"
import { CheckSquare, Clock, CheckCheck, Briefcase, User, Heart, ArrowRight, Plus } from "lucide-react"
import { useTasks } from "@/features/tasks/hooks/use-tasks"
import { TaskCard } from "@/features/tasks/_components/task-card"
import { TaskFormModal } from "@/features/tasks/_components/task-form-modal"
import { Task } from "@/features/tasks/types"
import { useState } from "react"

export default function DashboardPage() {
  const { tasks, stats, createTask, updateTask, deleteTask, toggleStatus } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const recentTasks = tasks
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const todayStr = new Date().toISOString().split("T")[0]
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr)

  const handleEdit = (task: Task) => { setEditingTask(task); setModalOpen(true) }
  const handleDelete = (id: string) => { if (confirm("Supprimer cette tâche ?")) deleteTask(id) }
  const handleModalClose = () => { setModalOpen(false); setEditingTask(null) }

  const STAT_CARDS = [
    { label: "Total",     value: stats.total,   icon: CheckSquare, iconBg: "bg-violet-50 dark:bg-violet-950", iconColor: "text-violet-600 dark:text-violet-400" },
    { label: "En cours",  value: stats.enCours, icon: Clock,       iconBg: "bg-amber-50 dark:bg-amber-950",   iconColor: "text-amber-600 dark:text-amber-400"   },
    { label: "Terminées", value: stats.terminé, icon: CheckCheck,  iconBg: "bg-emerald-50 dark:bg-emerald-950", iconColor: "text-emerald-600 dark:text-emerald-400" },
  ]

  const CAT_CARDS = [
    { label: "Travail",    value: stats.travail,    icon: Briefcase, iconBg: "bg-blue-50 dark:bg-blue-950",     iconColor: "text-blue-600 dark:text-blue-400"    },
    { label: "Personnel",  value: stats.personnel,  icon: User,      iconBg: "bg-violet-50 dark:bg-violet-950", iconColor: "text-violet-600 dark:text-violet-400" },
    { label: "Santé",      value: stats.santé,      icon: Heart,     iconBg: "bg-emerald-50 dark:bg-emerald-950", iconColor: "text-emerald-600 dark:text-emerald-400" },
  ]

  const cardClass = "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Bonjour 👋</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Voici un aperçu de vos tâches</p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 h-10 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouvelle tâche
        </button>
      </div>

      {/* Status stats */}
      <div className="grid grid-cols-3 gap-4">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className={`${cardClass} p-5 flex items-center gap-4`}>
            <div className={`h-11 w-11 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
              <s.icon className={`h-5 w-5 ${s.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category stats */}
      <div className="grid grid-cols-3 gap-4">
        {CAT_CARDS.map((c) => (
          <div key={c.label} className={`${cardClass} p-4 flex items-center gap-3`}>
            <div className={`h-9 w-9 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0`}>
              <c.icon className={`h-4 w-4 ${c.iconColor}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{c.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today + Recent */}
      <div className="grid grid-cols-2 gap-6">

        {/* Today */}
        <div className={`${cardClass} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Tâches du jour</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>
          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 dark:text-gray-500">Aucune tâche aujourd'hui</p>
              <button onClick={() => { setEditingTask(null); setModalOpen(true) }} className="text-xs text-purple-600 hover:underline mt-1">
                Ajouter une tâche
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} onToggle={toggleStatus} />
              ))}
            </div>
          )}
        </div>

        {/* Recent */}
        <div className={`${cardClass} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Tâches récentes</h2>
            <Link href="/protected/tasks" className="flex items-center gap-1 text-xs text-purple-600 hover:underline">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 dark:text-gray-500">Aucune tâche créée</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} onToggle={toggleStatus} />
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskFormModal open={modalOpen} task={editingTask} onClose={handleModalClose} onCreate={createTask} onUpdate={updateTask} />
    </div>
  )
}
