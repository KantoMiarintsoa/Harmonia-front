"use client"

import { ThemeProvider } from "next-themes"
import { I18nProvider } from "@/contexts/i18n-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <I18nProvider>
        {children}
      </I18nProvider>
    </ThemeProvider>
  )
}
