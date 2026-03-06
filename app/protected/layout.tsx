import AppSidebar from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"
import { AuthGuard } from "@/features/auth/_components/auth-guard"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
