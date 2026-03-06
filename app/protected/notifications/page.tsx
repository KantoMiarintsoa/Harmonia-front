"use client"

import Link from "next/link"
import { Bell, CheckCheck, Trash2, AlertTriangle, Clock, TrendingDown, ArrowRight, BellOff } from "lucide-react"
import { useNotifications } from "@/features/notifications/hooks/use-notifications"
import { NotificationItem, NotifType, NotifSeverity } from "@/features/notifications/types"
import { useState } from "react"
import { useI18n } from "@/contexts/i18n-context"

const LABELS = {
  en: {
    title: "Notifications", clearAll: "Clear all",
    critical: "Critical", warnings: "Warnings",
    all: "All", tasks: "Tasks", finance: "Finance",
    noNotifs: "No notifications", noNotifsDesc: "Everything is in order, keep it up!",
    allGood: "All up to date",
    alerts: (n: number) => `${n} active alert${n > 1 ? "s" : ""}`,
    overdue: "Overdue", today: "Today", budget: "Budget",
    justNow: "just now", ago: (n: number, u: string) => `${n}${u} ago`,
  },
  fr: {
    title: "Notifications", clearAll: "Tout effacer",
    critical: "Critiques", warnings: "Avertissements",
    all: "Toutes", tasks: "Tâches", finance: "Finance",
    noNotifs: "Aucune notification", noNotifsDesc: "Tout est en ordre, continuez comme ça !",
    allGood: "Tout est à jour",
    alerts: (n: number) => `${n} alerte${n > 1 ? "s" : ""} active${n > 1 ? "s" : ""}`,
    overdue: "Retard", today: "Aujourd'hui", budget: "Budget",
    justNow: "à l'instant", ago: (n: number, u: string) => `il y a ${n}${u}`,
  },
  mg: {
    title: "Fampandrenesana", clearAll: "Esorina rehetra",
    critical: "Maika", warnings: "Fampitandremana",
    all: "Rehetra", tasks: "Asa", finance: "Vola",
    noNotifs: "Tsy misy fampandrenesana", noNotifsDesc: "Tsara daholo, mitoero toy izany!",
    allGood: "Efa vita rehetra",
    alerts: (n: number) => `${n} fampandrenesana`,
    overdue: "Diso fotoana", today: "Androany", budget: "Tetibola",
    justNow: "vao teo", ago: (n: number, u: string) => `${n}${u} lasa`,
  },
}

type FilterTab = "all" | "tasks" | "finance"

const SEVERITY_CONFIG: Record<NotifSeverity, { color: string; bg: string; border: string; dot: string }> = {
  critical: { color: "text-red-600 dark:text-red-400",    bg: "bg-red-50 dark:bg-red-950",    border: "border-red-200 dark:border-red-800",    dot: "bg-red-500"    },
  warning:  { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950", border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-500"  },
  info:     { color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-950",   border: "border-blue-200 dark:border-blue-800",   dot: "bg-blue-500"   },
}

const TYPE_ICON: Record<NotifType, React.ReactNode> = {
  task_overdue:   <AlertTriangle className="h-4 w-4" />,
  task_due_today: <Clock className="h-4 w-4" />,
  budget_exceeded: <TrendingDown className="h-4 w-4" />,
  budget_warning:  <TrendingDown className="h-4 w-4" />,
}

function timeAgo(ts: string, l: typeof LABELS["fr"]): string {
  const diff = Date.now() - new Date(ts).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return l.justNow
  if (min < 60) return l.ago(min, " min")
  const h = Math.floor(min / 60)
  if (h < 24) return l.ago(h, "h")
  return l.ago(Math.floor(h / 24), "j")
}

function NotifCard({ notif, onDismiss, l }: { notif: NotificationItem; onDismiss: (id: string) => void; l: typeof LABELS["fr"] }) {
  const sev = SEVERITY_CONFIG[notif.severity]
  const TYPE_LABEL: Record<NotifType, string> = {
    task_overdue: l.overdue, task_due_today: l.today, budget_exceeded: l.budget, budget_warning: l.budget,
  }
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border ${sev.border} bg-white dark:bg-gray-800 hover:shadow-sm transition-all group`}>
      {/* Severity dot */}
      <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${sev.dot}`} />

      {/* Icon */}
      <div className={`h-9 w-9 rounded-xl ${sev.bg} flex items-center justify-center shrink-0 ${sev.color}`}>
        {TYPE_ICON[notif.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${sev.bg} ${sev.color}`}>
            {TYPE_LABEL[notif.type]}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">{timeAgo(notif.timestamp, l)}</span>
        </div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{notif.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{notif.message}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
        <Link href={notif.link}
          className="h-8 px-3 flex items-center gap-1.5 rounded-lg text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950 hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors">
          Voir <ArrowRight className="h-3 w-3" />
        </Link>
        <button onClick={() => onDismiss(notif.id)}
          className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const { notifications, unreadCount, dismiss, dismissAll } = useNotifications()
  const { locale } = useI18n()
  const l = LABELS[locale]
  const [activeTab, setActiveTab] = useState<FilterTab>("all")

  const tabs: { value: FilterTab; label: string; count: number }[] = [
    { value: "all",     label: l.all,      count: notifications.length },
    { value: "tasks",   label: l.tasks,    count: notifications.filter(n => n.type.startsWith("task")).length },
    { value: "finance", label: l.finance,  count: notifications.filter(n => n.type.startsWith("budget")).length },
  ]

  const filtered = notifications.filter(n => {
    if (activeTab === "tasks")   return n.type.startsWith("task")
    if (activeTab === "finance") return n.type.startsWith("budget")
    return true
  })

  const critical = filtered.filter(n => n.severity === "critical")
  const warning  = filtered.filter(n => n.severity === "warning")

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center">
            <Bell className="h-5 w-5 text-violet-500 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{l.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {unreadCount > 0 ? l.alerts(unreadCount) : l.allGood}
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={() => dismissAll(notifications.map(n => n.id))}
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            {l.clearAll}
          </button>
        )}
      </div>

      {/* Summary KPIs */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-100 dark:border-red-900 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{l.critical}</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{notifications.filter(n => n.severity === "critical").length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-amber-100 dark:border-amber-900 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{l.warnings}</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{notifications.filter(n => n.severity === "warning").length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {tabs.map(tab => (
          <button key={tab.value} onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === tab.value
                ? "bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}>
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.value
                  ? "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <BellOff className="h-8 w-8 text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-base font-semibold text-gray-500 dark:text-gray-400">{l.noNotifs}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{l.noNotifsDesc}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {critical.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />
                {l.critical} — {critical.length}
              </p>
              {critical.map(n => <NotifCard key={n.id} notif={n} onDismiss={dismiss} l={l} />)}
            </div>
          )}
          {warning.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
                {l.warnings} — {warning.length}
              </p>
              {warning.map(n => <NotifCard key={n.id} notif={n} onDismiss={dismiss} l={l} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
