"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts"
import { CATEGORY_CONFIG } from "../types"

interface MonthlyData { label: string; revenus: number; dépenses: number }
interface PieData { name: string; value: number }

interface Props {
  monthlyData: MonthlyData[]
  expensePieData: PieData[]
}

const formatEur = (v: number | undefined) => v != null ? `${v.toLocaleString("fr-FR")} €` : ""

export function FinanceCharts({ monthlyData, expensePieData }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">

      {/* Bar chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Revenus vs Dépenses</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barSize={10} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
            <Tooltip
              formatter={formatEur}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="revenus" name="Revenus" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="dépenses" name="Dépenses" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Répartition des dépenses</h2>

        {expensePieData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px]">
            <p className="text-sm text-gray-400">Aucune dépense enregistrée</p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie data={expensePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {expensePieData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_CONFIG[entry.name as keyof typeof CATEGORY_CONFIG]?.chartColor ?? "#ccc"} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={formatEur}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex-1 space-y-1.5 overflow-auto max-h-[220px]">
              {expensePieData.map((entry) => {
                const cfg = CATEGORY_CONFIG[entry.name as keyof typeof CATEGORY_CONFIG]
                return (
                  <div key={entry.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cfg?.chartColor }} />
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{cfg?.label}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 shrink-0">{formatEur(entry.value)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
