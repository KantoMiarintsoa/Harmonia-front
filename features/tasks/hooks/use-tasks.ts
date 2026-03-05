"use client"

import { useState, useEffect } from "react"
import { Task, TaskCategory, TaskStatus } from "../types"

const STORAGE_KEY = "harmonia_tasks"

const SAMPLE_TASKS: Task[] = [
  {
    id: "1",
    title: "Préparer la réunion d'équipe",
    description: "Préparer le slide et l'ordre du jour pour la réunion de lundi",
    category: "travail",
    status: "en cours",
    dueDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Séance de sport",
    description: "30 min de cardio + musculation",
    category: "santé",
    status: "terminé",
    dueDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Appeler maman",
    description: "Appel hebdomadaire en famille",
    category: "personnel",
    status: "en cours",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  },
]

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setTasks(JSON.parse(stored))
    } else {
      setTasks(SAMPLE_TASKS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TASKS))
    }
  }, [])

  const save = (updated: Task[]) => {
    setTasks(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const createTask = (data: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    save([...tasks, newTask])
  }

  const updateTask = (id: string, data: Partial<Omit<Task, "id" | "createdAt">>) => {
    save(tasks.map((t) => (t.id === id ? { ...t, ...data } : t)))
  }

  const deleteTask = (id: string) => {
    save(tasks.filter((t) => t.id !== id))
  }

  const toggleStatus = (id: string) => {
    save(
      tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "terminé" ? "en cours" : "terminé" }
          : t
      )
    )
  }

  const filterByCategory = (category: TaskCategory | "toutes") =>
    category === "toutes" ? tasks : tasks.filter((t) => t.category === category)

  const tasksByDate = (date: string) => tasks.filter((t) => t.dueDate === date)

  const stats = {
    total: tasks.length,
    enCours: tasks.filter((t) => t.status === "en cours").length,
    terminé: tasks.filter((t) => t.status === "terminé").length,
    travail: tasks.filter((t) => t.category === "travail").length,
    personnel: tasks.filter((t) => t.category === "personnel").length,
    santé: tasks.filter((t) => t.category === "santé").length,
  }

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    toggleStatus,
    filterByCategory,
    tasksByDate,
    stats,
  }
}
