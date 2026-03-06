"use client"

import { Heart, Smile, Droplets, Moon, Dumbbell } from "lucide-react"
import { useHealth } from "@/features/health/hooks/use-health"
import { useAppToast } from "@/hooks/use-app-toast"
import { useConfirm } from "@/hooks/use-confirm"
import { AppToast } from "@/components/ui/app-toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { MoodTracker } from "@/features/health/_components/mood-tracker"
import { WaterTracker } from "@/features/health/_components/water-tracker"
import { SleepTracker } from "@/features/health/_components/sleep-tracker"
import { ExerciseTracker } from "@/features/health/_components/exercise-tracker"
import { JournalTracker } from "@/features/health/_components/journal-tracker"
import { ManualTracker } from "@/features/health/_components/manual-tracker"
import { MOOD_CONFIG, WATER_GOAL } from "@/features/health/types"
import { useI18n } from "@/contexts/i18n-context"

const LABELS = {
  en: {
    title: "Health & Wellness", subtitle: "Track your daily health habits",
    moodToday: "Today's mood", hydration: "Hydration", sleep: "Tonight's sleep", activity: "Activity this week",
    avg7: "7d avg", goalReached: "Goal reached!", remaining: (n: number) => `${n} glass${n > 1 ? "es" : ""} left`,
    whoGoal: "% of WHO goal",
    delMood: "Delete this mood entry?", delSleep: "Delete this sleep entry?",
    delExercise: "Delete this activity?", delJournal: "Delete this journal entry?",
    irreversible: "This action is irreversible.", delete: "Delete",
    moodSaved: "Mood recorded", sleepSaved: (h: number) => `Sleep recorded: ${h}h`,
    exerciseSaved: (d: number) => `Activity recorded: ${d} min`,
    waterSaved: (n: number) => `Hydration updated: ${n} glass${n > 1 ? "es" : ""}`,
    journalAdded: "Journal entry added", journalUpdated: "Journal updated",
    moodDeleted: "Mood entry deleted", sleepDeleted: "Sleep entry deleted",
    exerciseDeleted: "Activity deleted", journalDeleted: "Journal entry deleted",
    saveError: "Error saving",
  },
  fr: {
    title: "Santé & Bien-être", subtitle: "Suivez vos habitudes de santé au quotidien",
    moodToday: "Humeur aujourd'hui", hydration: "Hydratation", sleep: "Sommeil cette nuit", activity: "Activité cette semaine",
    avg7: "Moy. 7j", goalReached: "Objectif atteint !", remaining: (n: number) => `${n} verre${n > 1 ? "s" : ""} restant${n > 1 ? "s" : ""}`,
    whoGoal: "% de l'objectif OMS",
    delMood: "Supprimer cette entrée d'humeur ?", delSleep: "Supprimer cette entrée de sommeil ?",
    delExercise: "Supprimer cette activité ?", delJournal: "Supprimer cette entrée de journal ?",
    irreversible: "Cette action est irréversible.", delete: "Supprimer",
    moodSaved: "Humeur enregistrée", sleepSaved: (h: number) => `Sommeil enregistré : ${h}h`,
    exerciseSaved: (d: number) => `Activité enregistrée : ${d} min`,
    waterSaved: (n: number) => `Hydratation mise à jour : ${n} verre${n > 1 ? "s" : ""}`,
    journalAdded: "Entrée de journal ajoutée", journalUpdated: "Journal mis à jour",
    moodDeleted: "Entrée d'humeur supprimée", sleepDeleted: "Entrée de sommeil supprimée",
    exerciseDeleted: "Activité supprimée", journalDeleted: "Entrée de journal supprimée",
    saveError: "Erreur lors de l'enregistrement",
  },
  mg: {
    title: "Fahasalamana & Fiadanana", subtitle: "Araho ny fandaharam-pahasalamana andavanandro",
    moodToday: "Fihetseham-po androany", hydration: "Fisotroana rano", sleep: "Torimaso ity alina ity", activity: "Hetsika ity herinandro ity",
    avg7: "Moy. 7andro", goalReached: "Tanteraka ny tanjona!", remaining: (n: number) => `${n} kaopy sisa`,
    whoGoal: "% ny tanjona OMS",
    delMood: "Hamafa ity fihetseham-po ity?", delSleep: "Hamafa ity torimaso ity?",
    delExercise: "Hamafa ity hetsika ity?", delJournal: "Hamafa ity firaketana ity?",
    irreversible: "Tsy azo averina.", delete: "Fafao",
    moodSaved: "Voarakitra ny fihetseham-po", sleepSaved: (h: number) => `Torimaso voarakitra: ${h}h`,
    exerciseSaved: (d: number) => `Hetsika voarakitra: ${d} min`,
    waterSaved: (n: number) => `Voaova ny fisotroana: ${n} kaopy`,
    journalAdded: "Voanampy ny firaketana", journalUpdated: "Voaova ny diary",
    moodDeleted: "Voafafa ny fihetseham-po", sleepDeleted: "Voafafa ny torimaso",
    exerciseDeleted: "Voafafa ny hetsika", journalDeleted: "Voafafa ny firaketana",
    saveError: "Hadisoana",
  },
}

