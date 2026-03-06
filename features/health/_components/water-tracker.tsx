"use client"

import { Card } from "@/components/ui/card"
import { WATER_GOAL } from "../types"

interface Props {
  glasses: number
  onSet: (n: number) => void
}

export function WaterTracker({ glasses, onSet }: Props) {
  const pct = Math.min((glasses / WATER_GOAL) * 100, 100)
  const remaining = Math.max(WATER_GOAL - glasses, 0)

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Hydratation</h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${glasses >= WATER_GOAL ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"}`}>
          {glasses >= WATER_GOAL ? "✅ Objectif atteint" : `💧 ${remaining} restant`}
        </span>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => onSet(Math.max(glasses - 1, 0))}
          className="h-9 w-9 rounded-full border-2 border-gray-200 dark:border-gray-600 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all text-lg font-bold flex items-center justify-center"
        >
          −
        </button>
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-500 dark:text-blue-400 leading-none">{glasses}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">/ {WATER_GOAL} verres</p>
        </div>
        <button
          onClick={() => onSet(Math.min(glasses + 1, 20))}
          className="h-9 w-9 rounded-full border-2 border-gray-200 dark:border-gray-600 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all text-lg font-bold flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Glass icons */}
      <div className="grid grid-cols-8 gap-1.5">
        {Array.from({ length: WATER_GOAL }, (_, i) => (
          <button
            key={i}
            onClick={() => onSet(i < glasses ? i : i + 1)}
            className={`h-7 w-full rounded-md flex items-center justify-center text-sm transition-all ${
              i < glasses
                ? "bg-blue-100 dark:bg-blue-900 text-blue-500"
                : "bg-gray-50 dark:bg-gray-700 text-gray-300 dark:text-gray-600 hover:bg-blue-50 dark:hover:bg-blue-950"
            }`}
          >
            💧
          </button>
        ))}
      </div>
    </Card>
  )
}
