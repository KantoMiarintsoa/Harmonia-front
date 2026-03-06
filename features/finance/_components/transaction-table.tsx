"use client"

import { useState } from "react"
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { Transaction, CATEGORY_CONFIG } from "../types"

interface Props {
  transactions: Transaction[]
  onEdit: (t: Transaction) => void
  onDelete: (id: string) => void
}

type Filter = "all" | "revenu" | "dépense"

export function TransactionTable({ transactions, onEdit, onDelete }: Props) {
  const [filter, setFilter] = useState<Filter>("all")

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter)
  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Transactions</h2>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {(["all", "revenu", "dépense"] as Filter[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                filter === f
                  ? "bg-white dark:bg-gray-600 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {f === "all" ? "Toutes" : f === "revenu" ? "Revenus" : "Dépenses"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-400 dark:text-gray-500">Aucune transaction</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Type</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Description</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Catégorie</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Date</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Montant</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {sorted.map((tx) => {
                const catCfg = CATEGORY_CONFIG[tx.category]
                const isRevenu = tx.type === "revenu"
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                    <td className="px-5 py-3">
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${isRevenu ? "bg-emerald-50 dark:bg-emerald-950" : "bg-red-50 dark:bg-red-950"}`}>
                        {isRevenu
                          ? <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          : <TrendingDown className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                        }
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{tx.description}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${catCfg.bg} ${catCfg.color}`}>
                        {catCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(tx.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-sm font-semibold ${isRevenu ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                        {isRevenu ? "+" : "-"}{tx.amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(tx)} className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => onDelete(tx.id)} className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
