"use client"

import { useState, useEffect } from "react"
import { Transaction, Budget, TransactionCategory, EXPENSE_CATEGORIES } from "../types"

const STORAGE_KEY_TX = "harmonia_transactions"
const STORAGE_KEY_BUDGET = "harmonia_budgets"

const today = new Date().toISOString().split("T")[0]
const lastMonth = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: "1", type: "revenu",   amount: 2500, category: "salaire",      description: "Salaire mai",         date: today,      createdAt: new Date().toISOString() },
  { id: "2", type: "revenu",   amount: 400,  category: "freelance",    description: "Projet web",          date: lastMonth,  createdAt: new Date().toISOString() },
  { id: "3", type: "dépense",  amount: 800,  category: "logement",     description: "Loyer",               date: today,      createdAt: new Date().toISOString() },
  { id: "4", type: "dépense",  amount: 120,  category: "alimentation", description: "Courses semaine",     date: today,      createdAt: new Date().toISOString() },
  { id: "5", type: "dépense",  amount: 45,   category: "transport",    description: "Abonnement bus",      date: lastMonth,  createdAt: new Date().toISOString() },
  { id: "6", type: "dépense",  amount: 60,   category: "loisirs",      description: "Cinéma + restaurant", date: lastMonth,  createdAt: new Date().toISOString() },
  { id: "7", type: "revenu",   amount: 200,  category: "investissement","description": "Dividendes",       date: lastMonth,  createdAt: new Date().toISOString() },
  { id: "8", type: "dépense",  amount: 30,   category: "éducation",    description: "Udemy cours",        date: today,      createdAt: new Date().toISOString() },
]

const SAMPLE_BUDGETS: Budget[] = [
  { category: "logement",     limit: 900  },
  { category: "alimentation", limit: 400  },
  { category: "transport",    limit: 100  },
  { category: "loisirs",      limit: 150  },
  { category: "santé",        limit: 80   },
  { category: "éducation",    limit: 50   },
]

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])

  useEffect(() => {
    const storedTx = localStorage.getItem(STORAGE_KEY_TX)
    const storedBudgets = localStorage.getItem(STORAGE_KEY_BUDGET)
    setTransactions(storedTx ? JSON.parse(storedTx) : SAMPLE_TRANSACTIONS)
    setBudgets(storedBudgets ? JSON.parse(storedBudgets) : SAMPLE_BUDGETS)
    if (!storedTx) localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(SAMPLE_TRANSACTIONS))
    if (!storedBudgets) localStorage.setItem(STORAGE_KEY_BUDGET, JSON.stringify(SAMPLE_BUDGETS))
  }, [])

  const saveTx = (list: Transaction[]) => {
    setTransactions(list)
    localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(list))
  }

  const saveBudgets = (list: Budget[]) => {
    setBudgets(list)
    localStorage.setItem(STORAGE_KEY_BUDGET, JSON.stringify(list))
  }

  const addTransaction = (data: Omit<Transaction, "id" | "createdAt">) => {
    const tx: Transaction = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    saveTx([tx, ...transactions])
  }

  const updateTransaction = (id: string, data: Omit<Transaction, "id" | "createdAt">) => {
    saveTx(transactions.map((t) => (t.id === id ? { ...t, ...data } : t)))
  }

  const deleteTransaction = (id: string) => {
    saveTx(transactions.filter((t) => t.id !== id))
  }

  const updateBudget = (category: TransactionCategory, limit: number) => {
    const existing = budgets.find((b) => b.category === category)
    if (existing) {
      saveBudgets(budgets.map((b) => (b.category === category ? { ...b, limit } : b)))
    } else {
      saveBudgets([...budgets, { category, limit }])
    }
  }

  const totalRevenu = transactions.filter((t) => t.type === "revenu").reduce((s, t) => s + t.amount, 0)
  const totalDépense = transactions.filter((t) => t.type === "dépense").reduce((s, t) => s + t.amount, 0)
  const solde = totalRevenu - totalDépense

  // Spending by category for current month
  const currentMonth = new Date().toISOString().slice(0, 7)
  const spendingByCategory = EXPENSE_CATEGORIES.map((cat) => {
    const spent = transactions
      .filter((t) => t.type === "dépense" && t.category === cat && t.date.startsWith(currentMonth))
      .reduce((s, t) => s + t.amount, 0)
    const budget = budgets.find((b) => b.category === cat)?.limit ?? 0
    return { category: cat, spent, budget }
  }).filter((c) => c.spent > 0 || c.budget > 0)

  // Monthly data for bar chart (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const key = d.toISOString().slice(0, 7)
    const label = d.toLocaleDateString("fr-FR", { month: "short" })
    const revenus = transactions.filter((t) => t.type === "revenu" && t.date.startsWith(key)).reduce((s, t) => s + t.amount, 0)
    const dépenses = transactions.filter((t) => t.type === "dépense" && t.date.startsWith(key)).reduce((s, t) => s + t.amount, 0)
    return { label, revenus, dépenses }
  })

  // Pie data for expenses by category
  const expensePieData = EXPENSE_CATEGORIES
    .map((cat) => ({
      name: cat,
      value: transactions.filter((t) => t.type === "dépense" && t.category === cat).reduce((s, t) => s + t.amount, 0),
    }))
    .filter((d) => d.value > 0)

  return {
    transactions,
    budgets,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateBudget,
    totalRevenu,
    totalDépense,
    solde,
    spendingByCategory,
    monthlyData,
    expensePieData,
  }
}
