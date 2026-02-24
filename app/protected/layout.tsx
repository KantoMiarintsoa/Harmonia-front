import { Header } from "@/components/ui/header"
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
      <Sidebar />

      <div className="w-full">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
    </SidebarProvider>
    
  )
}