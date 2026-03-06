"use client"

import { useState } from "react"
import { Pencil, Check, X } from "lucide-react"
import { TransactionCategory, CATEGORY_CONFIG } from "../types"

interface SpendingItem {
  category: TransactionCategory
  spent: number
  budget: number
}

interface Props {
  spendingByCategory: SpendingItem[]
  onUpdateBudget: (category: TransactionCategory, limit: number) => void
}

export function BudgetManager({ spendingByCategory, onUpdateBudget }: Props) {
  const [editing, setEditing] = useState<TransactionCategory | null>(null)
  const [editValue, setEditValue] = useState("")

  const startEdit = (cat: TransactionCategory, currentLimit: number) => {
    setEditing(cat)
    setEditValue(currentLimit.toString())
  }

  const saveEdit = (cat: TransactionCategory) => {
    const val = parseFloat(editValue)
    if (!isNaN(val) && val >= 0) onUpdateBudget(cat, val)
    setEditing(null)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Budget par catégorie</h2>

      <div className="space-y-4">
        {spendingByCategory.map(({ category, spent, budget }) => {
          const cfg = CATEGORY_CONFIG[category]
          const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
          const over = budget > 0 && spent > budget
          const isEditing = editing === category

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  {over && (
                    <span className="text-[10px] font-medium text-red-500">Dépassé !</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${over ? "text-red-500" : "text-gray-600 dark:text-gray-400"}`}>
                    {spent.toLocaleString("fr-FR")} €
                    {budget > 0 && <span className="text-gray-400 dark:text-gray-500 font-normal"> / </span>}
                  </span>

                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number" min="0" value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-16 text-xs border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5 bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-400"
                        autoFocus
                        onKeyDown={(e) => { if (e.key === "Enter") saveEdit(category); if (e.key === "Escape") setEditing(null) }}
                      />
                      <span className="text-xs text-gray-400">€</span>
                      <button onClick={() => saveEdit(category)} className="h-5 w-5 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded">
                        <Check className="h-3 w-3" />
                      </button>
                      <button onClick={() => setEditing(null)} className="h-5 w-5 flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {budget > 0 ? `${budget.toLocaleString("fr-FR")} €` : "—"}
                      </span>
                      <button onClick={() => startEdit(category, budget)} className="h-5 w-5 flex items-center justify-center text-gray-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 rounded transition-colors">
                        <Pencil className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                {budget > 0 && (
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${over ? "bg-red-400" : pct > 80 ? "bg-amber-400" : cfg.color.replace("text-", "bg-").replace("-700", "-400")}`}
                    style={{ width: `${pct}%` }}
                  />
                )}
              </div>
            </div>
          )
        })}

        {spendingByCategory.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">Aucune donnée de budget disponible</p>
        )}
      </div>
    </div>
  )
}
