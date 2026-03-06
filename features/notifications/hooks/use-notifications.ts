"use client"

import { useState, useEffect, useMemo } from "react"
import { Task } from "@/features/tasks/types"
import { Transaction, Budget, CATEGORY_CONFIG, EXPENSE_CATEGORIES } from "@/features/finance/types"
import { NotificationItem } from "../types"

const DISMISSED_KEY = "harmonia_notifs_dismissed"

function todayStr() { return new Date().toISOString().split("T")[0] }
function currentMonthStr() { return new Date().toISOString().slice(0, 7) }

export function useNotifications() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [tasks, setTasks] = useState<Task[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])

  useEffect(() => {
    const storedTasks = localStorage.getItem("harmonia_tasks")
    const storedTx = localStorage.getItem("harmonia_transactions")
    const storedBudgets = localStorage.getItem("harmonia_budgets")
    const storedDismissed = localStorage.getItem(DISMISSED_KEY)
    if (storedTasks) setTasks(JSON.parse(storedTasks))
    if (storedTx) setTransactions(JSON.parse(storedTx))
    if (storedBudgets) setBudgets(JSON.parse(storedBudgets))
    if (storedDismissed) setDismissed(new Set(JSON.parse(storedDismissed)))
  }, [])

  const dismiss = (id: string) => {
    const next = new Set([...dismissed, id])
    setDismissed(next)
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...next]))
  }

  const dismissAll = (ids: string[]) => {
    const next = new Set([...dismissed, ...ids])
    setDismissed(next)
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...next]))
  }

  const allNotifications = useMemo<NotificationItem[]>(() => {
    const today = todayStr()
    const currentMonth = currentMonthStr()
    const notifs: NotificationItem[] = []

    // ── Task notifications ──
    for (const task of tasks) {
      if (task.status === "terminé") continue
      if (task.dueDate < today) {
        notifs.push({
          id: `task_overdue_${task.id}`,
          type: "task_overdue",
          severity: "critical",
          title: "Tâche en retard",
          message: `"${task.title}" était due le ${new Date(task.dueDate + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`,
          link: "/protected/tasks",
          timestamp: task.dueDate + "T23:59:00.000Z",
        })
      } else if (task.dueDate === today) {
        notifs.push({
          id: `task_due_today_${task.id}`,
          type: "task_due_today",
          severity: "warning",
          title: "Tâche à faire aujourd'hui",
          message: `"${task.title}" doit être terminée aujourd'hui`,
          link: "/protected/tasks",
          timestamp: new Date().toISOString(),
        })
      }
    }

    // ── Budget notifications ──
    for (const cat of EXPENSE_CATEGORIES) {
      const spent = transactions
        .filter(t => t.type === "dépense" && t.category === cat && t.date.startsWith(currentMonth))
        .reduce((s, t) => s + t.amount, 0)
      const budget = budgets.find(b => b.category === cat)?.limit ?? 0
      if (budget === 0 || spent === 0) continue

      const pct = spent / budget
      const catLabel = CATEGORY_CONFIG[cat]?.label ?? cat

      if (pct >= 1) {
        notifs.push({
          id: `budget_exceeded_${cat}_${currentMonth}`,
          type: "budget_exceeded",
          severity: "critical",
          title: "Budget dépassé",
          message: `${catLabel} : ${spent.toLocaleString("fr-FR")} € / ${budget.toLocaleString("fr-FR")} € (${Math.round(pct * 100)}%)`,
          link: "/protected/finance",
          timestamp: new Date().toISOString(),
        })
      } else if (pct >= 0.8) {
        notifs.push({
          id: `budget_warning_${cat}_${currentMonth}`,
          type: "budget_warning",
          severity: "warning",
          title: "Budget presque atteint",
          message: `${catLabel} : ${Math.round(pct * 100)}% consommé (${spent.toLocaleString("fr-FR")} € / ${budget.toLocaleString("fr-FR")} €)`,
          link: "/protected/finance",
          timestamp: new Date().toISOString(),
        })
      }
    }

    // Sort: critical first, then warning, then by timestamp
    return notifs.sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2 }
      const diff = order[a.severity] - order[b.severity]
      if (diff !== 0) return diff
      return b.timestamp.localeCompare(a.timestamp)
    })
  }, [tasks, transactions, budgets])

  const notifications = allNotifications.filter(n => !dismissed.has(n.id))
  const unreadCount = notifications.length

  return { notifications, allNotifications, unreadCount, dismiss, dismissAll }
}
