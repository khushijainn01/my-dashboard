import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { House, Bot, Bell, Menu, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "@/contexts/ThemeContext"

interface HeaderProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const [showAIChat, setShowAIChat] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-[#2B2A8F] px-6 py-2 text-white">
      <nav className="flex w-full items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mr-auto text-white hover:bg-white/10 hover:text-white"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="text-white hover:bg-white/10 hover:text-white"
          aria-label="Go to dashboard"
        >
          <House size={22} />
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAIChat(!showAIChat)}
            className="text-white hover:bg-white/10 hover:text-white"
            aria-label="AI assistant"
          >
            <Bot size={22} />
          </Button>

          {showAIChat && (
            <Card className="absolute top-10 -left-72 z-50 flex h-96 w-80 flex-col shadow-xl">
              <div className="rounded-t-xl bg-[#2B2A8F] p-3 font-semibold text-white">
                AI Assistant
              </div>
              <CardContent className="flex flex-1 flex-col gap-2 p-3">
                <div className="inline-block rounded-lg bg-muted p-2 text-sm font-medium text-[#2B2A8F]">
                  Hi! How can I help you today?
                </div>
                <div className="mt-auto flex gap-2 border-t pt-3">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button size="sm" className="bg-[#2B2A8F] hover:bg-[#232273]">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-white hover:bg-white/10 hover:text-white"
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/notifications")}
          className="text-white hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={22} />
        </Button>
      </nav>
    </header>
  )
}
