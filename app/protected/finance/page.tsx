"use client"

import { useState } from "react"
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { useFinance } from "@/features/finance/hooks/use-finance"
import { TransactionFormModal } from "@/features/finance/_components/transaction-form-modal"
import { TransactionTable } from "@/features/finance/_components/transaction-table"
import { FinanceCharts } from "@/features/finance/_components/finance-charts"
import { BudgetManager } from "@/features/finance/_components/budget-manager"
import { Transaction } from "@/features/finance/types"
import { useConfirm } from "@/hooks/use-confirm"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

type Tab = "aperçu" | "transactions" | "budget"

export default function FinancePage() {
  const {
    transactions, budgets,
    addTransaction, updateTransaction, deleteTransaction, updateBudget,
    totalRevenu, totalDépense, solde,
    spendingByCategory, monthlyData, expensePieData,
  } = useFinance()

  const [tab, setTab] = useState<Tab>("aperçu")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)

  const { ask, confirmState, handleConfirm, handleCancel } = useConfirm()

  const handleEdit = (tx: Transaction) => { setEditingTx(tx); setModalOpen(true) }
  const handleDelete = async (id: string) => {
    const ok = await ask({ title: "Supprimer cette transaction ?", message: "Cette action est irréversible.", confirmLabel: "Supprimer", variant: "danger" })
    if (ok) deleteTransaction(id)
  }
  const handleClose = () => { setModalOpen(false); setEditingTx(null) }

  const TABS: { value: Tab; label: string }[] = [
    { value: "aperçu", label: "Aperçu" },
    { value: "transactions", label: "Transactions" },
    { value: "budget", label: "Budget" },
  ]

  const cardClass = "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Finance</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Suivi de vos revenus et dépenses</p>
        </div>
        <button
          onClick={() => { setEditingTx(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 h-10 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouvelle transaction
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`${cardClass} p-5 flex items-center gap-4`}>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total revenus</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              +{totalRevenu.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </p>
          </div>
        </div>

        <div className={`${cardClass} p-5 flex items-center gap-4`}>
          <div className="h-11 w-11 rounded-xl bg-red-50 dark:bg-red-950 flex items-center justify-center shrink-0">
            <TrendingDown className="h-5 w-5 text-red-500 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total dépenses</p>
            <p className="text-xl font-bold text-red-500 dark:text-red-400 mt-0.5">
              -{totalDépense.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </p>
          </div>
        </div>

        <div className={`${cardClass} p-5 flex items-center gap-4`}>
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${solde >= 0 ? "bg-violet-50 dark:bg-violet-950" : "bg-red-50 dark:bg-red-950"}`}>
            <Wallet className={`h-5 w-5 ${solde >= 0 ? "text-violet-600 dark:text-violet-400" : "text-red-500 dark:text-red-400"}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Solde</p>
            <p className={`text-xl font-bold mt-0.5 ${solde >= 0 ? "text-violet-600 dark:text-violet-400" : "text-red-500 dark:text-red-400"}`}>
              {solde >= 0 ? "+" : ""}{solde.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {TABS.map((t) => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
              tab === t.value
                ? "bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "aperçu" && (
        <div className="space-y-6">
          <FinanceCharts monthlyData={monthlyData} expensePieData={expensePieData} />
          <div className="grid grid-cols-2 gap-6">
            <BudgetManager spendingByCategory={spendingByCategory} onUpdateBudget={updateBudget} />

            {/* Recent transactions */}
            <div className={`${cardClass} p-5`}>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Transactions récentes</h2>
              <div className="space-y-2">
                {transactions.slice(0, 6).map((tx) => {
                  const isRevenu = tx.type === "revenu"
                  return (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${isRevenu ? "bg-emerald-50 dark:bg-emerald-950" : "bg-red-50 dark:bg-red-950"}`}>
                          {isRevenu
                            ? <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            : <TrendingDown className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">{tx.description}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">
                            {new Date(tx.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold shrink-0 ml-3 ${isRevenu ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                        {isRevenu ? "+" : "-"}{tx.amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "transactions" && (
        <TransactionTable transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {tab === "budget" && (
        <div className="max-w-2xl">
          <BudgetManager spendingByCategory={spendingByCategory} onUpdateBudget={updateBudget} />
        </div>
      )}

      <TransactionFormModal
        open={modalOpen} transaction={editingTx}
        onClose={handleClose} onAdd={addTransaction} onUpdate={updateTransaction}
      />

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        variant={confirmState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}
