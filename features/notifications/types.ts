export type NotifSeverity = "info" | "warning" | "critical"
export type NotifType = "task_overdue" | "task_due_today" | "budget_warning" | "budget_exceeded"

export interface NotificationItem {
  id: string
  type: NotifType
  severity: NotifSeverity
  title: string
  message: string
  link: string
  timestamp: string
}
