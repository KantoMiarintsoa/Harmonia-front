"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Task, TaskCategory, TaskStatus, CATEGORY_CONFIG } from "../types"
import { useI18n } from "@/contexts/i18n-context"

interface TaskFormModalProps {
  open: boolean
  task?: Task | null
  defaultDate?: string
  onClose: () => void
  onCreate: (data: Omit<Task, "id" | "createdAt">) => void
  onUpdate: (id: string, data: Partial<Omit<Task, "id" | "createdAt">>) => void
}

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "travail" as TaskCategory,
  status: "en cours" as TaskStatus,
  dueDate: new Date().toISOString().split("T")[0],
}

export function TaskFormModal({ open, task, defaultDate, onClose, onCreate, onUpdate }: TaskFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const { locale } = useI18n()

  const labels = {
    en: { title: "Title *", desc: "Description", category: "Category", status: "Status", date: "Due date", create: "Create task", save: "Save changes", newTask: "New task", editTask: "Edit task", fillInfo: "Fill in the information", updateInfo: "Update the information" },
    fr: { title: "Titre *", desc: "Description", category: "Catégorie", status: "Statut", date: "Date d'échéance", create: "Créer la tâche", save: "Enregistrer", newTask: "Nouvelle tâche", editTask: "Modifier la tâche", fillInfo: "Remplissez les informations", updateInfo: "Mettez à jour les informations" },
    mg: { title: "Lohateny *", desc: "Famaritana", category: "Sokajy", status: "Toe-javatra", date: "Daty", create: "Hamorona asa", save: "Tahiry", newTask: "Asa vaovao", editTask: "Hanova asa", fillInfo: "Fenoy ny fampahalalana", updateInfo: "Havao ny fampahalalana" },
  }
  const l = labels[locale]

  useEffect(() => {
    if (task) {
      setForm({ title: task.title, description: task.description, category: task.category, status: task.status, dueDate: task.dueDate })
    } else {
      setForm({ ...EMPTY_FORM, dueDate: defaultDate ?? EMPTY_FORM.dueDate })
    }
  }, [task, open, defaultDate])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (task) { onUpdate(task.id, form) } else { onCreate(form) }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/60 via-purple-500/60 to-pink-500/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[420px] max-w-[95vw] p-8 z-10">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-purple-600 font-semibold tracking-wide text-sm">HARMONIA</h2>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{task ? l.editTask : l.newTask}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task ? l.updateInfo : l.fillInfo}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">{l.title}</label>
            <Input placeholder={l.title} className="h-11" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">{l.desc}</label>
            <textarea
              placeholder={l.desc}
              className="w-full rounded-md border border-input bg-transparent dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm shadow-sm resize-none h-20 focus:outline-none focus:ring-1 focus:ring-purple-400"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">{l.category}</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map((cat) => {
                const cfg = CATEGORY_CONFIG[cat]
                const selected = form.category === cat
                return (
                  <button key={cat} type="button" onClick={() => setForm({ ...form, category: cat })}
                    className={`py-2 rounded-lg text-xs font-medium border transition-all ${selected ? `${cfg.bg} ${cfg.color} ${cfg.border} ring-2 ring-offset-1 ${cfg.border}` : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">{l.status}</label>
            <div className="grid grid-cols-2 gap-2">
              {(["en cours", "terminé"] as TaskStatus[]).map((s) => (
                <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                  className={`py-2 rounded-lg text-xs font-medium border transition-all capitalize ${
                    form.status === s
                      ? s === "terminé" ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-2 ring-offset-1 ring-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200 ring-2 ring-offset-1 ring-amber-200"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">{l.date}</label>
            <Input type="date" className="h-11" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>

          <button type="submit" className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors mt-2">
            {task ? l.save : l.create}
          </button>
        </form>
      </div>
    </div>
  )
}
