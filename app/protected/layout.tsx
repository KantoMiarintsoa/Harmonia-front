import { Header } from "@/components/layout/header"
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <div className="sticky top-0 z-20 border-b bg-black">
            <Header />
          </div>

          <main className="flex-1 bg-blue-300 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}