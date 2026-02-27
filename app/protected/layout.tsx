import { Header } from "@/components/ui/header"
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        
        {/* couleur appliquée directement */}
        <Sidebar className="bg-red-400 text-white" />

        <div className="flex flex-1 flex-col">
          <div className="sticky top-0 z-20 border-b bg-black">
            <Header />
          </div>

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}