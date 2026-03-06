import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  Heart,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react"

export const navigation = [
  {
    section: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: "/protected/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Tasks",
        href: "/protected/tasks",
        icon: CheckSquare,
      },
      {
        label: "Finance",
        href: "/protected/finance",
        icon: Wallet,
      },
      {
        label: "Health",
        href: "/protected/health",
        icon: Heart,
      },
      {
        label: "Notifications",
        href: "/protected/notifications",
        icon: Bell,
      },
      {
        label: "AI",
        href: "/protected/ai",
        icon: Sparkles,
      },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      {
        label: "Settings",
        href: "/protected/settings",
        icon: Settings,
      },
    ],
  },
]