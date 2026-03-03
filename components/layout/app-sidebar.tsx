"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PanelLeft } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { navigation } from "@/lib/navigation"

export default function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <div className="relative flex">

      <Sidebar
        className={`
          bg-white
          border-r
          transition-all
          duration-300
          ease-[cubic-bezier(.4,0,.2,1)]
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        <SidebarHeader className="flex items-center px-3 py-2 border-b">
          {!collapsed && (
            <span className="text-sm font-semibold">Harmonia</span>
          )}
        </SidebarHeader>

        <SidebarContent className="p-2">
          {navigation.map((section) => (
            <SidebarGroup key={section.section}>
              {!collapsed && (
                <SidebarGroupLabel className="px-2 text-[10px] uppercase text-muted-foreground">
                  {section.section}
                </SidebarGroupLabel>
              )}

              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="h-9 rounded-lg px-2"
                        onClick={() => setLoading(true)}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2 ${
                            collapsed ? "justify-center" : ""
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />

                          {!collapsed && (
                            <span className="truncate">
                              {item.label}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}

          {loading && (
            <div className="space-y-2 mt-4">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t p-2">
          <div
            className={`flex items-center gap-2 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback>RH</AvatarFallback>
            </Avatar>

            {!collapsed && (
              <div className="flex flex-col text-sm">
                <span className="font-medium">Example</span>
                <span className="text-xs text-muted-foreground">
                  example@gmail.com
                </span>
              </div>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>

      <button
        onClick={toggleSidebar}
        className="
          absolute
          top-4
          left-full
           ml-3
          h-8 w-8
          flex items-center justify-center
          rounded-full
          border
          bg-white
          shadow-sm
          hover:bg-muted
          transition-all
          duration300
        "
      >
        <PanelLeft
          className={`h-4 w-4 transition-transform duration-300 ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </button>

    </div>
  )
}