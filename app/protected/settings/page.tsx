"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Settings, User, Palette, Bell, Database,
  Sun, Moon, Save, Trash2, Download, RotateCcw,
  Check, AlertTriangle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/contexts/i18n-context"
import { Locale } from "@/lib/i18n/translations"
import { useConfirm } from "@/hooks/use-confirm"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useAppToast } from "@/hooks/use-app-toast"
import { AppToast } from "@/components/ui/app-toast"

type Tab = "profil" | "apparence" | "notifications" | "données"

const PROFILE_KEY = "harmonia_profile"
const NOTIF_PREF_KEY = "harmonia_notif_prefs"

interface Profile { name: string; email: string; initials: string }
interface NotifPrefs {
  task_overdue: boolean
  task_due_today: boolean
  budget_exceeded: boolean
  budget_warning: boolean
}

const DEFAULT_PROFILE: Profile = { name: "Utilisateur", email: "utilisateur@harmonia.app", initials: "U" }
const DEFAULT_NOTIF_PREFS: NotifPrefs = { task_overdue: true, task_due_today: true, budget_exceeded: true, budget_warning: true }

const LOCALE_FLAGS: Record<Locale, { flag: string; label: string }> = {
  en: { flag: "🇬🇧", label: "English" },
  fr: { flag: "🇫🇷", label: "Français" },
  mg: { flag: "🇲🇬", label: "Malagasy" },
}

