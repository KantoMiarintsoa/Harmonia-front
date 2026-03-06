"use client"

import Link from "next/link"
import { CheckSquare, Clock, CheckCheck, Briefcase, User, Heart, ArrowRight, Plus } from "lucide-react"
import { useTasks } from "@/features/tasks/hooks/use-tasks"
import { TaskCard } from "@/features/tasks/_components/task-card"
import { TaskFormModal } from "@/features/tasks/_components/task-form-modal"
import { Task } from "@/features/tasks/types"
import { useState } from "react"
import { useI18n } from "@/contexts/i18n-context"

const LABELS = {
  en: {
    welcome: "Hello 👋", subtitle: "Here is an overview of your tasks",
    newTask: "New task", today: "Today's tasks", recent: "Recent tasks",
    noToday: "No tasks today", addTask: "Add a task", noRecent: "No tasks created",
    total: "Total", inProgress: "In progress", done: "Done",
    work: "Work", personal: "Personal", health: "Health", seeAll: "See all",
    deleteConfirm: "Delete this task?",
  },
  fr: {
    welcome: "Bonjour 👋", subtitle: "Voici un aperçu de vos tâches",
    newTask: "Nouvelle tâche", today: "Tâches du jour", recent: "Tâches récentes",
    noToday: "Aucune tâche aujourd'hui", addTask: "Ajouter une tâche", noRecent: "Aucune tâche créée",
    total: "Total", inProgress: "En cours", done: "Terminées",
    work: "Travail", personal: "Personnel", health: "Santé", seeAll: "Voir tout",
    deleteConfirm: "Supprimer cette tâche ?",
  },
  mg: {
    welcome: "Manao ahoana 👋", subtitle: "Ny andininy ny asanao",
    newTask: "Asa vaovao", today: "Asa androany", recent: "Asa farany",
    noToday: "Tsy misy asa androany", addTask: "Manampy asa", noRecent: "Tsy misy asa voaforona",
    total: "Rehetra", inProgress: "En cours", done: "Vita",
    work: "Asa", personal: "Manokana", health: "Fahasalamana", seeAll: "Jereo rehetra",
    deleteConfirm: "Hamafa ity asa ity?",
  },
}

export default function DashboardPage() {
  const { tasks, stats, createTask, updateTask, deleteTask, toggleStatus } = useTasks()
  const { locale } = useI18n()
  const l = LABELS[locale]
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const recentTasks = tasks
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const todayStr = new Date().toISOString().split("T")[0]
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr)

  const handleEdit = (task: Task) => { setEditingTask(task); setModalOpen(true) }
  const handleDelete = (id: string) => { if (confirm(l.deleteConfirm)) deleteTask(id) }
  const handleModalClose = () => { setModalOpen(false); setEditingTask(null) }

  const STAT_CARDS = [
    { label: l.total,      value: stats.total,   icon: CheckSquare, iconBg: "bg-violet-50 dark:bg-violet-950", iconColor: "text-violet-600 dark:text-violet-400" },
    { label: l.inProgress, value: stats.enCours, icon: Clock,       iconBg: "bg-amber-50 dark:bg-amber-950",   iconColor: "text-amber-600 dark:text-amber-400"   },
    { label: l.done,       value: stats.terminé, icon: CheckCheck,  iconBg: "bg-emerald-50 dark:bg-emerald-950", iconColor: "text-emerald-600 dark:text-emerald-400" },
  ]

  const CAT_CARDS = [
    { label: l.work,     value: stats.travail,   icon: Briefcase, iconBg: "bg-blue-50 dark:bg-blue-950",     iconColor: "text-blue-600 dark:text-blue-400"    },
    { label: l.personal, value: stats.personnel, icon: User,      iconBg: "bg-violet-50 dark:bg-violet-950", iconColor: "text-violet-600 dark:text-violet-400" },
    { label: l.health,   value: stats.santé,     icon: Heart,     iconBg: "bg-emerald-50 dark:bg-emerald-950", iconColor: "text-emerald-600 dark:text-emerald-400" },
  ]

  const cardClass = "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{l.welcome}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{l.subtitle}</p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 h-10 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          {l.newTask}
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
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{l.today}</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date().toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>
          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 dark:text-gray-500">{l.noToday}</p>
              <button onClick={() => { setEditingTask(null); setModalOpen(true) }} className="text-xs text-purple-600 dark:text-purple-400 hover:underline mt-1">
                {l.addTask}
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
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{l.recent}</h2>
            <Link href="/protected/tasks" className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline">
              {l.seeAll} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 dark:text-gray-500">{l.noRecent}</p>
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
