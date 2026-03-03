import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  Heart,
  Bell,
  Settings,
} from "lucide-react"

export const navigation = [
  {
    section: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Tasks",
        href: "/tasks",
        icon: CheckSquare,
      },
      {
        label: "Finance",
        href: "/finance",
        icon: Wallet,
      },
      {
        label: "Health",
        href: "/health",
        icon: Heart,
      },
      {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
      },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
]