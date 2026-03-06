"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { navigation } from "@/lib/navigation"
import { useI18n } from "@/contexts/i18n-context"
import { getSession, clearSession } from "@/lib/auth"

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const { t, locale } = useI18n()

  const [profile, setProfile] = useState({ name: "", initials: "U", email: "" })

  useEffect(() => {
    const session = getSession()
    if (session) {
      setProfile({
        name: session.name,
        initials: session.name.slice(0, 2).toUpperCase() || "U",
        email: session.email,
      })
    }
    const stored = localStorage.getItem("harmonia_profile")
    if (stored) {
      const p = JSON.parse(stored)
      setProfile({ name: p.name, initials: p.initials || p.name.slice(0, 2).toUpperCase(), email: p.email })
    }
  }, [pathname])

  const getLabel = (label: string) => {
    const key = label.toLowerCase() as keyof typeof t.nav
    return t.nav[key] ?? label
  }

  const handleLogout = () => {
    clearSession()
    router.push("/unauthenticated/login")
  }

  return (
    <aside
      className={`
        relative flex flex-col
        bg-white dark:bg-gray-900
        border-r border-gray-100 dark:border-gray-800
        transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
        ${collapsed ? "w-[68px]" : "w-[250px]"}
        min-h-screen shrink-0
      `}
    >
      {/* ── Brand ── */}
      <div className={`flex items-center h-16 ${collapsed ? "justify-center px-2" : "px-5 gap-3"}`}>
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
          <span className="text-white text-sm font-bold tracking-tight">H</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-bold text-gray-900 dark:text-gray-50 tracking-tight">Harmonia</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5">
              {locale === "en" ? "Productivity Suite" : locale === "mg" ? "Fitaovam-pamokarana" : "Suite de productivité"}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navigation.map((section, sIdx) => (
          <div key={section.section}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400/80 dark:text-gray-500/80">
                {t.sections[section.section as keyof typeof t.sections] ?? section.section}
              </p>
            )}

            {collapsed && sIdx > 0 && (
              <div className="mx-auto mb-2 w-6 h-px bg-gray-200 dark:bg-gray-700" />
            )}

            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? getLabel(item.label) : undefined}
                      className={`
                        group relative flex items-center gap-3 rounded-xl h-10
                        text-[13px] font-medium transition-all duration-200
                        ${collapsed ? "justify-center px-0 w-full" : "px-3"}
                        ${isActive
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25"
                          : "text-gray-500 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-950/60 hover:text-violet-700 dark:hover:text-violet-300"
                        }
                      `}
                    >
                      <Icon className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ${!isActive ? "group-hover:scale-110" : ""}`} />
                      {!collapsed && <span>{getLabel(item.label)}</span>}

                      {/* Active indicator pill for collapsed */}
                      {isActive && collapsed && (
                        <span className="absolute -left-[3px] top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-violet-600" />
                      )}

                      {/* Notification badge */}
                      {item.label === "Notifications" && !isActive && (
                        <NotifBadge collapsed={collapsed} />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-3 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

      {/* ── User Footer ── */}
      <div className={`p-3 ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
        <div className={`flex items-center ${collapsed ? "flex-col gap-2" : "gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"}`}>
          <Avatar className={`${collapsed ? "h-8 w-8" : "h-9 w-9"} shrink-0 ring-2 ring-violet-100 dark:ring-violet-900`}>
            <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 text-violet-700 dark:text-violet-300 text-xs font-bold">
              {profile.initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight">{profile.name || "Utilisateur"}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{profile.email}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} title={t.header.logout}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors shrink-0">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <button onClick={handleLogout} title={t.header.logout}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
            <LogOut className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Collapse Toggle ── */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="
          absolute -right-3 top-[52px]
          h-6 w-6 flex items-center justify-center
          rounded-full bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700
          transition-all duration-200 z-10 hover:scale-110
        "
      >
        {collapsed
          ? <ChevronRight className="h-3 w-3 text-gray-500" />
          : <ChevronLeft className="h-3 w-3 text-gray-500" />
        }
      </button>
    </aside>
  )
}

/** Live notification count badge */
function NotifBadge({ collapsed }: { collapsed: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const compute = () => {
      try {
        const tasks = JSON.parse(localStorage.getItem("harmonia_tasks") || "[]")
        const dismissed = JSON.parse(localStorage.getItem("harmonia_notifs_dismissed") || "[]")
        const dismissedSet = new Set(dismissed)
        const today = new Date().toISOString().slice(0, 10)
        let n = 0
        for (const t of tasks) {
          if (t.status === "terminé") continue
          if (t.dueDate && t.dueDate < today && !dismissedSet.has(`task_overdue_${t.id}`)) n++
          if (t.dueDate === today && !dismissedSet.has(`task_due_today_${t.id}`)) n++
        }
        setCount(n)
      } catch { setCount(0) }
    }
    compute()
    const id = setInterval(compute, 30_000)
    return () => clearInterval(id)
  }, [])

  if (count === 0) return null

  if (collapsed) {
    return <span className="absolute top-1 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900 animate-pulse" />
  }

  return (
    <span className="ml-auto text-[10px] font-bold bg-red-500 text-white h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-sm">
      {count > 99 ? "99+" : count}
    </span>
  )
}