export default function HealthPage() {
  const {
    moods, sleep, exercise, journal,
    addMood, deleteMood,
    setWaterGlasses, todayWater,
    addSleep, deleteSleep,
    addExercise, deleteExercise,
    addJournalEntry, updateJournalEntry, deleteJournalEntry,
    avgMood, avgSleep, totalExerciseThisWeek,
    todayStr,
  } = useHealth()

  const { toasts, addToast, dismiss } = useAppToast()
  const { ask, confirmState, handleConfirm, handleCancel } = useConfirm()
  const { locale } = useI18n()
  const l = LABELS[locale]

  const cardClass = "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"

  const todayMood = moods.find(m => m.date === todayStr)
  const todaySleep = sleep.find(s => s.date === todayStr)

  const handleAddMood: typeof addMood = (...args) => {
    try { addMood(...args); addToast("success", l.moodSaved) }
    catch { addToast("error", l.saveError) }
  }
  const handleAddSleep: typeof addSleep = (data) => {
    try { addSleep(data); addToast("success", l.sleepSaved(data.hours)) }
    catch { addToast("error", l.saveError) }
  }
  const handleAddExercise: typeof addExercise = (data) => {
    try { addExercise(data); addToast("success", l.exerciseSaved(data.duration)) }
    catch { addToast("error", l.saveError) }
  }
  const handleSetWater = (n: number) => {
    try { setWaterGlasses(n); addToast("success", l.waterSaved(n)) }
    catch { addToast("error", l.saveError) }
  }
  const handleAddJournal: typeof addJournalEntry = (data) => {
    try { addJournalEntry(data); addToast("success", l.journalAdded) }
    catch { addToast("error", l.saveError) }
  }
  const handleUpdateJournal: typeof updateJournalEntry = (id, data) => {
    try { updateJournalEntry(id, data); addToast("success", l.journalUpdated) }
    catch { addToast("error", l.saveError) }
  }
  const handleDeleteMood = async (id: string) => {
    const ok = await ask({ title: l.delMood, message: l.irreversible, confirmLabel: l.delete, variant: "danger" })
    if (ok) { deleteMood(id); addToast("success", l.moodDeleted) }
  }
  const handleDeleteSleep = async (id: string) => {
    const ok = await ask({ title: l.delSleep, message: l.irreversible, confirmLabel: l.delete, variant: "danger" })
    if (ok) { deleteSleep(id); addToast("success", l.sleepDeleted) }
  }
  const handleDeleteExercise = async (id: string) => {
    const ok = await ask({ title: l.delExercise, message: l.irreversible, confirmLabel: l.delete, variant: "danger" })
    if (ok) { deleteExercise(id); addToast("success", l.exerciseDeleted) }
  }
  const handleDeleteJournal = async (id: string) => {
    const ok = await ask({ title: l.delJournal, message: l.irreversible, confirmLabel: l.delete, variant: "danger" })
    if (ok) { deleteJournalEntry(id); addToast("success", l.journalDeleted) }
  }

  const kpis = [
    {
      icon: <Smile className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
      bg: "bg-amber-50 dark:bg-amber-950",
      label: l.moodToday,
      value: todayMood ? `${MOOD_CONFIG[todayMood.mood].emoji} ${MOOD_CONFIG[todayMood.mood].label}` : "—",
      sub: `${l.avg7}: ${avgMood > 0 ? avgMood.toFixed(1) : "—"} / 5`,
    },
    {
      icon: <Droplets className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      bg: "bg-blue-50 dark:bg-blue-950",
      label: l.hydration,
      value: `${todayWater} / ${WATER_GOAL}`,
      sub: todayWater >= WATER_GOAL ? l.goalReached : l.remaining(WATER_GOAL - todayWater),
    },
    {
      icon: <Moon className="h-5 w-5 text-violet-500 dark:text-violet-400" />,
      bg: "bg-violet-50 dark:bg-violet-950",
      label: l.sleep,
      value: todaySleep ? `${todaySleep.hours}h` : "—",
      sub: `${l.avg7}: ${avgSleep > 0 ? avgSleep.toFixed(1) + "h" : "—"}`,
    },
    {
      icon: <Dumbbell className="h-5 w-5 text-orange-500 dark:text-orange-400" />,
      bg: "bg-orange-50 dark:bg-orange-950",
      label: l.activity,
      value: `${totalExerciseThisWeek} min`,
      sub: `${Math.round(Math.min((totalExerciseThisWeek / 150) * 100, 100))}${l.whoGoal}`,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AppToast toasts={toasts} onDismiss={dismiss} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-pink-50 dark:bg-pink-950 flex items-center justify-center">
          <Heart className="h-5 w-5 text-pink-500 dark:text-pink-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{l.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{l.subtitle}</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`${cardClass} p-4 flex items-center gap-3`}>
            <div className={`h-10 w-10 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
              {kpi.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{kpi.label}</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{kpi.value}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Manual quick tracker */}
      <ManualTracker
        todayWater={todayWater}
        todayStr={todayStr}
        onSetWater={handleSetWater}
        onAddSleep={handleAddSleep}
        onAddExercise={handleAddExercise}
        onSuccess={(msg) => addToast("success", msg)}
      />

      {/* Detailed trackers */}
      <div className="grid grid-cols-2 gap-6">
        <MoodTracker
          moods={moods}
          onAdd={handleAddMood}
          onDelete={handleDeleteMood}
          todayStr={todayStr}
        />
        <WaterTracker
          glasses={todayWater}
          onSet={handleSetWater}
        />
        <SleepTracker
          entries={sleep}
          onAdd={handleAddSleep}
          onDelete={handleDeleteSleep}
          todayStr={todayStr}
        />
        <ExerciseTracker
          entries={exercise}
          onAdd={handleAddExercise}
          onDelete={handleDeleteExercise}
          todayStr={todayStr}
          totalMinutesThisWeek={totalExerciseThisWeek}
        />
      </div>

      {/* Journal — full width */}
      <JournalTracker
        entries={journal}
        onAdd={handleAddJournal}
        onUpdate={handleUpdateJournal}
        onDelete={handleDeleteJournal}
        todayStr={todayStr}
      />

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        variant={confirmState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}
