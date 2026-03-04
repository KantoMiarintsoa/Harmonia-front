"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { navigation } from "@/lib/navigation"

export default function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        relative flex flex-col
        bg-white border-r border-gray-100
        transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
        ${collapsed ? "w-16" : "w-60"}
        min-h-screen
      `}
    >
      {/* Header */}
      <div className={`flex items-center h-14 border-b border-gray-100 ${collapsed ? "justify-center px-2" : "px-4 gap-2"}`}>
        <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">H</span>
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-gray-800">Harmonia</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-5 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {section.section}
              </p>
            )}

            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 rounded-lg px-3 h-9
                        text-sm font-medium transition-colors
                        ${collapsed ? "justify-center px-0 w-full" : ""}
                        ${isActive
                          ? "bg-violet-600 text-white"
                          : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                        }
                      `}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`border-t border-gray-100 p-3 ${collapsed ? "flex justify-center" : ""}`}>
        <div className={`flex items-center gap-2 ${collapsed ? "" : ""}`}>
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-semibold">RH</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-800 truncate">Example</span>
              <span className="text-xs text-gray-400 truncate">example@gmail.com</span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="
          absolute -right-3 top-[58px]
          h-6 w-6
          flex items-center justify-center
          rounded-full
          bg-white border border-gray-200
          shadow-sm
          hover:bg-gray-50
          transition-colors z-10
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
