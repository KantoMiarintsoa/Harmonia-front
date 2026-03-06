export type TransactionType = "revenu" | "dépense"

export type TransactionCategory =
  | "salaire"
  | "freelance"
  | "investissement"
  | "autre_revenu"
  | "logement"
  | "alimentation"
  | "transport"
  | "santé"
  | "loisirs"
  | "éducation"
  | "autre_dépense"

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: TransactionCategory
  description: string
  date: string // YYYY-MM-DD
  createdAt: string
}

export interface Budget {
  category: TransactionCategory
  limit: number
}

export const INCOME_CATEGORIES: TransactionCategory[] = [
  "salaire", "freelance", "investissement", "autre_revenu",
]

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "logement", "alimentation", "transport", "santé", "loisirs", "éducation", "autre_dépense",
]

export const CATEGORY_CONFIG: Record<TransactionCategory, { label: string; color: string; bg: string; chartColor: string }> = {
  salaire:         { label: "Salaire",        color: "text-emerald-700", bg: "bg-emerald-50",  chartColor: "#10b981" },
  freelance:       { label: "Freelance",      color: "text-teal-700",   bg: "bg-teal-50",     chartColor: "#14b8a6" },
  investissement:  { label: "Investissement", color: "text-blue-700",   bg: "bg-blue-50",     chartColor: "#3b82f6" },
  autre_revenu:    { label: "Autre revenu",   color: "text-cyan-700",   bg: "bg-cyan-50",     chartColor: "#06b6d4" },
  logement:        { label: "Logement",       color: "text-violet-700", bg: "bg-violet-50",   chartColor: "#8b5cf6" },
  alimentation:    { label: "Alimentation",   color: "text-orange-700", bg: "bg-orange-50",   chartColor: "#f97316" },
  transport:       { label: "Transport",      color: "text-amber-700",  bg: "bg-amber-50",    chartColor: "#f59e0b" },
  santé:           { label: "Santé",          color: "text-pink-700",   bg: "bg-pink-50",     chartColor: "#ec4899" },
  loisirs:         { label: "Loisirs",        color: "text-purple-700", bg: "bg-purple-50",   chartColor: "#a855f7" },
  éducation:       { label: "Éducation",      color: "text-indigo-700", bg: "bg-indigo-50",   chartColor: "#6366f1" },
  autre_dépense:   { label: "Autre dépense",  color: "text-red-700",    bg: "bg-red-50",      chartColor: "#ef4444" },
}
