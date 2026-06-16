import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  User,
  Users,
  Bell,
  ClipboardList,
  BarChart3,
  Shield,
  Settings,
  MessageSquare,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { STORAGE_KEYS } from "@/lib/storage"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isSidebarOpen: boolean
}

const navItems = [
  { label: "Profile", icon: User, path: "/profile" },
  { label: "User", icon: Users, path: "/user" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Activity Logs", icon: ClipboardList, path: "/activity-logs" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Security", icon: Shield, path: "/security" },
  { label: "Settings", icon: Settings, path: "/settings" },
  { label: "Feedback", icon: MessageSquare, path: "/feedback" },
]

export default function Sidebar({ isSidebarOpen }: SidebarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const profileImage =
    localStorage.getItem(STORAGE_KEYS.profileImage) ?? undefined

  const handleSignOut = () => {
    logout()
    navigate("/")
  }

  return (
    <aside
      className={cn(
        "fixed top-12 left-0 z-40 flex h-[calc(100vh-48px)] flex-col justify-between border-r bg-sidebar p-2 text-sidebar-foreground",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <ul className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, path }) => (
          <li key={path}>
            <Button
              variant="ghost"
              onClick={() => navigate(path)}
              className={cn(
                "w-full justify-start gap-3 border-b border-border/50 rounded-none",
                !isSidebarOpen && "justify-center px-0"
              )}
            >
              <Icon size={18} />
              {isSidebarOpen && label}
            </Button>
          </li>
        ))}
      </ul>

      <div className="relative border-t pt-4">
        <button
          type="button"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-muted"
        >
          <Avatar size="lg">
            <AvatarImage src={profileImage} alt="Profile" />
            <AvatarFallback>KJ</AvatarFallback>
          </Avatar>

          {isSidebarOpen && (
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">Khushi Jain</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          )}
        </button>

        {showProfileMenu && (
          <div className="mt-2 overflow-hidden rounded-lg border bg-popover shadow-md">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-destructive hover:text-destructive"
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}
