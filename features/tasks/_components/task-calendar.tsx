"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, CalendarDays, Check, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip } from "@/components/ui/tooltip"
import { Task, CATEGORY_CONFIG, STATUS_CONFIG } from "../types"

interface TaskCalendarProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onToggle: (id: string) => void
  onNew?: (date: string) => void
}

type Cell = { type: "empty"; key: string } | { type: "day"; key: string; day: number }

const MONTHS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

function pad(n: number) { return String(n).padStart(2, "0") }

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

export function TaskCalendar({ tasks, onEdit, onToggle, onNew }: TaskCalendarProps) {
  const todayDate = new Date()
  const [current, setCurrent] = useState({ year: todayDate.getFullYear(), month: todayDate.getMonth() })
  const [selectedDay, setSelectedDay] = useState<number>(todayDate.getDate())

  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()
  const firstDayOfWeek = (new Date(current.year, current.month, 1).getDay() + 6) % 7

  const prevMonth = () => setCurrent((p) => p.month === 0 ? { year: p.year - 1, month: 11 } : { ...p, month: p.month - 1 })
  const nextMonth = () => setCurrent((p) => p.month === 11 ? { year: p.year + 1, month: 0 } : { ...p, month: p.month + 1 })
  const goToday = () => {
    setCurrent({ year: todayDate.getFullYear(), month: todayDate.getMonth() })
    setSelectedDay(todayDate.getDate())
  }

  const getTasksForDay = (day: number) =>
    tasks.filter((t) => t.dueDate === toDateStr(current.year, current.month, day))

  const isToday = (day: number) =>
    todayDate.getFullYear() === current.year &&
    todayDate.getMonth() === current.month &&
    todayDate.getDate() === day

  const isWeekend = (cellIndex: number) => {
    const dayOfWeek = (cellIndex + firstDayOfWeek) % 7 // Mon=0 ... Sun=6 (adjusted)
    return dayOfWeek >= 5 // Sat=5, Sun=6
  }

  const cells: Cell[] = [
    ...Array.from({ length: firstDayOfWeek }, (_, i): Cell => ({ type: "empty", key: `e-${i}` })),
    ...Array.from({ length: daysInMonth }, (_, i): Cell => ({ type: "day", key: `d-${i + 1}`, day: i + 1 })),
  ]

  const selectedDateStr = toDateStr(current.year, current.month, selectedDay)
  const selectedTasks = tasks.filter((t) => t.dueDate === selectedDateStr)
  const selectedIsToday = isToday(selectedDay)

  return (
    <div className="flex gap-4 h-full">

      {/* ── Calendar Grid ── */}
      <Card className="flex-1 overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 p-0">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-violet-500" />
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {MONTHS_FR[current.month]} <span className="text-gray-400 dark:text-gray-500 font-normal">{current.year}</span>
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={goToday}
              className="h-7 px-2.5 text-xs text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950 font-medium">
              Aujourd'hui
            </Button>
            <Separator orientation="vertical" className="h-4 mx-1" />
            <Button variant="ghost" size="icon" onClick={prevMonth}
              className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth}
              className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7">
          {DAYS_FR.map((d, i) => (
            <div key={d} className={`py-2 text-center text-[10px] font-semibold uppercase tracking-wider ${i >= 5 ? "text-violet-400 dark:text-violet-500" : "text-gray-400 dark:text-gray-500"}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 border-t border-gray-100 dark:border-gray-700">
          {cells.map((cell, idx) => {
            if (cell.type === "empty") {
              const colIdx = idx % 7
              return (
                <div key={cell.key}
                  className={`min-h-[100px] border-b border-r border-gray-100 dark:border-gray-700 ${colIdx >= 5 ? "bg-gray-50/50 dark:bg-gray-900/30" : ""}`}
                />
              )
            }

            const dayTasks = getTasksForDay(cell.day)
            const todayCell = isToday(cell.day)
            const selected = selectedDay === cell.day
            const colIdx = (firstDayOfWeek + cell.day - 1) % 7
            const isWknd = colIdx >= 5
            const doneCount = dayTasks.filter((t) => t.status === "terminé").length
            const pendingCount = dayTasks.length - doneCount

            return (
              <div
                key={cell.key}
                onClick={() => setSelectedDay(cell.day)}
                className={`
                  min-h-[100px] border-b border-r border-gray-100 dark:border-gray-700
                  p-2 cursor-pointer transition-colors
                  ${selected ? "bg-violet-50 dark:bg-violet-950/40" : isWknd ? "bg-gray-50/50 dark:bg-gray-900/30 hover:bg-gray-100/60 dark:hover:bg-gray-800/60" : "hover:bg-gray-50 dark:hover:bg-gray-800/60"}
                `}
              >
                {/* Day number */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`
                    h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold
                    ${todayCell ? "bg-violet-600 text-white shadow-sm" : selected ? "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300" : isWknd ? "text-violet-400 dark:text-violet-500" : "text-gray-600 dark:text-gray-400"}
                  `}>
                    {cell.day}
                  </span>

                  {/* Task count badge */}
                  {dayTasks.length > 0 && (
                    <div className="flex items-center gap-0.5">
                      {pendingCount > 0 && (
                        <span className="h-4 min-w-4 px-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[9px] font-bold flex items-center justify-center">
                          {pendingCount}
                        </span>
                      )}
                      {doneCount > 0 && (
                        <span className="h-4 min-w-4 px-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold flex items-center justify-center">
                          {doneCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Task pills */}
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 2).map((task) => {
                    const cfg = CATEGORY_CONFIG[task.category]
                    return (
                      <div key={task.id}
                        onClick={(e) => { e.stopPropagation(); onEdit(task) }}
                        className={`
                          flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium truncate cursor-pointer
                          ${cfg.bg} ${cfg.color}
                          ${task.status === "terminé" ? "opacity-50 line-through" : ""}
                          hover:opacity-75 transition-opacity
                        `}
                      >
                        <span className={`h-1 w-1 rounded-full shrink-0 ${cfg.color.replace("text-", "bg-")}`} />
                        {task.title}
                      </div>
                    )
                  })}
                  {dayTasks.length > 2 && (
                    <div className="text-[9px] text-gray-400 dark:text-gray-500 px-1 font-medium">
                      +{dayTasks.length - 2} de plus
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* ── Day Detail Panel ── */}
      <Card className="w-72 shrink-0 border border-gray-100 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 flex flex-col overflow-hidden p-0">

        {/* Panel header */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
                {DAYS_FR[(new Date(current.year, current.month, selectedDay).getDay() + 6) % 7]}
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
                {selectedDay}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {MONTHS_FR[current.month]} {current.year}
              </p>
            </div>
            {selectedIsToday && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300">
                Aujourd'hui
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-md bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                <Clock className="h-3 w-3 text-amber-500" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {selectedTasks.filter(t => t.status === "en cours").length} en cours
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-md bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-500" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {selectedTasks.filter(t => t.status === "terminé").length} terminé
              </span>
            </div>
          </div>
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {selectedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <div className="h-10 w-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-3">
                <CalendarDays className="h-5 w-5 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Aucune tâche</p>
              <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-0.5">pour ce jour</p>
            </div>
          ) : (
            selectedTasks.map((task) => {
              const catCfg = CATEGORY_CONFIG[task.category]
              const statusCfg = STATUS_CONFIG[task.status]
              const isDone = task.status === "terminé"
              return (
                <div
                  key={task.id}
                  onClick={() => onEdit(task)}
                  className={`
                    p-3 rounded-xl border cursor-pointer transition-all
                    hover:shadow-sm
                    ${isDone
                      ? "bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-700 opacity-70"
                      : "bg-white dark:bg-gray-700 border-gray-100 dark:border-gray-600 hover:border-violet-200 dark:hover:border-violet-700"
                    }
                  `}
                >
                  {/* Category + Status */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${catCfg.bg} ${catCfg.color}`}>
                      {catCfg.label}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Title */}
                  <p className={`text-xs font-medium ${isDone ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-100"}`}>
                    {task.title}
                  </p>

                  {/* Description */}
                  {task.description && (
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Toggle */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggle(task.id) }}
                    className={`
                      mt-2 flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md transition-colors
                      ${isDone
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                        : "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-950 hover:text-violet-600 dark:hover:text-violet-400"
                      }
                    `}
                  >
                    <Check className="h-2.5 w-2.5" />
                    {isDone ? "Marquer en cours" : "Marquer terminé"}
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {onNew && (
          <div className="p-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => onNew(selectedDateStr)}
              className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 text-xs font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter une tâche
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}
