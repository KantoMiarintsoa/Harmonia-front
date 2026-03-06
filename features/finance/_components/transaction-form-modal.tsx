"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Transaction, TransactionType, TransactionCategory,
  INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_CONFIG,
} from "../types"

interface Props {
  open: boolean
  transaction?: Transaction | null
  onClose: () => void
  onAdd: (data: Omit<Transaction, "id" | "createdAt">) => void
  onUpdate: (id: string, data: Omit<Transaction, "id" | "createdAt">) => void
}

const EMPTY: Omit<Transaction, "id" | "createdAt"> = {
  type: "dépense",
  amount: 0,
  category: "alimentation",
  description: "",
  date: new Date().toISOString().split("T")[0],
}

export function TransactionFormModal({ open, transaction, onClose, onAdd, onUpdate }: Props) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (transaction) {
      setForm({ type: transaction.type, amount: transaction.amount, category: transaction.category, description: transaction.description, date: transaction.date })
    } else {
      setForm(EMPTY)
    }
  }, [transaction, open])

  if (!open) return null

  const categories = form.type === "revenu" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleTypeChange = (type: TransactionType) => {
    const defaultCat = type === "revenu" ? "salaire" : "alimentation"
    setForm({ ...form, type, category: defaultCat })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.amount || !form.description.trim()) return
    if (transaction) { onUpdate(transaction.id, form) } else { onAdd(form) }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/60 via-purple-500/60 to-pink-500/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[440px] max-w-[95vw] p-8 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-purple-600 font-semibold tracking-wide text-sm">HARMONIA</h2>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
            {transaction ? "Modifier la transaction" : "Nouvelle transaction"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Remplissez les informations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {(["revenu", "dépense"] as TransactionType[]).map((t) => (
              <button
                key={t} type="button" onClick={() => handleTypeChange(t)}
                className={`py-2 rounded-md text-sm font-medium transition-all capitalize ${
                  form.type === t
                    ? t === "revenu"
                      ? "bg-white dark:bg-gray-700 text-emerald-600 shadow-sm"
                      : "bg-white dark:bg-gray-700 text-red-500 shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t === "revenu" ? "💰 Revenu" : "💸 Dépense"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Montant (€) *</label>
            <Input
              type="number" min="0" step="0.01" placeholder="0.00"
              className="h-11" value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">Catégorie</label>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((cat) => {
                const cfg = CATEGORY_CONFIG[cat]
                const selected = form.category === cat
                return (
                  <button
                    key={cat} type="button" onClick={() => setForm({ ...form, category: cat as TransactionCategory })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-left transition-all ${
                      selected ? `${cfg.bg} ${cfg.color} border-current` : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Description *</label>
            <Input
              placeholder="Ex: Loyer, Courses..." className="h-11"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Date</label>
            <Input type="date" className="h-11" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>

          <button type="submit" className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors mt-2">
            {transaction ? "Enregistrer" : "Ajouter la transaction"}
          </button>
        </form>
      </div>
    </div>
  )
}
