"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Task, TaskCategory, TaskStatus, CATEGORY_CONFIG } from "../types"

interface TaskFormModalProps {
  open: boolean
  task?: Task | null
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

export function TaskFormModal({ open, task, onClose, onCreate, onUpdate }: TaskFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        category: task.category,
        status: task.status,
        dueDate: task.dueDate,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [task, open])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (task) {
      onUpdate(task.id, form)
    } else {
      onCreate(form)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-400/60 via-purple-500/60 to-pink-500/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-[95vw] p-8 z-10">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-purple-600 font-semibold tracking-wide text-sm">HARMONIA</h2>
          <h1 className="text-xl font-bold text-gray-800 mt-1">
            {task ? "Modifier la tâche" : "Nouvelle tâche"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {task ? "Mettez à jour les informations" : "Remplissez les informations"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Titre *</label>
            <Input
              placeholder="Titre de la tâche"
              className="h-11"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
            <textarea
              placeholder="Description (optionnelle)"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-none h-20 focus:outline-none focus:ring-1 focus:ring-purple-400"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Catégorie</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map((cat) => {
                const cfg = CATEGORY_CONFIG[cat]
                const selected = form.category === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    className={`
                      py-2 rounded-lg text-xs font-medium border transition-all
                      ${selected
                        ? `${cfg.bg} ${cfg.color} ${cfg.border} ring-2 ring-offset-1 ${cfg.border}`
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      }
                    `}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Statut</label>
            <div className="grid grid-cols-2 gap-2">
              {(["en cours", "terminé"] as TaskStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  className={`
                    py-2 rounded-lg text-xs font-medium border transition-all capitalize
                    ${form.status === s
                      ? s === "terminé"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-2 ring-offset-1 ring-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200 ring-2 ring-offset-1 ring-amber-200"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }
                  `}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Date d'échéance</label>
            <Input
              type="date"
              className="h-11"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors mt-2"
          >
            {task ? "Enregistrer les modifications" : "Créer la tâche"}
          </button>
        </form>
      </div>
    </div>
  )
}
