"use client"

import { useState, useEffect } from "react"
import { MoodEntry, MoodLevel, WaterEntry, SleepEntry, ExerciseEntry, ExerciseType } from "../types"

const KEYS = { mood: "harmonia_mood", water: "harmonia_water", sleep: "harmonia_sleep", exercise: "harmonia_exercise" }

function today() { return new Date().toISOString().split("T")[0] }
function daysAgo(n: number) { return new Date(Date.now() - n * 86400000).toISOString().split("T")[0] }

const SAMPLE_MOOD: MoodEntry[] = [
  { id: "m1", date: today(),       mood: 4, note: "Bonne journée de travail",    createdAt: new Date().toISOString() },
  { id: "m2", date: daysAgo(1),    mood: 3, note: "Un peu fatigué",              createdAt: new Date().toISOString() },
  { id: "m3", date: daysAgo(2),    mood: 5, note: "Excellent weekend !",         createdAt: new Date().toISOString() },
  { id: "m4", date: daysAgo(3),    mood: 2, note: "Journée difficile au bureau", createdAt: new Date().toISOString() },
  { id: "m5", date: daysAgo(4),    mood: 4, note: "",                            createdAt: new Date().toISOString() },
  { id: "m6", date: daysAgo(5),    mood: 5, note: "Sport + bonne réunion",       createdAt: new Date().toISOString() },
  { id: "m7", date: daysAgo(6),    mood: 3, note: "",                            createdAt: new Date().toISOString() },
]

const SAMPLE_WATER: WaterEntry[] = [
  { date: today(),    glasses: 5 },
  { date: daysAgo(1), glasses: 8 },
  { date: daysAgo(2), glasses: 6 },
  { date: daysAgo(3), glasses: 3 },
  { date: daysAgo(4), glasses: 7 },
]

const SAMPLE_SLEEP: SleepEntry[] = [
  { id: "s1", date: today(),    hours: 7,   quality: 3, note: "",                   createdAt: new Date().toISOString() },
  { id: "s2", date: daysAgo(1), hours: 5.5, quality: 1, note: "Insomnie",           createdAt: new Date().toISOString() },
  { id: "s3", date: daysAgo(2), hours: 8,   quality: 3, note: "Très bien dormi",    createdAt: new Date().toISOString() },
  { id: "s4", date: daysAgo(3), hours: 6.5, quality: 2, note: "",                   createdAt: new Date().toISOString() },
  { id: "s5", date: daysAgo(4), hours: 7.5, quality: 3, note: "",                   createdAt: new Date().toISOString() },
]

const SAMPLE_EXERCISE: ExerciseEntry[] = [
  { id: "e1", date: today(),    type: "course",      duration: 30, note: "5km parc",     createdAt: new Date().toISOString() },
  { id: "e2", date: daysAgo(2), type: "musculation", duration: 45, note: "Haut du corps", createdAt: new Date().toISOString() },
  { id: "e3", date: daysAgo(4), type: "yoga",        duration: 60, note: "Séance relaxation", createdAt: new Date().toISOString() },
  { id: "e4", date: daysAgo(5), type: "vélo",        duration: 40, note: "",             createdAt: new Date().toISOString() },
]

export function useHealth() {
  const [moods, setMoods] = useState<MoodEntry[]>([])
  const [water, setWater] = useState<WaterEntry[]>([])
  const [sleep, setSleep] = useState<SleepEntry[]>([])
  const [exercise, setExercise] = useState<ExerciseEntry[]>([])

  useEffect(() => {
    const load = <T>(key: string, sample: T[]): T[] => {
      const stored = localStorage.getItem(key)
      if (!stored) { localStorage.setItem(key, JSON.stringify(sample)); return sample }
      return JSON.parse(stored)
    }
    setMoods(load(KEYS.mood, SAMPLE_MOOD))
    setWater(load(KEYS.water, SAMPLE_WATER))
    setSleep(load(KEYS.sleep, SAMPLE_SLEEP))
    setExercise(load(KEYS.exercise, SAMPLE_EXERCISE))
  }, [])

  // ── Mood ──
  const addMood = (mood: MoodLevel, note: string, date?: string) => {
    const d = date ?? today()
    const existing = moods.find(m => m.date === d)
    let updated: MoodEntry[]
    if (existing) {
      updated = moods.map(m => m.date === d ? { ...m, mood, note } : m)
    } else {
      updated = [{ id: crypto.randomUUID(), date: d, mood, note, createdAt: new Date().toISOString() }, ...moods]
    }
    setMoods(updated); localStorage.setItem(KEYS.mood, JSON.stringify(updated))
  }

  const deleteMood = (id: string) => {
    const updated = moods.filter(m => m.id !== id)
    setMoods(updated); localStorage.setItem(KEYS.mood, JSON.stringify(updated))
  }

  // ── Water ──
  const setWaterGlasses = (glasses: number, date?: string) => {
    const d = date ?? today()
    const exists = water.find(w => w.date === d)
    const updated = exists ? water.map(w => w.date === d ? { ...w, glasses } : w) : [...water, { date: d, glasses }]
    setWater(updated); localStorage.setItem(KEYS.water, JSON.stringify(updated))
  }

  const todayWater = water.find(w => w.date === today())?.glasses ?? 0

  // ── Sleep ──
  const addSleep = (data: Omit<SleepEntry, "id" | "createdAt">) => {
    const entry: SleepEntry = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    const updated = [entry, ...sleep.filter(s => s.date !== data.date)]
    setSleep(updated); localStorage.setItem(KEYS.sleep, JSON.stringify(updated))
  }

  const deleteSleep = (id: string) => {
    const updated = sleep.filter(s => s.id !== id)
    setSleep(updated); localStorage.setItem(KEYS.sleep, JSON.stringify(updated))
  }

  // ── Exercise ──
  const addExercise = (data: Omit<ExerciseEntry, "id" | "createdAt">) => {
    const entry: ExerciseEntry = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    const updated = [entry, ...exercise]
    setExercise(updated); localStorage.setItem(KEYS.exercise, JSON.stringify(updated))
  }

  const deleteExercise = (id: string) => {
    const updated = exercise.filter(e => e.id !== id)
    setExercise(updated); localStorage.setItem(KEYS.exercise, JSON.stringify(updated))
  }

  // ── Stats (last 7 days) ──
  const last7 = Array.from({ length: 7 }, (_, i) => daysAgo(6 - i))

  const weeklyMood = last7.map(date => {
    const entry = moods.find(m => m.date === date)
    return { date, mood: entry?.mood ?? null, label: new Date(date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short" }) }
  })

  const weeklySleep = last7.map(date => {
    const entry = sleep.find(s => s.date === date)
    return { date, hours: entry?.hours ?? null, label: new Date(date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short" }) }
  })

  const avgMood = moods.slice(0, 7).length > 0
    ? moods.slice(0, 7).reduce((s, m) => s + m.mood, 0) / moods.slice(0, 7).length
    : 0

  const avgSleep = sleep.slice(0, 7).length > 0
    ? sleep.slice(0, 7).reduce((s, e) => s + e.hours, 0) / sleep.slice(0, 7).length
    : 0

  const totalExerciseThisWeek = exercise
    .filter(e => last7.includes(e.date))
    .reduce((s, e) => s + e.duration, 0)

  return {
    moods, water, sleep, exercise,
    addMood, deleteMood,
    setWaterGlasses, todayWater,
    addSleep, deleteSleep,
    addExercise, deleteExercise,
    weeklyMood, weeklySleep,
    avgMood, avgSleep, totalExerciseThisWeek,
    todayStr: today(),
  }
}
