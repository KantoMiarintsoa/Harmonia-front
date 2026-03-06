"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon, Bell, ChevronDown, Check, AlertTriangle, Clock, TrendingDown, ArrowRight, CheckCheck, BellOff, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useI18n } from "@/contexts/i18n-context"
import { Locale } from "@/lib/i18n/translations"
import { useNotifications } from "@/features/notifications/hooks/use-notifications"
import { NotificationItem, NotifType } from "@/features/notifications/types"
import { clearSession } from "@/lib/auth"
import Link from "next/link"

const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  mg: "🇲🇬",
}

const TYPE_ICON: Record<NotifType, React.ReactNode> = {
  task_overdue:    <AlertTriangle className="h-3.5 w-3.5" />,
  task_due_today:  <Clock className="h-3.5 w-3.5" />,
  budget_exceeded: <TrendingDown className="h-3.5 w-3.5" />,
  budget_warning:  <TrendingDown className="h-3.5 w-3.5" />,
}

const SEV_DOT: Record<string, string> = {
  critical: "bg-red-500",
  warning:  "bg-amber-500",
  info:     "bg-blue-500",
}

const SEV_ICON_BG: Record<string, string> = {
  critical: "bg-red-50 dark:bg-red-950 text-red-500",
  warning:  "bg-amber-50 dark:bg-amber-950 text-amber-500",
  info:     "bg-blue-50 dark:bg-blue-950 text-blue-500",
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return "à l'instant"
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}j`
}

function NotifRow({ n, onDismiss }: { n: NotificationItem; onDismiss: (id: string) => void }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors">
      {/* Severity dot */}
      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${SEV_DOT[n.severity]}`} />

      {/* Icon */}
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${SEV_ICON_BG[n.severity]}`}>
        {TYPE_ICON[n.type]}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-tight">{n.title}</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">{timeAgo(n.timestamp)}</span>
      </div>

      {/* Actions (hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5">
        <Link href={n.link}
          className="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          title="Voir">
          <ArrowRight className="h-3 w-3" />
        </Link>
        <button onClick={() => onDismiss(n.id)}
          className="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-red-500 transition-colors"
          title="Ignorer">
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { locale, setLocale, t } = useI18n()
  const { notifications, unreadCount, dismiss, dismissAll } = useNotifications()

  const [notifOpen, setNotifOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLButtonElement>(null)

  const [profile, setProfile] = useState({ name: "Utilisateur", initials: "U" })
  useEffect(() => {
    const stored = localStorage.getItem("harmonia_profile")
    if (stored) {
      const p = JSON.parse(stored)
      setProfile({ name: p.name || "Utilisateur", initials: p.initials || p.name?.slice(0, 2).toUpperCase() || "U" })
    }
  }, [pathname]) // re-read on route change so profile updates are reflected

  // Close on outside click
  useEffect(() => {
    if (!notifOpen) return
    const handler = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node) && !bellRef.current?.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [notifOpen])

  const pageTitle = t.pages[pathname as keyof typeof t.pages] ?? "Harmonia"
  const preview = notifications.slice(0, 5)

  return (
    <header className="flex h-14 items-center justify-between px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 border-l-0 shrink-0 relative z-40">

      {/* Page title */}
      <div className="flex items-center gap-3 ml-4">
        <h1 className="text-[15px] font-bold text-gray-900 dark:text-gray-50 tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5">

        {/* Dark mode toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-950/60 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
          title={theme === "dark" ? t.theme.light : t.theme.dark}
        >
          {theme === "dark" ? <Sun className="h-[15px] w-[15px]" /> : <Moon className="h-[15px] w-[15px]" />}
        </button>

        {/* Notifications bell + dropdown */}
        <div className="relative">
          <button
            ref={bellRef}
            onClick={() => setNotifOpen(o => !o)}
            className={`relative h-8 w-8 flex items-center justify-center rounded-xl transition-all duration-200 ${notifOpen ? "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400" : "text-gray-500 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-950/60 hover:text-violet-600 dark:hover:text-violet-400"}`}
            title={t.header.notifications}
          >
            <Bell className="h-[15px] w-[15px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none ring-2 ring-white dark:ring-gray-900 animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown panel */}
          {notifOpen && (
            <div
              ref={panelRef}
              className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-2xl shadow-gray-200/50 dark:shadow-black/30 overflow-hidden z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Bell className="h-3.5 w-3.5 text-violet-500" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={() => { dismissAll(notifications.map(n => n.id)); setNotifOpen(false) }}
                    className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <CheckCheck className="h-3 w-3" /> Tout effacer
                  </button>
                )}
              </div>

              {/* List */}
              {preview.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                  <BellOff className="h-8 w-8 text-gray-200 dark:text-gray-700 mb-2" />
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Aucune notification</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Tout est en ordre !</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50 max-h-72 overflow-y-auto">
                  {preview.map(n => (
                    <NotifRow key={n.id} n={n} onDismiss={(id) => { dismiss(id) }} />
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <button
                  onClick={() => { setNotifOpen(false); router.push("/protected/notifications") }}
                  className="w-full flex items-center justify-center gap-2 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors py-1"
                >
                  Voir toutes les notifications
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-950/60 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200">
              <span className="text-sm">{LOCALE_FLAGS[locale]}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide">{locale}</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {(["en", "fr", "mg"] as Locale[]).map((l) => (
              <DropdownMenuItem
                key={l}
                onClick={() => setLocale(l)}
                className="flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>{LOCALE_FLAGS[l]}</span>
                  <span className="text-sm">{t.languages[l]}</span>
                </span>
                {locale === l && <Check className="h-3.5 w-3.5 text-violet-600" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 h-8 pl-1 pr-2.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/60 transition-all duration-200 ml-1.5 border border-transparent hover:border-violet-200/60 dark:hover:border-violet-800/40">
              <Avatar className="h-7 w-7 ring-2 ring-violet-100 dark:ring-violet-900">
                <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 text-violet-700 dark:text-violet-300 text-[10px] font-bold">
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200 hidden sm:block">{profile.name}</span>
              <ChevronDown className="h-3 w-3 text-gray-400 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/protected/settings?tab=profil")}>{t.header.profile}</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/protected/settings")}>{t.header.settings}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-500 focus:text-red-500"
              onClick={() => { clearSession(); router.push("/unauthenticated/login") }}
            >
              {t.header.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
