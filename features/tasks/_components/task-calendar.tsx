"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Task, CATEGORY_CONFIG } from "../types"

interface TaskCalendarProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onToggle: (id: string) => void
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  // Monday-based: 0=Mon, 6=Sun
  const day = new Date(year, month, 1).getDay()
  return (day + 6) % 7
}

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]
const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

export function TaskCalendar({ tasks, onEdit, onToggle }: TaskCalendarProps) {
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const daysInMonth = getDaysInMonth(current.year, current.month)
  const firstDay = getFirstDayOfMonth(current.year, current.month)

  const prevMonth = () => {
    setCurrent((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 }
      return { ...prev, month: prev.month - 1 }
    })
  }

  const nextMonth = () => {
    setCurrent((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 }
      return { ...prev, month: prev.month + 1 }
    })
  }

  const getTasksForDay = (day: number) => {
    const dateStr = `${current.year}-${String(current.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return tasks.filter((t) => t.dueDate === dateStr)
  }

  const isToday = (day: number) => {
    return (
      today.getFullYear() === current.year &&
      today.getMonth() === current.month &&
      today.getDate() === day
    )
  }

  const cells = Array.from({ length: firstDay }, (_, i) => ({ type: "empty" as const, key: `e-${i}` }))
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ type: "day" as const, key: `d-${d}`, day: d } as { type: "day"; key: string; day: number })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <button
          onClick={prevMonth}
          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        <h2 className="text-sm font-semibold text-gray-800">
          {MONTHS_FR[current.month]} {current.year}
        </h2>

        <button
          onClick={nextMonth}
          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DAYS_FR.map((d) => (
          <div key={d} className="py-2 text-center text-[11px] font-semibold text-gray-400 uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell) => {
          if (cell.type === "empty") {
            return <div key={cell.key} className="min-h-[90px] border-b border-r border-gray-50" />
          }

          const dayTasks = getTasksForDay(cell.day)
          const todayCell = isToday(cell.day)

          return (
            <div
              key={cell.key}
              className="min-h-[90px] border-b border-r border-gray-50 p-1.5"
            >
              {/* Day number */}
              <div className="mb-1 flex justify-center">
                <span
                  className={`
                    h-6 w-6 flex items-center justify-center rounded-full text-xs font-medium
                    ${todayCell ? "bg-purple-600 text-white" : "text-gray-600"}
                  `}
                >
                  {cell.day}
                </span>
              </div>

              {/* Tasks dots */}
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map((task) => {
                  const catCfg = CATEGORY_CONFIG[task.category]
                  return (
                    <button
                      key={task.id}
                      onClick={() => onEdit(task)}
                      className={`
                        w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate
                        ${catCfg.bg} ${catCfg.color}
                        ${task.status === "terminé" ? "line-through opacity-60" : ""}
                        hover:opacity-80 transition-opacity
                      `}
                    >
                      {task.title}
                    </button>
                  )
                })}
                {dayTasks.length > 3 && (
                  <p className="text-[10px] text-gray-400 pl-1">+{dayTasks.length - 3} autres</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
