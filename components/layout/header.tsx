"use client"

import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon, Bell, ChevronDown, Check } from "lucide-react"
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

const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  mg: "🇲🇬",
}

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { locale, setLocale, t } = useI18n()

  const pageTitle = t.pages[pathname as keyof typeof t.pages] ?? "Harmonia"

  return (
    <header className="flex h-14 items-center justify-between px-5 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0">

      {/* Page title */}
      <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100 ml-6">
        {pageTitle}
      </h1>

      {/* Right controls */}
      <div className="flex items-center gap-1">

        {/* Dark mode toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={theme === "dark" ? t.theme.light : t.theme.dark}
        >
          {theme === "dark"
            ? <Sun className="h-4 w-4" />
            : <Moon className="h-4 w-4" />
          }
        </button>

        {/* Notifications */}
        <button className="relative h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-500" />
        </button>

        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span>{LOCALE_FLAGS[locale]}</span>
              <span className="text-xs font-medium uppercase">{locale}</span>
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
            <button className="flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-xs font-semibold">
                  K
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">Example</span>
              <ChevronDown className="h-3 w-3 text-gray-400 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem className="cursor-pointer">{t.header.profile}</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">{t.header.settings}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
              {t.header.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