const DATA_KEYS = [
  { key: "harmonia_tasks",       label: "Tâches",       color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-950"   },
  { key: "harmonia_transactions",label: "Transactions",  color: "text-emerald-600",bg: "bg-emerald-50 dark:bg-emerald-950" },
  { key: "harmonia_budgets",     label: "Budgets",       color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950" },
  { key: "harmonia_mood",        label: "Humeur",        color: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-950"  },
  { key: "harmonia_water",       label: "Hydratation",   color: "text-cyan-600",   bg: "bg-cyan-50 dark:bg-cyan-950"   },
  { key: "harmonia_sleep",       label: "Sommeil",       color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950" },
  { key: "harmonia_exercise",    label: "Activité",      color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950" },
  { key: "harmonia_journal",     label: "Journal",       color: "text-pink-600",   bg: "bg-pink-50 dark:bg-pink-950"   },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-violet-600" : "bg-gray-200 dark:bg-gray-600"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4.5" : "translate-x-0.5"}`} />
    </button>
  )
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { locale, setLocale } = useI18n()
  const { toasts, addToast, dismiss } = useAppToast()
  const { ask, confirmState, handleConfirm, handleCancel } = useConfirm()
  const searchParams = useSearchParams()

  const [tab, setTab] = useState<Tab>(() => {
    const t = searchParams.get("tab") as Tab | null
    return t && ["profil", "apparence", "notifications", "données"].includes(t) ? t : "profil"
  })
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [profileDraft, setProfileDraft] = useState<Profile>(DEFAULT_PROFILE)
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(DEFAULT_NOTIF_PREFS)

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY)
    if (stored) { const p = JSON.parse(stored); setProfile(p); setProfileDraft(p) }
    const storedNotif = localStorage.getItem(NOTIF_PREF_KEY)
    if (storedNotif) setNotifPrefs(JSON.parse(storedNotif))
  }, [])

  const saveProfile = () => {
    const updated = { ...profileDraft, initials: profileDraft.name.slice(0, 2).toUpperCase() || "U" }
    setProfile(updated)
    setProfileDraft(updated)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))
    addToast("success", "Profil mis à jour")
  }

  const saveNotifPrefs = (prefs: NotifPrefs) => {
    setNotifPrefs(prefs)
    localStorage.setItem(NOTIF_PREF_KEY, JSON.stringify(prefs))
    addToast("success", "Préférences de notifications enregistrées")
  }

  const exportData = () => {
    const data: Record<string, unknown> = {}
    DATA_KEYS.forEach(({ key, label }) => {
      const val = localStorage.getItem(key)
      data[label] = val ? JSON.parse(val) : []
    })
    data["Profil"] = profile
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `harmonia-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    addToast("success", "Données exportées avec succès")
  }

  const clearDataKey = async (key: string, label: string) => {
    const ok = await ask({
      title: `Effacer les données "${label}" ?`,
      message: "Cette action est irréversible. Toutes ces données seront perdues.",
      confirmLabel: "Effacer",
      variant: "danger",
    })
    if (ok) {
      localStorage.removeItem(key)
      addToast("success", `Données "${label}" effacées`)
    }
  }

  const resetAllData = async () => {
    const ok = await ask({
      title: "Réinitialiser toutes les données ?",
      message: "Toutes vos données (tâches, finances, santé, journal...) seront supprimées définitivement. Les données d'exemple seront restaurées au prochain chargement.",
      confirmLabel: "Tout réinitialiser",
      variant: "danger",
    })
    if (ok) {
      DATA_KEYS.forEach(({ key }) => localStorage.removeItem(key))
      localStorage.removeItem("harmonia_notifs_dismissed")
      addToast("success", "Données réinitialisées — rechargez la page pour restaurer les exemples")
    }
  }

  const TABS: { value: Tab; label: string; icon: React.ReactNode }[] = [
    { value: "profil",         label: "Profil",         icon: <User className="h-4 w-4" /> },
    { value: "apparence",      label: "Apparence",      icon: <Palette className="h-4 w-4" /> },
    { value: "notifications",  label: "Notifications",  icon: <Bell className="h-4 w-4" /> },
    { value: "données",        label: "Données",        icon: <Database className="h-4 w-4" /> },
  ]

  const cardClass = "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AppToast toasts={toasts} onDismiss={dismiss} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Paramètres</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gérez votre profil, apparence et données</p>
        </div>
      </div>

      <div className="flex gap-6">

        {/* Sidebar tabs */}
        <div className="w-48 shrink-0 space-y-1">
          {TABS.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                tab === t.value
                  ? "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
              }`}>
              <span className={tab === t.value ? "text-violet-600 dark:text-violet-400" : "text-gray-400"}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* ── Profil ── */}
          {tab === "profil" && (
            <div className={`${cardClass} p-6 space-y-5`}>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Informations personnelles</h2>

              {/* Avatar preview */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                  <span className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                    {profileDraft.initials || profileDraft.name.slice(0, 2).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{profileDraft.name || "Utilisateur"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{profileDraft.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Nom complet</label>
                  <input
                    value={profileDraft.name}
                    onChange={e => setProfileDraft({ ...profileDraft, name: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full h-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-violet-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Adresse e-mail</label>
                  <input
                    type="email"
                    value={profileDraft.email}
                    onChange={e => setProfileDraft({ ...profileDraft, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full h-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-violet-400 transition"
                  />
                </div>
              </div>

              <button
                onClick={saveProfile}
                disabled={profileDraft.name === profile.name && profileDraft.email === profile.email}
                className="flex items-center gap-2 px-5 h-10 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" /> Enregistrer le profil
              </button>
            </div>
          )}

          {/* ── Apparence ── */}
          {tab === "apparence" && (
            <div className="space-y-4">

              {/* Theme */}
              <div className={`${cardClass} p-6`}>
                <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Thème de l'interface</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "light", label: "Mode clair",  icon: <Sun className="h-5 w-5" />,  desc: "Interface lumineuse et nette" },
                    { value: "dark",  label: "Mode sombre", icon: <Moon className="h-5 w-5" />, desc: "Reposant pour les yeux" },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setTheme(opt.value)}
                      className={`relative flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                        theme === opt.value
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-950"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-700"
                      }`}>
                      {theme === opt.value && (
                        <span className="absolute top-2 right-2 h-5 w-5 bg-violet-600 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </span>
                      )}
                      <span className={theme === opt.value ? "text-violet-600 dark:text-violet-400" : "text-gray-500 dark:text-gray-400"}>
                        {opt.icon}
                      </span>
                      <span className={`text-sm font-semibold ${theme === opt.value ? "text-violet-700 dark:text-violet-300" : "text-gray-700 dark:text-gray-200"}`}>{opt.label}</span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className={`${cardClass} p-6`}>
                <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Langue de l'interface</h2>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.entries(LOCALE_FLAGS) as [Locale, { flag: string; label: string }][]).map(([l, cfg]) => (
                    <button key={l} onClick={() => { setLocale(l); addToast("success", `Langue changée : ${cfg.label}`) }}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        locale === l
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-950"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-700"
                      }`}>
                      {locale === l && (
                        <span className="absolute top-2 right-2 h-5 w-5 bg-violet-600 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </span>
                      )}
                      <span className="text-2xl">{cfg.flag}</span>
                      <span className={`text-sm font-semibold ${locale === l ? "text-violet-700 dark:text-violet-300" : "text-gray-700 dark:text-gray-200"}`}>{cfg.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {tab === "notifications" && (
            <div className={`${cardClass} p-6 space-y-5`}>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Préférences de notifications</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Choisissez quels types d'alertes vous souhaitez recevoir.</p>

              <div className="space-y-1">
                {[
                  {
                    key: "task_overdue" as keyof NotifPrefs,
                    label: "Tâches en retard",
                    desc: "Alertes pour les tâches dont la date limite est dépassée",
                    severity: "critical",
                    dot: "bg-red-500",
                  },
                  {
                    key: "task_due_today" as keyof NotifPrefs,
                    label: "Tâches du jour",
                    desc: "Rappels pour les tâches à effectuer aujourd'hui",
                    severity: "warning",
                    dot: "bg-amber-500",
                  },
                  {
                    key: "budget_exceeded" as keyof NotifPrefs,
                    label: "Budget dépassé",
                    desc: "Alertes lorsqu'une catégorie dépasse son budget mensuel",
                    severity: "critical",
                    dot: "bg-red-500",
                  },
                  {
                    key: "budget_warning" as keyof NotifPrefs,
                    label: "Budget presque atteint",
                    desc: "Avertissements à 80% du budget consommé",
                    severity: "warning",
                    dot: "bg-amber-500",
                  },
                ].map(item => (
                  <div key={item.key}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${item.dot}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                    <Toggle
                      checked={notifPrefs[item.key]}
                      onChange={val => saveNotifPrefs({ ...notifPrefs, [item.key]: val })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Données ── */}
          {tab === "données" && (
            <div className="space-y-4">

              {/* Export */}
              <div className={`${cardClass} p-6`}>
                <div className="flex items-center gap-3 mb-1">
                  <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Exporter mes données</h2>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Téléchargez toutes vos données Harmonia au format JSON (tâches, finances, santé, journal).
                </p>
                <button onClick={exportData}
                  className="flex items-center gap-2 h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                  <Download className="h-4 w-4" /> Télécharger l'export JSON
                </button>
              </div>

              {/* Clear by category */}
              <div className={`${cardClass} p-6`}>
                <div className="flex items-center gap-3 mb-1">
                  <Trash2 className="h-4 w-4 text-red-500" />
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Effacer des données par catégorie</h2>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Supprimez uniquement les données d'une section. Les autres données restent intactes.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DATA_KEYS.map(({ key, label, color, bg }) => (
                    <button key={key} onClick={() => clearDataKey(key, label)}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950 group transition-all`}>
                      <span className={`text-xs font-medium ${color}`}>{label}</span>
                      <Trash2 className="h-3.5 w-3.5 text-gray-300 group-hover:text-red-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset all */}
              <div className={`${cardClass} p-6 border-red-100 dark:border-red-900`}>
                <div className="flex items-center gap-3 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">Zone dangereuse</h2>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Réinitialisez toutes vos données. Les données d'exemple seront restaurées au prochain chargement de la page.
                </p>
                <button onClick={resetAllData}
                  className="flex items-center gap-2 h-9 px-4 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm font-medium rounded-lg transition-colors">
                  <RotateCcw className="h-4 w-4" /> Réinitialiser toutes les données
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

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
